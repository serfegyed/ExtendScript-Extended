/**
 * Trims the specified characters from the end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the end of the string
 * @return {string} The string with the specified characters trimmed from the end
 */
if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function (chars) {
        "use strict";

        var string;
        var re;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.trimEnd called on null or undefined");
        }

        string = String(this);
        if (!chars) {
            chars = '\\s';
        } else {
            chars = '[' + chars.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + ']';
        }
        re = new RegExp(chars + '+$', 'g');
        return string.replace(re, '');
    };
}
