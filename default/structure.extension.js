/**
 * Room Prototype
 *
 * @link https://docs.screeps.com/api/#Room
 */
//let Config = require("config");
let Debug = require("debug");

/**
 *
 */
StructureExtension.prototype.dispatch = function() {
    // Check if the spawn needs energy
    if (this.energy < this.energyCapacity) {
        // Only add an energy request if a request hasn't already been made
        this.room.addTask(this, "gatherEnergy", {priority: 2});
    } else {
        // Remove the energy request if the energy is full
        this.room.deleteTask(this, "gatherEnergy");
    }
};

/**
 *
 */
StructureExtension.prototype.gatherEnergy = function (task) {
    let creep = Game.creeps[task.creep];

    if (creep.needEnergy()) {
        creep.withdrawEnergy();
    } else {
        creep.transfer(this, RESOURCE_ENERGY)
    }
};


/* Properties
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
/**
 * Cache tasks.
 *
 * @return {object}
 */
Object.defineProperty(StructureExtension.prototype, 'tasks', {
    get: function() {
        if (!this._tasks) {
            if (!this.memory.tasks) {
                this.memory.tasks = {};
            }
            this._tasks = this.memory.tasks;
        }
        return this._tasks;
    },
    set: function(value) {
        this.memory.tasks = value;
        this._tasks = value;
    },
    enumerable: true,
    configurable: true
});
