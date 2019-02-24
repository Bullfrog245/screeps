/**
 * Spawn Structure
 */
var helperCache = (function () {
    var room;

	return {
        run: function (currentRoom) {
            room = currentRoom;

            this.garbageCollect();
            this.cacheStructure(STRUCTURE_CONTROLLER);
            this.cacheStructure(STRUCTURE_SPAWN);
        },

        /**
         * Garbage Collection
         */
        garbageCollect: function () {
            for (var name in Memory.creeps) {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }
        },

        /**
         * Find() has a medium CPU cost. Cache structure IDs and reference them
         * directly
         *
         * @param {string} structure
         */
		cacheStructure: function(structure) {
            var cacheKey = 'structure_' + structure;

            if (room.memory[cacheKey] === undefined) {
                var structures = room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => s.structureType === structure
                });

                room.memory[cacheKey] = _.map(structures, "id");
                console.log(`${structure} IDs cached`);
            }
		},
	}
})();

module.exports = helperCache;
