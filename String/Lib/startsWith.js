/**
 * Checks if the string starts with the specified substring.
 *
 * @param {string} substring - The substring to check.
 * @return {boolean} Returns true if the string starts with the specified substring, otherwise returns false.
 */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (substring) {
        return this.substring(0, substring.length) === substring;
    };
};