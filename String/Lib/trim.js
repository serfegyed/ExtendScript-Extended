/**
 * Trims the specified characters from the beginning and end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} searchString - The characters to trim from the string
 * @return {string} The trimmed string
 */
if (!String.prototype.trim) {
    String.prototype.trim = function (searchString) {
        "use strict";

        var string;
        var regexp;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.trim called on null or undefined");
        }

        string = String(this);
        if (!searchString) {
            searchString = '\\s';
        } else {
            // Create a character class for individual characters to trim
            searchString = '[' + searchString.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + ']';
        }
        regexp = new RegExp('^' + searchString + '+|' + searchString + '+$', 'g');
        return string.replace(regexp, '');
    };
}
