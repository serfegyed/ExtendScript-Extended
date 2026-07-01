/**
 * Maps every present indexed value to a new Array.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.map called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.map: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        result = new Array(length);
        for (i = 0; i < length; i++) {
            if (i in object) result[i] = callback.call(thisArg, object[i], i, object);
        }
        return result;
    };
}
