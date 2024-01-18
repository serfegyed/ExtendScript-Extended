/**
 * Checks if the string includes the given substring.
 *
 * @param {string} substring - The substring to search for.
 * @param {number} position - The starting position for the search (optional).
 * @return {boolean} Returns true if the substring is found, false otherwise.
 */
if (!String.prototype.includes) {
    String.prototype.includes = function (substring, position) {
        position = position || 0;
        return this.indexOf(substring, position) !== -1;
    };
}