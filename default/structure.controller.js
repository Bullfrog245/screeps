/**
 * Controller Structure
 *
 * @link https://emojipedia.org/objects/
 */
//let Config = require("config");
let Debug = require("debug");

/**
 *
 */
StructureController.prototype.dispatch = function () {
    if (!this.sign) {
        this.room.addTask(this, "signController", {priority: 1});
    }

    this.room.addTask(this, "upgrade", {priority: 3});
};

StructureController.prototype.signController = function (task) {
    let creep = Game.creeps[task.creep];
    try {
        let status = creep.signController(this, "\u{1F438}");

        switch(status) {
            case OK:
                this.room.deleteTask(this, "signController");
                break
            case ERR_NOT_IN_RANGE:
                creep.moveTo(this, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
        }
    }
    catch(e) {
        Debug.log(e.stack, 5);
    }
};

StructureController.prototype.upgrade = function (task, single = false) {
    let creep = Game.creeps[task.creep];

    if (creep.needEnergy()) {
        creep.withdrawEnergy();
    } else {
        creep.upgradeController(this);
    }
};
