/**
 * Returns a shallow copy rotated right by a positive number of steps.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.rotate) {
    Array.prototype.rotate = function (step) {
        "use strict";

        var object;
        var length;
        var offset;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.rotate called on null or undefined.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        result = new Array(length);
        if (length === 0) return result;
        offset = __arrayToInteger__(step);
        if (offset === Infinity || offset === -Infinity) offset = 0;
        offset = ((offset % length) + length) % length;
        for (i = 0; i < length; i++) {
            if (i in object) result[(i + offset) % length] = object[i];
        }
        return result;
    };
}
