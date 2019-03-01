/**
 * @file Modifications to the Source prototype
 */
"use strict";
/* jshint -W117 */

/**
 * Module dependencies
 */
const Debug = require("debug");

/**
 *
 */
Source.prototype.calculateMaxWorkers = function() {
    Debug.log("Source.calculateMaxWorkers()", 1);

    const terrain = new Room.Terrain(this.room.name);

    let max = 0;
    let x = this.pos.x;
    let y = this.pos.y;

    // Get the terrain of the 8 adjacent tiles.
    let matrix = [
        terrain.get(x-1, y-1),
        terrain.get(x, y-1),
        terrain.get(x+1, y-1),

        terrain.get(x-1, y),
        terrain.get(x+1, y),

        terrain.get(x-1, y+1),
        terrain.get(x, y+1),
        terrain.get(x+1, y+1),
    ];

    for (let i = 0; i < 7; i++) {
        if (matrix[i] !== TERRAIN_MASK_WALL) {
            max++;
        }
    }

    Debug.log(`maxWorkers: ${max}`, 1);
    return max;
};

/**
 * @return {object}
//  */
// Object.defineProperty(Source.prototype, 'maxWorkers', {
//     get: function() {
//         if (!this._maxWorkers) {
//             this._maxWorkers = this.calculateMaxWorkers();
//         }
//         return this._maxWorkers;
//     },
//     set: function(value) {
//         this._maxWorkers = value;
//     },
//     enumerable: true,
//     configurable: true
// });
