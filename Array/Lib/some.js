/**
 * Tests whether any present indexed value satisfies a callback.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.some) {
    Array.prototype.some = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.some called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.some: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        for (i = 0; i < length; i++) {
            if (i in object && callback.call(thisArg, object[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}
