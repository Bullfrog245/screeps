/**
 * Spawn Structure
 *
 * @link https://emojipedia.org/objects/
 */
var helperError = (function () {
    var test;

	return {

        /**
         * Get the error message from the code. Some codes are context-specific
         * (e.g., -6 can mean ERR_NOT_ENOUGH_ENERGY or ERR_NOT_ENOUGH_RESOURCES)
         * so an optional context parameter can be passed.
         *
         * @param {string} code
         * @param {string} context
         */
		message: function(code, context = false) {
            var errors = {
                "0": "OK",
                "-1": "ERR_NOT_OWNER",
                "-2": "ERR_NO_PATH",
                "-3": "ERR_NAME_EXISTS",
                "-4": "ERR_BUSY",
                "-5": "ERR_NOT_FOUND",
                "-6": "ERR_NOT_ENOUGH_ENERGY",
                "-7": "ERR_INVALID_TARGET",
                "-8": "ERR_FULL",
                "-9": "ERR_NOT_IN_RANGE",
                "-10": "ERR_INVALID_ARGS",
                "-11": "ERR_TIRED",
                "-12": "ERR_NO_BODYPART",
                "-14": "ERR_RCL_NOT_ENOUGH",
                "-15": "ERR_GCL_NOT_ENOUGH",
            };

            if ("structure" === context) {
                errors["-6"] = "ERR_NOT_ENOUGH_RESOURCES";
            }

            if ("unknwn" === context) {
                errors["-6"] = "ERR_NOT_ENOUGH_EXTENSIONS";
            }

            return errors[code];
		},
	}
})();

module.exports = helperError;
