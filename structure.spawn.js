/**
 * Spawn Structure
 *
 * @link https://emojipedia.org/objects/
 */
//let Config = require("config");
let Debug = require("debug");

/**
 *
 */
StructureSpawn.prototype.dispatch = function () {
    // Ensure there is at least one worker
    if (_.isEmpty(Game.creeps))
        this.spawnCreep([WORK, CARRY, MOVE]);

    if (Object.keys(Game.creeps).length < this.room.controller.level * 2)
        this.spawnCreep([WORK, CARRY, MOVE]);

    // Check if the spawn needs energy
    if (this.energy < this.energyCapacity) {
        // Only add an energy request if a request hasn't already been made
        this.room.addTask(this.id, "gatherEnergy");
    } else {
        // Remove the energy request if the energy is full
        this.room.deleteTask(this.id);
    }
};

StructureSpawn.prototype.gatherEnergy = function (task) {
    let creep = Game.creeps[task.creep];

    if (creep.carry.energy < creep.carryCapacity) {
        creep.harvestEnergy();
    } else {
        creep.transfer(this, RESOURCE_ENERGY)
    }
};

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
    StructureSpawn.prototype.spawnCreep = function(body, opts = {}) {
        // Creep names are of the form "c#". We increment creepName with each
        // creep that is spawned.
        if (!Memory.creepName) Memory.creepName = 1;

        // Set default opts
        let defaultOpts = {memory: {busy: false, needEnergy: true}};
        opts = _.extend(defaultOpts, opts);

        // Increment creepName until we have a name that doesn't exist. Prevents
        // errors should memory be cleared unexpectedly
        let name;
        let canCreate;
        do {
            name = `Creep${Memory.creepName++}`;
            canCreate = this._spawnCreep(body, name, {dryRun: true});
        } while (canCreate === ERR_NAME_EXISTS);

        // Call the original function passing in our generated name
        return this._spawnCreep(body, name, opts);
    };
}
