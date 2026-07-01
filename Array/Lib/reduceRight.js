/**
 * Reduces present indexed values from right to left.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function (callback, initialValue) {
        "use strict";

        var object;
        var length;
        var accumulator;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.reduceRight called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.reduceRight: callback must be a function.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        i = length - 1;
        if (arguments.length > 1) {
            accumulator = initialValue;
        } else {
            while (i >= 0 && !(i in object)) i--;
            if (i < 0) {
                throw new TypeError("Reduce of empty Array with no initial value.");
            }
            accumulator = object[i--];
        }

        for (; i >= 0; i--) {
            if (i in object) {
                accumulator = callback(accumulator, object[i], i, object);
            }
        }
        return accumulator;
    };
}
