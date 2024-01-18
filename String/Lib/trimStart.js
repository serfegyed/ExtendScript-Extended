/**
 * Removes whitespace from the beginning of a string.
 *
 * @return {string} The string with leading whitespace removed.
 */
if (!String.prototype.trimStart) {
    String.prototype.trimStart = function () {
        return this.replace(/^\s+/, "");
    };
};