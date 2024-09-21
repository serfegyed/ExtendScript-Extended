/**
 * Removes all falsy values from the array. ("false", "null", "0", `""`, "undefined" and "NaN")
 *
 * @return {Array} A new array with all falsy values removed.
 */
if (!Array.prototype.compact) {
    Array.prototype.compact = function () {
        var elements = [];
        var elementsIndex = 0;
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i]) {
                elements[elementsIndex++] = this[i];
            }
        }
        return elements;
    };
};