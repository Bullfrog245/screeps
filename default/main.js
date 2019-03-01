"use strict";
/* jshint -W117 */

/**
 * Module dependencies
 */
const Debug = require("debug");
const Random = require("random");

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

        if (Random.getRandomInt(255) < 4) {
            Game.creeps[name].sayRibbit();
        }
    }

    /** Iterate through each room and do the stuff */
    for (const name in Game.rooms) {
        if (!Game.rooms.hasOwnProperty(name)) continue;

        Game.rooms[name].processTasks();

        Debug.showDeveloperTools(name);



        if (Game.time % 90 == 0) {
            Debug.log("Garbage collect: source worker counts", 2);
            let index;
            const room = Game.rooms[name];
            for (let i = 0, l = room.sources.length; i < l; ++i) {
                room.sources[i].workers = 0;
            }

            for (const name in Game.creeps) {
                if (!Game.creeps.hasOwnProperty(name)) continue;

                index = room.sources.findIndex(i => i.id === Game.creeps[name].source);
                room.sources[index]++;
            }
        }
    }


};
