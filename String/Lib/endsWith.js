/**
 * Determines whether the string ends with the specified substring.
 *  
 * @param {String} substring
 * @returns {Bool} True or false.
 */
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (substring) {
        return this.slice(-substring.length) === substring;
    };
}