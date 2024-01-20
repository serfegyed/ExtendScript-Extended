/**
 * Trims the specified characters from the beginning and end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the string
 * @return {string} The trimmed string
 */
String.prototype.trim = function (chars) {
    if (!chars) {
        chars = '\\s';
    } else {
        // Create a character class for individual characters to trim
        chars = '[' + chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']';
    }
    var re = new RegExp('^' + chars + '+|' + chars + '+$', 'g');
    return this.replace(re, '');
};