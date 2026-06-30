/**
 * Trims the specified characters from the beginning of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the beginning of the string.
 * @return {string} The string with the specified characters trimmed from the beginning.
 */
if (!String.prototype.trimStart) {
    String.prototype.trimStart = function (chars) {
        "use strict";

        var string;
        var re;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.trimStart called on null or undefined");
        }

        string = String(this);
        if (!chars) {
            chars = '\\s';
        } else {
            chars = '[' + chars.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + ']';
        }
        re = new RegExp('^' + chars + '+', 'g');
        return string.replace(re, '');
    };
}
