/**
 * Pad the end of a string with a specified character to a target length.
 *
 * @param {number} targetLength - The desired length of the resulting string.
 * @param {string} padString - The character to pad the string with. Default is a space character.
 * @return {string} - The padded string.
 */
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function (targetLength, padString) {
        "use strict";

        function typeError(message) {
            var error = new TypeError(message);

            error.name = "TypeError";
            return error;
        }

        function rangeError(message) {
            var error = new RangeError(message);

            error.name = "RangeError";
            return error;
        }

        var string;
        var length;
        var number;
        var filler;
        var fillLength;
        var padding = "";

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw typeError("String.prototype.padEnd called on null or undefined");
        }

        string = String(this);
        number = Number(targetLength);
        if (number !== number || number <= 0) {
            length = 0;
        } else if (number === Infinity) {
            length = 9007199254740991;
        } else {
            length = Math.floor(number);
            length = Math.min(length, 9007199254740991);
        }

        if (length <= string.length) {
            return string;
        }

        filler = padString === undefined ? " " : String(padString);
        if (filler === "") {
            return string;
        }

        fillLength = length - string.length;
        if (fillLength >= (1 << 28)) {
            throw rangeError("padEnd result exceeds maximum string size");
        }
        while (padding.length < fillLength) {
            padding += filler.slice(0, fillLength - padding.length);
        }

        return string + padding;
    };
}
