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
StructureExtension.prototype.someFunction = function() {

};


/* Properties
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
/**
 * Whether or not to display debug messages
 *
 * @return {boolean}
 */
Object.defineProperty(Room.prototype, 'debug', {
    get: function() {
        if (!this._debug) this._debug = false;
        return this._debug;
    },
    set: function(value) {
        this._debug = value;
    },
    enumerable: false,
    configurable: true
});

/**
 * @return {object}
 */
Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
        if (!this._sources) {
            if (!this.memory.sources) {
                let sources = [];
                _.forEach(this.find(FIND_SOURCES), function (s) {
                    sources.push({
                        id: s.id,
                        maxWorkers: s.maxWorkers,
                        workers: 0,
                    });
                });
                this.memory.sources = sources;
                Debug.log(`Sources cached for Room ${this.name}`);
            }
            this._sources = this.memory.sources;
        }
        return this._sources;
    },
    set: function(value) {
        this.memory.sources = value;
        this._sources = value;
    },
    enumerable: true,
    configurable: true
});
