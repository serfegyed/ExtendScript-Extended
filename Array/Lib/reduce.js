/**
 * Reduces present indexed values from left to right.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback, initialValue) {
        "use strict";

        var object;
        var length;
        var accumulator;
        var i = 0;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.reduce called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.reduce: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        if (arguments.length > 1) {
            accumulator = initialValue;
        } else {
            while (i < length && !(i in object)) i++;
            if (i >= length) {
                throw new TypeError("Reduce of empty Array with no initial value.");
            }
            accumulator = object[i++];
        }

        for (; i < length; i++) {
            if (i in object) {
                accumulator = callback(accumulator, object[i], i, object);
            }
        }
        return accumulator;
    };
}
