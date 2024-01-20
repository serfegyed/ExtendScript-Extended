/**
 * Trims the specified characters from the beginning of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the beginning of the string.
 * @return {string} The string with the specified characters trimmed from the beginning.
 */
String.prototype.trimStart = function (chars) {
    if (!chars) {
        chars = '\\s';
    } else {
        chars = '[' + chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']';
    }
    var re = new RegExp('^' + chars + '+', 'g');
    return this.replace(re, '');
};