// Prototype Overrides
require("construction.site");
require("creep");
require("room");
require("source");
require('structure.controller');
require("structure.spawn");

let Debug = require("debug");

//var helperError = require('helper.error');
//var helperCache = require('helper.cache');

//var structureController = require('structure.controller');
//var structureSpawn = require('structure.spawn');
//var structureTower = require('structure.tower');

//var behaviorCreep = require('behavior.creep');


/**
 * Main Screeps game loop
 */
module.exports.loop = function () {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            Debug.log(`Clearing non-existing creep memory: ${name}`, 3);
        }
    }

    /** Iterate through each room and do the stuff */
    _.forOwn(Game.rooms, function (room) {
        room.processTasks();

    });
}
