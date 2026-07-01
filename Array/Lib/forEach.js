/**
 * Calls a callback for every present indexed value.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.forEach called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.forEach: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        for (i = 0; i < length; i++) {
            if (i in object) callback.call(thisArg, object[i], i, object);
        }
    };
}
