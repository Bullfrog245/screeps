/**
 * Debug Module
 */
"use strict";

function Debug() {
    this.level = 3;
    this.colors = {
        '5': '#ff0066',
        '4': '#e65c00',
        '3': '#809fff',
        '2': '#999999',
        '1': '#737373',
        '0': '#666666',
        'highlight': '#ffff00',
    };
}

/**
 *
 */
Debug.prototype.log = function (message, severity = 3) {
    if (severity < this.level)
        return;

    if (typeof message === 'string' || message instanceof String) {
        //console.log(message);
    } else {
        message = JSON.stringify(message, 0, 2);
    }

    this.toConsole(this.colors[severity], severity, message);
};

/**
 *
 */
Debug.prototype.error = function (e, severity = 5) {
    let caller_line = e.stack.split("\n")[1];
    let index = caller_line.indexOf("at ");
    let clean = caller_line.slice(index + 2, caller_line.length);
    let message = clean.replace(/\s\(.*?\),\s/gm, "").replace(")", "");
    this.toConsole(this.colors[severity], severity, `${message} - ${e.message}`);
};

Debug.prototype.toConsole = function (color, severity, message) {
    console.log(`<font color="${color}" severity="${severity}">${message}</font>`);
};

module.exports = new Debug();

// ExampleLogger.log = function (message, severity = 3) {
//     if(severity > 5) {
//         severity = 5
//     } else if (severity < 0) {
//         severity = 0
//     } else if (!Number.isInteger(severity)) {
//         severity = 3
//     }

//     console.log('<font color="' + this.colors[severity] + '" severity="' + severity + '">' + message + "</font>")
// }

// ExampleLogger.highlight = function (message) {
//     console.log('<font color="' + this.colors['highlight'] + '" type="highlight">' + message + "</font>")
// }
