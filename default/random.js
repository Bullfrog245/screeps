/**
 * Random Module
 */
"use strict";
/* jshint -W117 */

function Random() {}

Random.prototype.getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
};

module.exports = new Random();
