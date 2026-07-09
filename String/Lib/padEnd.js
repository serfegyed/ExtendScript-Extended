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

        var string;
        var stringLength;
        var length;
        var number;
        var filler;
        var fillLength;
        var padding = "";

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.padEnd called on null or undefined");
        }

        string = String(this);
        stringLength = string.length;
        number = Number(targetLength);
        if (number !== number || number <= 0) {
            length = 0;
        } else if (number === Infinity) {
            length = 9007199254740991;
        } else {
            length = Math.floor(number);
            length = Math.min(length, 9007199254740991);
        }

        if (length <= stringLength) {
            return string;
        }

        filler = padString === undefined ? " " : String(padString);
        if (filler === "") {
            return string;
        }

        fillLength = length - stringLength;
        if (fillLength >= (1 << 28)) {
            throw new RangeError("padEnd result exceeds maximum string size");
        }
        while (padding.length < fillLength) {
            padding += filler.slice(0, fillLength - padding.length);
        }

        return string + padding;
    };
}
