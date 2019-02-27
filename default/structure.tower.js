/**
 * Tower Structure
 *
 * @link https://emojipedia.org/objects/
 */
var structureTower = (function () {
    var helperError = require('helper.error');

    var room;

	return {

		/** */
		run: function(room) {
            this.room = room;

            var tower = Game.getObjectById('79a15f101463c1efab5253af');

            if (tower) {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }

                if(closestHostile) {
                    tower.attack(closestHostile);
                }
            }
		},
	}
})();

module.exports = structureTower;
