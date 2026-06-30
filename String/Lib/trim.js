/**
 * Trims the specified characters from the beginning and end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the string
 * @return {string} The trimmed string
 */
if (!String.prototype.trim) {
    String.prototype.trim = function (chars) {
        "use strict";

        var string;
        var re;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.trim called on null or undefined");
        }

        string = String(this);
        if (!chars) {
            chars = '\\s';
        } else {
            // Create a character class for individual characters to trim
            chars = '[' + chars.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + ']';
        }
        re = new RegExp('^' + chars + '+|' + chars + '+$', 'g');
        return string.replace(re, '');
    };
}
