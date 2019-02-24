
var roleBuilder = (function () {
	var creep;

	return {
		/** @param {Creep} creep **/
		run: function(currentCreep) {
			creep = currentCreep;

			if (creep.memory.building && creep.carry.energy == 0) {
				creep.memory.building = false;
				creep.say('🔄 harvest');
			}
			if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
				creep.memory.building = true;
				creep.say('🚧 build');
			}

			if (creep.memory.building) {
				this.build();
			} else {
				this.harvest();
			}
		},

		build: function () {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length) {
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		},

		harvest: function () {
			var spawn = Game.getObjectById(creep.room.memory.structure_spawn[0]);

			if (spawn.energy > 50) {
				if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
				return false;
			}

			var sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
			}

		},
	}
})();

module.exports = roleBuilder;