/**
 * Room Prototype
 *
 * @link https://docs.screeps.com/api/#Room
 */
//let Config = require("config");
let Debug = require("debug");
let Circle = require('helper.circle');

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
    Debug.log("Room.processTasks();", 1);

    if (!this.memory.tasks) this.memory.tasks = {};

    // Allow all structures to queue tasks
    _.forEach(this.find(FIND_MY_STRUCTURES), function (structure) {
        try {
            structure.dispatch();
        } catch (error) {
            Debug.log(error.stack, 5)
        }
    });

    let tasks = this.memory.tasks;
    Debug.log(tasks, 2);

    if (_.isEmpty(tasks))
        return false;

    // Get idle creeps in the current room
    let idleCreeps = _.filter(Game.creeps,
        (c) => c.memory.busy == false && c.room == this && c.spawning == false
    );
    Debug.log(`${idleCreeps.length} idle creeps`, 1);

    // Process the task list
    _.forOwn(tasks, function(task, id) {
        let entity = Game.getObjectById(id);

        // When a ConstructionSite changes to a Structure, the ID changes.
        // Remove any tasks associated with stale ConstructionSite IDs.
        if (!entity) {
            this.deleteTask(id);
            return true;
        }

        // If the current task is processing, move on to the next one
        if ("processing" === task.status) {
            if (!Game.creeps[task.creep]) {
                Debug.log(`Clearing task previously assigned to ${task.creep}`, 3);
                task.status = false;
                task.creep = false;
            } else {
                try {
                    entity[task.callback](task);
                    return true;
                } catch (e) {
                    Debug.log(e.stack, 5)
                }
            }
        }

        // If there are no idle creeps, check if we need to spawn some
        if (_.isEmpty(idleCreeps)) {
            // @todo Spawn some creeps
            return false;
        }

        // Assign a creep to the task
        let creep = idleCreeps.shift();

        creep.memory.busy = true;
        task.status = "processing";
        task.creep = creep.name;
        entity[task.callback](task);
    }.bind(this));

    // Generate construction sites. Since this is a CPU intensive operation,
    // only check if permits need pulled every 60 ticks.
    if (Game.time % 60 == 0)
        this.pullPermits();

    // Allow all construction sites to queue tasks
    _.forEach(this.find(FIND_MY_CONSTRUCTION_SITES), function (site) {
        try {
            site.dispatch();
        } catch (error) {
            Debug.log(error.stack, 5)
        }
    });
};

/**
 * Add a task
 *
 * @param {string} id
 * @param {string} callable
 * @param {object} config
 */
Room.prototype.addTask = function (id, callable, config = {}) {
    Debug.log(`Room.addTask(${id}, ${callable}, ${config});`, 1);

    if (this.memory.tasks.hasOwnProperty(id))
        return "ERR_DUPLICATE_TASK";

    // Allow custom data to be stored per task
    let defaultConfig = {
        callback: callable,
        status: false,
        creep: false,
    };
    this.memory.tasks[id] = _.extend(defaultConfig, config);
    Debug.log(`Task ${id}: ${callable} added`, 3);

    return "OK";
}

/**
 * Remove a task
 *
 * @param {string} id
 */
Room.prototype.deleteTask = function (id) {
    if (!this.memory.tasks.hasOwnProperty(id))
        return "ERR_TASK_NOT_FOUND";

    // Free up the creep that was working on the task
    let creep = Game.creeps[this.memory.tasks[id].creep];
    if (creep) {
        creep.memory.busy = false;
        Debug.log(`${creep.name} no longer busy`, 3);
    }

    // Delete the task
    delete this.memory.tasks[id];
    Debug.log(`Task ${id} deleted`, 3);

    return "OK";
}

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
    }

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
}



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
                _.forEach(this.find(FIND_SOURCES), function (s) {
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
