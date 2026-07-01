/**
 * Returns a shallow copy with one value inserted at the requested index.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.insert) {
    Array.prototype.insert = function (element, index) {
        "use strict";

        var object;
        var length;
        var actualIndex;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.insert called on null or undefined.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        actualIndex = __arrayToInteger__(index);
        if (actualIndex < 0) actualIndex = length + actualIndex;
        if (actualIndex < 0 || actualIndex > length) {
            throw new RangeError("Array.prototype.insert index is out of range.");
        }

        result = new Array(length + 1);
        for (i = 0; i < actualIndex; i++) {
            if (i in object) result[i] = object[i];
        }
        result[actualIndex] = element;
        for (i = actualIndex; i < length; i++) {
            if (i in object) result[i + 1] = object[i];
        }
        return result;
    };
}
