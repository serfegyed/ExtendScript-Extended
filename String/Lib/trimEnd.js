/**
 * Removes trailing whitespace from the end of a string.
 *
 * @return {string} The trimmed string.
 */
if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function () {
        return this.replace(/\s+$/, "");
    };
};