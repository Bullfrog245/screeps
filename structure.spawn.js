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

var structureSpawn = (function () {
    var helperError = require('helper.error');

    var room;
    var spawn;

	var rolePriorities = {
		'harvester': 2,
		'upgrader': 1,
		'builder': 1,
    };

    var config = {
        'spawnCache': 60
    };

	return {

		/** */
		run: function(currentRoom) {
            room = currentRoom;
            spawn = Game.getObjectById(room.memory.structure_spawn[0]);

            if (null === spawn)
                return false;

			/** Creep Spawning */
			this.spawnCreeps();
		},

        /**
         * Check to see if any creeps need to be spawned
         */
		spawnCreeps: function () {

        },

        /**
         * Spawn creep wrapper
         *
         * @param {string} role
         * @param {array} parts
         */
        spawnCreep: function (role, parts) {

        },



        /**
         * Show a message when a spawner is spawning
         *
         * this.spawn.spawning
         * {
         *     "name": "upgrader600",
         *     "needTime": 9,
         *     "remainingTime": 3
         * }
         */
		spawnMessage: function () {
			if (spawn.spawning) {
                var creep = Game.creeps[spawn.spawning.name];
                var time = spawn.spawning;

                // The spawning message appears a tick late. This is why we
                // have to add one to remainingTime
                var percent = Math.floor(
                    ((time.needTime - time.remainingTime + 1) / time.needTime) * 100
                );

				room.visual.text(
					`${creep.memory.role} (${percent}%)`,
					spawn.pos.x,
					spawn.pos.y + 1.5,
                    {align: 'center', opacity: 0.8}
                );
			}
        },

	}
})();

module.exports = structureSpawn;
