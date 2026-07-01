/**
 * Returns a shallow copy without the value at the requested index.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.remove) {
    Array.prototype.remove = function (index) {
        "use strict";

        var object;
        var length;
        var actualIndex;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.remove called on null or undefined.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        if (length === 0) return undefined;
        actualIndex = __arrayToInteger__(index);
        if (actualIndex < 0) actualIndex = length + actualIndex;
        if (actualIndex < 0 || actualIndex >= length) {
            throw new RangeError("Array.prototype.remove index is out of range.");
        }

        result = new Array(length - 1);
        for (i = 0; i < actualIndex; i++) {
            if (i in object) result[i] = object[i];
        }
        for (i = actualIndex + 1; i < length; i++) {
            if (i in object) result[i - 1] = object[i];
        }
        return result;
    };
}
