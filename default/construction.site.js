/**
 * @file Modifications to the ConstructionSite prototype
 */
//let Config = require("config");
let Debug = require("debug");

/**
 *
 */
ConstructionSite.prototype.dispatch = function () {
    //this.room.addTask(this.id, "build");

    if (this.progress > 0) {
        let done = Math.floor((this.progress / this.progressTotal) * 100);
        this.room.visual.text(
            `${this.structureType} (${done}%)`,
            this.pos.x,
            this.pos.y + 1,
            {align: 'center', opacity: 0.8}
        );
    }
};

ConstructionSite.prototype.build = function (task) {
    let creep = Game.creeps[task.creep];

    if (creep.needEnergy()) {
        creep.withdrawEnergy();
    } else {
        creep.build(this);
    }
};

/**
 * @return {object}
 */
// Object.defineProperty(ConstructionSite.prototype, 'maxWorkers', {
//     get: function() {
//         if (!this._maxWorkers) {
//             this._maxWorkers = 0
//         }
//         return this._maxWorkers;
//     },
//     set: function(value) {
//         this._maxWorkers = value;
//     },
//     enumerable: true,
//     configurable: true
// });
