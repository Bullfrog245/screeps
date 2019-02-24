/**
 * Controller Structure
 *
 * @link https://emojipedia.org/objects/
 */
var structureController = (function () {
    var helperError = require('helper.error');

    var controller;
    var room;

	return {

		/** */
		run: function(currentRoom) {
            room = currentRoom;

            // Find() has a medium CPU cost. Cache the controller ID and
            // reference it directly.
            if (room.memory.controllerId === undefined) {
                var controllers = room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_CONTROLLER
                });

                room.memory.controllerId = controllers.shift().id;
                console.log("Controller ID Cached");
            }
            controller = Game.getObjectById(room.memory.controllerId);

            this.progressMessage();
        },

        /**
         * Display status messages
         */
        progressMessage: function () {
            var progress = Math.floor(
                (controller.progress / controller.progressTotal) * 100
            );

            room.visual.text(
                `RCL ${controller.level} (${progress}%)`,
                controller.pos.x + 1,
                controller.pos.y - 1,
                {align: 'left', opacity: 0.8}
            );
        },
	}
})();

module.exports = structureController;
