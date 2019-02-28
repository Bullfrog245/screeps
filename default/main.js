"use strict";
/* jshint -W117 */

/**
 * Module dependencies
 */
require("debug");

/**
 * Prototype Overrides
 */
require("construction.site");
require("creep");
require("room");
require("source");
require("structure.controller");
require("structure.extension");
require("structure.spawn");

/**
 * Module exports
 */
module.exports.loop = function () {
    /** Cleanup old creep memory. @TODO needs moved to module */
    for (const name in Memory.creeps) {
        if (!Memory.creeps.hasOwnProperty(name)) continue;

        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            Debug.log(`Clearing non-existing creep memory: ${name}`, 3);
        }
    }

    /** Iterate through each room and do the stuff */
    for (const name in Game.rooms) {
        if (!Game.rooms.hasOwnProperty(name)) continue;

        Game.rooms[name].processTasks();
    }
};
