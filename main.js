// Prototype Overrides
require("construction.site");
require("creep");
require("room");
require("source");
require("structure.spawn");

let Debug = require("debug");

var helperError = require('helper.error');
var helperCache = require('helper.cache');

var structureController = require('structure.controller');
var structureSpawn = require('structure.spawn');
var structureTower = require('structure.tower');

var behaviorCreep = require('behavior.creep');


/** */
module.exports.loop = function () {
    //console.log(JSON.stringify(Game, 0, 2));

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            Debug.log(`Clearing non-existing creep memory: ${name}`, 3);
        }
    }

    /** Iterate through each room and do the stuff */
    _.forOwn(Game.rooms, function (room) {
        //console.log(JSON.stringify(room, 0, 2));
        //helperCache.run(room);

        //room.debug = true;
        room.processTasks();
        return;

        structureSpawn.dispatch(room);
        //console.log(JSON.stringify(room.memory.tasks, 0, 2));

        structureController.run(room);
        structureSpawn.run(room);
        structureTower.run(room);

        room.visual.text(
            JSON.stringify(room.memory.tasks, 0, 2),
            0,
            0,
            {align: 'left', opacity: 0.8}
        );
    });

    behaviorCreep.run();
}
