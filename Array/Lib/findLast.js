/**
 * Finds the last indexed value that satisfies the callback.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.findLast) {
    Array.prototype.findLast = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var value;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.findLast called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.findLast: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        for (i = length - 1; i >= 0; i--) {
            value = object[i];
            if (callback.call(thisArg, value, i, object)) return value;
        }
        return undefined;
    };
}
