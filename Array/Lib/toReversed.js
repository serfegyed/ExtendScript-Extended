/**
 * Returns a dense, shallow, reversed copy.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.toReversed) {
    Array.prototype.toReversed = function () {
        "use strict";

        var object;
        var length;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.toReversed called on null or undefined.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        result = new Array(length);
        for (i = 0; i < length; i++) result[i] = object[length - i - 1];
        return result;
    };
}
