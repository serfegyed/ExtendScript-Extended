/**
 * Trims the specified characters from the end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the end of the string
 * @return {string} The string with the specified characters trimmed from the end
 */
String.prototype.trimEnd = function (chars) {
    if (!chars) {
        chars = '\\s';
    } else {
        chars = '[' + chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']';
    }
    var re = new RegExp(chars + '+$', 'g');
    return this.replace(re, '');
};