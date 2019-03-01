/**
 * Spawn Structure
 *
 * @link https://emojipedia.org/objects/
 */
"use strict";
/* jshint -W117 */

/**
 * Module dependencies
 */
const Debug = require("debug");

/**
 *
 */
StructureSpawn.prototype.dispatch = function () {
    let creeps = Object.keys(Game.creeps).length;

    // Check to see if creeps need to be spawned
    if (!creeps || creeps < this.maxSupportedCreeps())
        this.spawnCreep();

    // Check if the spawn needs energy
    if (this.energy < this.energyCapacity) {
        // Only add an energy request if a request hasn't already been made
        this.room.addTask(this, "gatherEnergy", {priority: 2});
    } else {
        // Remove the energy request if the energy is full
        this.room.deleteTask(this, "gatherEnergy");
    }
};

/**
 *
 */
StructureSpawn.prototype.gatherEnergy = function (task) {
    let creep = Game.creeps[task.creep];

    if (creep.carry.energy < creep.carryCapacity) {
        try {
            creep.harvestEnergy();
        } catch (e) {
            Debug.log(e.stack, 5);
        }
    } else {
        creep.transfer(this, RESOURCE_ENERGY);
    }
};

/* Creep Spawning
------------------------------------------------------------------------------*/
/**
 * Determine the maximum number of creeps that this Room can support
 */
StructureSpawn.prototype.maxSupportedCreeps = function () {
    return (this.room.controller.level * 2) + 1;
};

/**
 * Determine the parts a creep should be spawned with
 */
StructureSpawn.prototype.creepParts = function () {
    let capacity = this.room.energyCapacityAvailable;

    if (capacity < 400) {
        // Creep cost: 200
        return [WORK, CARRY, MOVE];
    } else if (capacity < 550) {
        // Creep cost: 350
        return [WORK, WORK, CARRY, MOVE, MOVE];
    } else {
        return [WORK, CARRY, MOVE];
    }
};



/* Creep Overrides
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
/**
 * Add automatic creep naming to the spawnCreep() method
 */
if (!StructureSpawn.prototype._spawnCreep) {
    StructureSpawn.prototype._spawnCreep = StructureSpawn.prototype.spawnCreep;

    /**
     * Start the creep spawning process. The required energy amount can be
     * withdrawn from all spawns and extensions in the room.
     *
     * @param {array} body
     * @param {object} opts
     */
    StructureSpawn.prototype.spawnCreep = function(body = false, opts = {}) {
        // Creep names are of the form "c#". We increment creepName with each
        // creep that is spawned.
        if (!Memory.creepName) Memory.creepName = 1;

        // Set default body
        body = body || this.creepParts();

        // Prevent needless creepName increments if we can't spawn
        // (E.g., ERR_BUSY or ERR_NOT_ENOUGH_ENERGY)
        let code = this._spawnCreep(body, Game.time, {dryRun: true});
        if (code !== OK) return code;

        // Set default opts
        let defaultOpts = {memory: {
            busy: false,
            needEnergy: true,
            source: false,
        }};
        opts = _.extend(defaultOpts, opts);

        // Increment creepName until we have a name that doesn't exist. Prevents
        // errors should memory be cleared unexpectedly
        let name;
        let valid;
        do {
            name = `Creep${Memory.creepName++}`;
            valid = this._spawnCreep(body, name, {dryRun: true});
        } while (valid === ERR_NAME_EXISTS);

        // Call the original function passing in our generated name
        Debug.log(`${name}: ${body}`, 3);
        return this._spawnCreep(body, name, opts);
    };
}
