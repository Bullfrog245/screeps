var helperError = require('helper.error');

var structureController = require('structure.controller');
var structureSpawn = require('structure.spawn');
var structureTower = require('structure.tower');

var behaviorCreep = require('behavior.creep');

/** */
module.exports.loop = function () {
    //console.log(JSON.stringify(Game, 0, 2));

    // Garbage Collection
    // @TODO move this to a module
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /** Iterate through each room and do the stuff */
    _.forOwn(Game.rooms, function (room) {
        //console.log(JSON.stringify(room, 0, 2));
        structureController.run(room);
        structureSpawn.run(room);
        structureTower.run(room);
    });

    behaviorCreep.run();
}
