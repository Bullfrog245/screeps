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
		'harvester': 2,
    };

    var config = {
        'spawnCache': 60
    };

	return {

		/** */
		run: function(room) {
            this.room = room;

            // Find() has a medium CPU cost. Cache the spawn ID and reference it
            // directly. Update the cache based on the config.
            if (this.room.memory.spawnId === undefined || Game.time % config.spawnCache == 0) {
                this.room.memory.spawnId = this.room.find(FIND_MY_SPAWNS).shift().id;
            }
            this.spawn = Game.getObjectById(this.room.memory.spawnId);

            /** @TODO */
            // Need to bail if this is a room that doesn't have a spawn. I don't
            // know how this looks yet...

            //console.log(JSON.stringify(this.spawn, 0, 2));

			/** Creep Spawning */
			this.spawnCreeps();
		},

        /**
         * Check to see if any creeps need to be spawned
         */
		spawnCreeps: function () {
            var creeps = this.room.find(FIND_MY_CREEPS);
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
            var status = this.spawn.spawnCreep(parts, name, {
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
			if (this.spawn.spawning) {
                var creep = Game.creeps[this.spawn.spawning.name];
                var time = this.spawn.spawning;

                // The spawning message appears a tick late. This is why we
                // have to add one to remainingTime
                var percent = Math.floor(
                    ((time.needTime - time.remainingTime + 1) / time.needTime) * 100
                );

				this.room.visual.text(
					`🛠️ ${creep.memory.role} (${percent}%)`,
					this.spawn.pos.x,
					this.spawn.pos.y + 1.5,
                    {align: 'center', opacity: 0.8}
                );
			}
		}
	}
})();

module.exports = structureSpawn;
