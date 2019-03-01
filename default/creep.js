/**
 * @file Modifications to the Creep prototype
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
Creep.prototype.sayHello = function () {
    if (Game.time % 4 == 0)
        this.say("*beep*");

    if (Game.time % 4 == 2)
        this.say("*boop*");
};

/**
 * Harvest energy from the first available source
 */
Creep.prototype.needEnergy = function () {
    let _needEnergy = this.memory.needEnergy;

    // Prevent errors if a creep gets nuralized
    if (typeof _needEnergy === undefined) {
        _needEnergy = false;
        if (this.carry.energy <= 0)
        _needEnergy = true;
    }

    // Adjust needEnergy flag when energy hits either limit
    if (!_needEnergy && this.carry.energy <= 0) {
        _needEnergy = true;
        Debug.log(`${this.name} energy empty`, 2);
    }
    if (_needEnergy && this.carry.energy >= this.carryCapacity) {
        _needEnergy = false;

        // Unassign workers for this source
        const s = this.room.sources.findIndex(s => s.id === this.memory.source);
        this.room.sources[s].workers--;
        this.memory.source = false;
        Debug.log(`${this.name} energy full`, 2);
    }

    this.memory.needEnergy = _needEnergy;
    return _needEnergy;
};

/**
 * Harvest energy from the first available source
 */
Creep.prototype.harvestEnergy = function () {
    if (this.memory.source) {
        return this.harvest(Game.getObjectById(this.memory.source));
    } else {
        return this.harvest(this.room.findSource(this));
    }
};

/**
 * Withdraw energy from the closest container. If no containers are available,
 * or if no containers have energy, harvest from a source
 */
Creep.prototype.withdrawEnergy = function () {
    let containers = this.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTAINER }
    });

    if (this.carry.energy < this.carryCapacity) {
        if (!containers.length) {
            Debug.log("Unable to withdraw energy: No containers", 1);
            return this.harvestEnergy();
        }
    }

    containers = _.sortBy(containers, c => this.pos.getRangeTo(c));
    Debug.log(containers);
};

/**
 *
 */
if (!Creep.prototype._build) {
    Creep.prototype._build = Creep.prototype.build;

    /**
     * Build a structure at the target construction site using carried energy.
     * Requires WORK and CARRY body parts. The target has to be within 3 squares
     * range of the creep.
     *
     * @param {ConstructionSite} target
     */
    Creep.prototype.build = function(target) {
        let status = this._build(target);

        switch(status) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                break;
        }

        this.room.visual.text(
            'build()',
            this.pos.x,
            this.pos.y + 1,
            {align: 'center', opacity: 0.8}
        );

        return status;
    };
}

/**
 *
 */
if (!Creep.prototype._harvest) {
    Creep.prototype._harvest = Creep.prototype.harvest;

    /**
     * Harvest energy from the source or minerals from the mineral deposit.
     * Requires the WORK body part. If the creep has an empty CARRY body part,
     * the harvested resource is put into it; otherwise it is dropped on the
     * ground. The target has to be at an adjacent square to the creep.
     *
     * @param {Source|Mineral} target
     */
    Creep.prototype.harvest = function(target) {
        let status = this._harvest(target);

        switch(status) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                break;
        }

        this.room.visual.text(
            'harvest()',
            this.pos.x,
            this.pos.y + 1,
            {align: 'center', opacity: 0.8}
        );

        return status;
    };
}

/**
 *
 */
if (!Creep.prototype._transfer) {
    Creep.prototype._transfer = Creep.prototype.transfer;

    /**
     * Harvest energy from the source or minerals from the mineral deposit.
     * Requires the WORK body part. If the creep has an empty CARRY body part,
     * the harvested resource is put into it; otherwise it is dropped on the
     * ground. The target has to be at an adjacent square to the creep.
     *
     * @param {Source|Mineral} target
     */
    Creep.prototype.transfer = function(target, resourceType, amount = undefined) {
        let status = this._transfer(target, resourceType, amount);

        switch(status) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
        }

        this.room.visual.text(
            'transfer()',
            this.pos.x,
            this.pos.y + 1,
            {align: 'center', opacity: 0.8}
        );

        return status;
    };
}

/**
 *
 */
if (!Creep.prototype._upgradeController) {
    Creep.prototype._upgradeController = Creep.prototype.upgradeController;

    /**
     * Harvest energy from the source or minerals from the mineral deposit.
     * Requires the WORK body part. If the creep has an empty CARRY body part,
     * the harvested resource is put into it; otherwise it is dropped on the
     * ground. The target has to be at an adjacent square to the creep.
     *
     * @param {Source|Mineral} target
     */
    Creep.prototype.upgradeController = function(target) {
        let status = this._upgradeController(target);

        switch(status) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
        }

        this.room.visual.text(
            'upgradeController()',
            this.pos.x,
            this.pos.y + 1,
            {align: 'center', opacity: 0.8}
        );

        return status;
    };
}
