/**
 * Repeats the string a specified number of times.
 *
 * @param {number} count - The number of times to repeat the string.
 * @return {string} The repeated string.
 */
if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        "use strict";

        var string;
        var number;
        var result = "";

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.repeat called on null or undefined");
        }

        string = String(this);
        number = Number(count);
        if (number !== number) {
            number = 0;
        } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
            number = number < 0 ? Math.ceil(number) : Math.floor(number);
        }
        if (number < 0 || number === Infinity) {
            throw new RangeError("Invalid count value");
        }
        if (string.length === 0 || number === 0) {
            return "";
        }
        if (string.length * number >= (1 << 28)) {
            throw new RangeError("repeat count must not overflow maximum string size");
        }

        while (number > 0) {
            if (number % 2 === 1) {
                result += string;
            }
            number = Math.floor(number / 2);
            if (number > 0) {
                string += string;
            }
        }

        return result;
    };
}
