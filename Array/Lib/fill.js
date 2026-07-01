/**
 * Fills an index range on an Array or array-like object.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.fill) {
    Array.prototype.fill = function (value, start, end) {
        "use strict";

        var object;
        var length;
        var first;
        var finalIndex;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.fill called on null or undefined.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        first = start === undefined ? 0 : __arrayToInteger__(start);
        finalIndex = end === undefined ? length : __arrayToInteger__(end);
        first = first < 0 ? Math.max(length + first, 0) : Math.min(first, length);
        finalIndex = finalIndex < 0 ?
            Math.max(length + finalIndex, 0) : Math.min(finalIndex, length);

        while (first < finalIndex) {
            object[first] = value;
            first++;
        }
        return object;
    };
}
