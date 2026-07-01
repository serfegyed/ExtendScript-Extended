/**
 * Returns a dense Array containing present values accepted by a callback.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.filter) {
    Array.prototype.filter = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var result = [];
        var value;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.filter called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.filter: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        for (i = 0; i < length; i++) {
            if (i in object) {
                value = object[i];
                if (callback.call(thisArg, value, i, object)) result.push(value);
            }
        }
        return result;
    };
}
