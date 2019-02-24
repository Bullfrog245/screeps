/**
 * Spawn Structure
 *
 * @link https://emojipedia.org/objects/
 */
var structureSpawn = (function () {
    var helperError = require('helper.error');

    var room;
    var spawn;

	var rolePriorities = {
		'harvester': 1,
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
            var creeps = room.find(FIND_MY_CREEPS);
            var creepRoles = {};

            // Get counts of each role in the current room
            if (creeps.length) {
                _.forOwn(creeps, function (creep) {
                    var role = creep.memory.role
                    creepRoles[role] = (creepRoles[role] || 0) + 1;
                });
            }

            // Check the creep list against the priorities list and spawn as
            // needed
            _.forOwn(rolePriorities, function (count, role) {
                if (creepRoles[role] === undefined || creepRoles[role] < count) {
                    this["_spawn_" + role]();
                    return false;
                }
            }.bind(this));
        },

        /**
         * Spawn creep wrapper
         *
         * @param {string} role
         * @param {array} parts
         */
        spawnCreep: function (role, parts) {
            var name = role + Game.time;
            var status = spawn.spawnCreep(parts, name, {
                memory: {role: role}
            });

            if (OK === status || ERR_BUSY === status) {
                this.spawnMessage();
            } else {
                var message = helperError.message(status);
                console.log(`Cannot spawn ${role}: ${message}`);
            }
        },

        /**
         * Creep defination for upgrader
         */
		_spawn_upgrader: function () {
            this.spawnCreep('upgrader', [WORK,CARRY,MOVE]);
		},

        /**
         * Creep defination for harvester
         */
		_spawn_harvester: function () {
            this.spawnCreep('harvester', [WORK,CARRY,MOVE]);
		},

        /**
         * Creep defination for harvester
         */
		_spawn_builder: function () {
            this.spawnCreep('builder', [WORK,CARRY,MOVE]);
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
					`🛠️ ${creep.memory.role} (${percent}%)`,
					spawn.pos.x,
					spawn.pos.y + 1.5,
                    {align: 'center', opacity: 0.8}
                );
			}
		}
	}
})();

module.exports = structureSpawn;
