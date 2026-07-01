/**
 * Returns the value at an absolute or relative integer index.
 * Generic: requires only length and integer-indexed properties.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.at) {
    Array.prototype.at = function (index) {
        "use strict";

        var object;
        var length;
        var relativeIndex;
        var actualIndex;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.at called on null or undefined.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        relativeIndex = __arrayToInteger__(index);
        actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;

        if (actualIndex < 0 || actualIndex >= length) return undefined;
        return object[actualIndex];
    };
}
