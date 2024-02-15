/**
 * Removes all falsy values from the array. ("false", "null", "0", `""`, "undefined" and "NaN")
 *
 * @return {Array} A new array with all falsy values removed.
 * !dependencies: filter()
 */
#include "./filter.js"
if (!Array.prototype.compact) {
    Array.prototype.compact = function () {
        return this.filter(Boolean);
    };
};