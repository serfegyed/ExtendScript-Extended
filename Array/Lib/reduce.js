/**
 * Reduces present indexed values from left to right.
 */
if (!Array.prototype.reduce) {
    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

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
        length = toLength(object.length);
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
