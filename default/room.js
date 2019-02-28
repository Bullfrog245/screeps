/**
 * Room Prototype
 *
 * @link https://docs.screeps.com/api/#Room
 */
"use strict";
/* jshint -W117 */

/**
 * Module dependencies
 */
const Debug = require("debug");
const Circle = require('helper.circle');

/**
 * Assign tasks to creeps
 *
 * Each prototype has a dispatch() function that allows it to add a task to
 * the list.
 *
 * @TODO allow multiple creeps per task
 * @TODO task priorities
 */
Room.prototype.processTasks = function() {
    // Allow all structures to queue tasks
    const structures = this.find(FIND_MY_STRUCTURES);
    for (let i = 0, l = structures.length; i < l; ++i) {
        try {
            structures[i].dispatch();
        } catch (e) {
            Debug.log(structures[i].structureType, 5);
            Debug.error(e);
        }
    }

    // Do nothing if there are no tasks
    if (!Object.keys(this.tasks).length)
        return false;

    // Order tasks by priority
    const tasks = _.sortByAll(this.tasks, ["priority"]);

    // Get idle creeps in the current room
    const idleCreeps = _.filter(Game.creeps, (c) =>
        c.memory.busy == false && c.room == this && c.spawning == false
    );

    // Process the task list
    for (const key in tasks) {
        if (!tasks.hasOwnProperty(key)) continue;

        // Load the task entity
        const task = tasks[key];
        const entity = Game.getObjectById(task.id);

        // Remove any tasks associated with stale IDs
        // (E.g., When a ConstructionSite changes to a Structure)
        if (!entity) {
            this.deleteTask(key);
            continue;
        }

        // Handle tasks that have already been assigned
        if ("processing" === task.status) {
            // If the creep assigned to this task has died, reset the status
            if (!Game.creeps[task.creep]) {
                task.status = false;
                task.creep = false;
            } else {
                // Process the task
                this.processTask(entity, task);
                continue;
            }
        }

        // If there are no idle creeps, move on to the next task
        if (!idleCreeps.length)
            continue;

        // Assign a creep to the task and process it
        const creep = idleCreeps.shift();

        creep.memory.busy = true;
        task.status = "processing";
        task.creep = creep.name;
        this.processTask(entity, task);
    }

    // If there are still idle creeps, have them build construction sites or
    // upgrade the controller. We don't set their "busy" flag, which lets them
    // be used on the next tick if a higher priority task becomes available.
    if (idleCreeps.length) {
        let constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES);
        for (let i = 0, l = constructionSites.length; i < l; ++i) {
            try {
                constructionSites[i].dispatch();
            } catch (e) {
                Debug.log(constructionSites[i].structureType);
                //Debug.log(e.stack, 5)
            }
        }

        _.forEach(idleCreeps, function (creep) {
            if (constructionSites.length) {
                constructionSites[0].build({creep: creep.name});
            } else {
                this.controller.upgrade({creep: creep.name});
            }
        }.bind(this));
    }

    // Generate construction sites. Since this is a CPU intensive operation,
    // only check if permits need pulled every 60 ticks.
    if (Game.time % 60 == 0)
        this.pullPermits();
};

Room.prototype.taskKey = function (entity, callable) {
    return [entity.id, callable].join("_");
};

/**
 * Add a task
 *
 * @param {string} id
 * @param {string} callable
 * @param {object} config
 */
Room.prototype.addTask = function (entity, callable, config = {}) {
    Debug.log(`Room.addTask(${entity.id}, ${callable}, ${config});`, 1);

    let key = this.taskKey(entity, callable);

    if (this.tasks.hasOwnProperty(key))
        return "ERR_DUPLICATE_TASK";

    // Allow custom data to be stored per task
    let defaultConfig = {
        id: entity.id,
        callback: callable,
        status: false,
        priority: 5,
        creep: false,
    };
    this.tasks[key] = _.extend(defaultConfig, config);
    Debug.log(`Task ${key} added`, 3);

    return OK;
};

/**
 * Remove a task
 *
 * @param {string} id
 */
Room.prototype.deleteTask = function (entity, callable = null) {
    Debug.log(`Room.deleteTask(${entity.id}, ${callable});`, 1);

    // If the task belongs to a non-existant entity, we won't be able to
    // generate a taskKey();
    let key = (typeof entity === 'string') ? entity : this.taskKey(entity, callable);

    // Can't delete it if it doesn't exist
    if (!this.tasks.hasOwnProperty(key))
        return ERR_NOT_FOUND;

    // Free up the creep that was working on the task
    let creep = Game.creeps[this.tasks[key].creep];
    if (creep) {
        creep.memory.busy = false;
        Debug.log(`${creep.name} no longer busy`, 3);
    }

    // Delete the task
    delete this.tasks[key];
    Debug.log(`Task ${key} deleted`, 3);

    return OK;
};

/**
 * Process a task
 *
 * @param {Structure} entity
 * @param {Object} task
 */
Room.prototype.processTask = function (entity, task) {
    try {
        entity[task.callback](task);
    } catch (e) {
        Debug.log(task.callback, 5);
        Debug.error(e);
    }
};

/**
 * Find a source with space for harvesting
 *
 * @TODO update source worker counts
 */
Room.prototype.findSource = function () {
    let available = _.filter(this.sources, function (s) {
        return s.workers < s.maxWorkers;
    });

    if (available.length) {
        return Game.getObjectById(available[0].id);
    }

    return false;
};

/**
 * Checks to see if structures need to be built.
 */
Room.prototype.pullPermits = function () {
    Debug.log("pullPermits()", 1);

    // Whitelist of the structure types we all to auto-build
    let structureTypes = [
        STRUCTURE_EXTENSION,
        STRUCTURE_CONTAINER,
    ];

    // The number of each structure we want at each RCL
    let limits = {
        [STRUCTURE_EXTENSION]: {0:0,1:0,2:5,3:10,4:20,5:30,6:40,7:50,8:60},
        [STRUCTURE_CONTAINER]: {0:0,1:0,2:5,3:5,4:5,5:5,6:5,7:5,8:5},
    };

    let center = this.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_SPAWN }
    });

    let radii = [4,6,8,10,12,14];
    let sites = [];

    _.forEach(structureTypes, function (structureType) {
        let status;
        let site;

        for (let i = 0; i < limits[structureType][this.controller.level]; i++) {
            do {
                if (!sites.length) {
                    if (!radii.length)
                        break;
                    sites = Circle.drawCircle(center[0], radii.shift());
                }
                site = sites.shift();
                status = this.createConstructionSite(site.x, site.y, structureType);
            } while (status === ERR_INVALID_TARGET);
        }
    }.bind(this));

    return OK;
};



/* Room Properties
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
/**
 * Cache all of the sources in a room.
 *
 * @TODO sort sources by proximity distance to spawn/controller
 *
 * @return {object}
 */
Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
        if (!this._sources) {
            if (!this.memory.sources) {
                let sources = [];

                // Sort room sources by distance from the controller
                // @TODO should this be distance to Spawn1?
                let roomSources = _.sortBy(this.find(FIND_SOURCES), (s) =>
                    this.controller.pos.getRangeTo(s)
                );

                _.forEach(roomSources, function (s) {
                    sources.push({
                        id: s.id,
                        maxWorkers: s.maxWorkers,
                        workers: 0,
                    });
                });
                this.memory.sources = sources;
                Debug.log(`Sources cached for Room ${this.name}`);
            }
            this._sources = this.memory.sources;
        }
        return this._sources;
    },
    set: function(value) {
        this.memory.sources = value;
        this._sources = value;
    },
    enumerable: true,
    configurable: true
});

/**
 * Cache tasks.
 *
 * @return {object}
 */
Object.defineProperty(Room.prototype, 'tasks', {
    get: function() {
        if (!this._tasks) {
            if (!this.memory.tasks) {
                this.memory.tasks = {};
            }
            this._tasks = this.memory.tasks;
        }
        return this._tasks;
    },
    set: function(value) {
        this.memory.tasks = value;
        this._tasks = value;
    },
    enumerable: true,
    configurable: true
});
