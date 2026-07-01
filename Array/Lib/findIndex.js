/**
 * Finds the first index whose value satisfies the callback.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.findIndex called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.findIndex: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        for (i = 0; i < length; i++) {
            if (callback.call(thisArg, object[i], i, object)) return i;
        }
        return -1;
    };
}
