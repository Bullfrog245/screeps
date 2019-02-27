/**
 * Debug Module
 */
module.exports = (function () {
    let level = 3;
    let colors = {
        '5': '#ff0066',
        '4': '#e65c00',
        '3': '#809fff',
        '2': '#999999',
        '1': '#737373',
        '0': '#666666',
        'highlight': '#ffff00',
    }

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

    return {
        /**
         * Log a debug message to the console if debugging is enabled
         *
         * @param {mixed} message
         * @param {object} entity
         */
        log: function(message, severity = 3) {
            if (severity < level)
                return;

            if (typeof message === 'string' || message instanceof String) {
                //console.log(message);
            } else {
                message = JSON.stringify(message, 0, 2);
            }

            console.log('<font color="' + colors[severity] + '" severity="' + severity + '">' + message + "</font>")
        },

        /**
         * Takes the first line of an Error stacktrace, strips out the evalCode
         * nonsense, and appends the actual error message
         *
         * Object.Room.processTasks (eval at exports.evalCode (blob:chrome-extension://cknihipnnkgolgdlfodbibfmdmhhbmlb/1e9240a6-78bc-46c4-b0ba-57d98116880e:2:11347), :26:27) - structures[i].dispatch is not a function
         * Object.Room.processTasks:26:27 - structures[i].dispatch is not a function
         *
         * @param {Error} e
         * @param {integer} severity
         */
        error: function (e, severity = 5) {
            let caller_line = e.stack.split("\n")[1];
            let index = caller_line.indexOf("at ");
            let clean = caller_line.slice(index + 2, caller_line.length);
            let message = clean.replace(/\s\(.*?\),\s/gm, "").replace(")", "");
            console.log(`<font color="${colors[severity]}" severity="${severity}">${message} - ${e.message}</font>`);
        }
    }
})();
