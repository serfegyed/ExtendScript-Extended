/**
 * Reduces present indexed values from right to left.
 */
if (!Array.prototype.reduceRight) {
    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

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
        length = toLength(object.length);
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
