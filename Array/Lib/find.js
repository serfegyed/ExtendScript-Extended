/**
 * Finds the first indexed value that satisfies the callback.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.find) {
    Array.prototype.find = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var value;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.find called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.find: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        for (i = 0; i < length; i++) {
            value = object[i];
            if (callback.call(thisArg, value, i, object)) return value;
        }
        return undefined;
    };
}
