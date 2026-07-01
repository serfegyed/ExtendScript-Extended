/**
 * Finds the last index whose value satisfies the callback.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.findLastIndex) {
    Array.prototype.findLastIndex = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.findLastIndex called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.findLastIndex: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        for (i = length - 1; i >= 0; i--) {
            if (callback.call(thisArg, object[i], i, object)) return i;
        }
        return -1;
    };
}
