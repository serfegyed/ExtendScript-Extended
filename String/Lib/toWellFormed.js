/**
 * Converts a string to a well-formed string.
 *
 * @return {string} The well-formed string.
 */
if (!String.prototype.toWellFormed) {
    String.prototype.toWellFormed = function () {
        if (!this.isWellFormed()) {
            return this.replace(/[\uD800-\uDFFF]/g, "\uFFFD");
        }

        return String(this);
    };
};