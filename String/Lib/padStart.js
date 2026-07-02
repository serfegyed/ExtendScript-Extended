/**
 * Adds padding to the start of a string until it reaches the target length.
 *
 * @param {number} targetLength - The desired length of the string.
 * @param {string} padString - The string used for padding. Defaults to a space character.
 * @return {string} - The padded string.
 */
if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
        "use strict";

        var string;
        var length;
        var number;
        var filler;
        var fillLength;
        var padding = "";

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw new TypeError("String.prototype.padStart called on null or undefined");
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
            throw new RangeError("padStart result exceeds maximum string size");
        }
        while (padding.length < fillLength) {
            padding += filler.slice(0, fillLength - padding.length);
        }

        return padding + string;
    };
}
