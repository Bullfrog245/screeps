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


    /**
     * Log a debug message to the console if debugging is enabled
     *
     * @param {mixed} message
     * @param {object} entity
     */
    return {
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
    }
})();
