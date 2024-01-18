/**
 * Trims whitespace from both ends of a string.
 *
 * @return {String} The trimmed string.
 */
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    };
};