var helperError = require('helper.error');
var helperCache = require('helper.cache');

var structureController = require('structure.controller');
var structureSpawn = require('structure.spawn');
var structureTower = require('structure.tower');

var behaviorCreep = require('behavior.creep');

/** */
module.exports.loop = function () {
    //console.log(JSON.stringify(Game, 0, 2));







    /** Iterate through each room and do the stuff */
    _.forOwn(Game.rooms, function (room) {
        //console.log(JSON.stringify(room, 0, 2));
        helperCache.run(room);

        structureController.run(room);
        structureSpawn.run(room);
        structureTower.run(room);
    });

    behaviorCreep.run();
}
