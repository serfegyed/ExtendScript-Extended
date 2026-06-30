/**
 * Checks whether a string contains a specified substring.
 *
 * @param {string} substring - The substring to search for.
 * @return {boolean} True when the substring is present.
 */
if (!String.prototype.contains) {
    String.prototype.contains = function (substring) {
        return String(this).indexOf(String(substring)) !== -1;
    };
}
