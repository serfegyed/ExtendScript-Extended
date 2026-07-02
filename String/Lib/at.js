/**
 * Retrieves the character at the specified index of the string.
 *
 * @param {number} index - The index of the character to retrieve.
 * @return {string} - The character at the specified index.
 * @example
 *	> $.writeln("hello world".at(0));
 *     "h"
 * @example
 *	> $.writeln("hello world".at(-1));
 *     "e"
 */
if (!String.prototype.at) {
    String.prototype.at = function (index) {
        "use strict";

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw new TypeError("String.prototype.at called on null or undefined");
        }

        var string = String(this);
        var length = string.length;

        index = Number(index);
        if (index !== index || index === 0) {
            index = 0;
        } else if (index !== Infinity && index !== -Infinity) {
            index = index < 0 ? Math.ceil(index) : Math.floor(index);
        }

        if (index < -length || index >= length) {
            return undefined;
        }

        index = index < 0 ? length + index : index;

        return string.charAt(index);
    };
}
