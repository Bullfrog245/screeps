/**
 * Creep Behaviors
 */
var behaviorCreeps = (function () {

	var rolePriorities = {
		'upgrader': 1,
		'harvester': 2,
	};

	return {

		/** */
		run: function() {
			/** Creep Spawning */
			this.spawnCreeps();
		},

		spawnCreeps: function () {
			var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
			console.log('Harvesters: ' + harvesters.length);

			if(harvesters.length < 2) {
				this.spawnHarvester();
			}
		},

		spawnHarvester: function () {
			var newName = 'Harvester' + Game.time;
			console.log('Spawning new harvester: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
				{memory: {role: 'harvester'}});

			this.spawnDebug();
		},

		spawnDebug: function () {
			console.log(Game.spawns);
			if (Game.spawns['Spawn1'].spawning) { 
				var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
				Game.spawns['Spawn1'].room.visual.text(
					'🛠️' + spawningCreep.memory.role,
					Game.spawns['Spawn1'].pos.x + 1, 
					Game.spawns['Spawn1'].pos.y, 
					{align: 'left', opacity: 0.8});
			}
		}
	}
})();

module.exports = behaviorCreeps;
