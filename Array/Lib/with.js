/**
 * Returns a dense, shallow copy with one indexed value replaced.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.with) {
    Array.prototype.with = function (index, value) {
        "use strict";

        var object;
        var length;
        var relativeIndex;
        var actualIndex;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.with called on null or undefined.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        relativeIndex = __arrayToInteger__(index);
        actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
        if (actualIndex < 0 || actualIndex >= length) {
            throw new RangeError("Array.prototype.with index is out of range.");
        }

        result = new Array(length);
        for (i = 0; i < length; i++) {
            result[i] = i === actualIndex ? value : object[i];
        }
        return result;
    };
}
