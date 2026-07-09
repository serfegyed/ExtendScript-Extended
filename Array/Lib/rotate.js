/**
 * Returns a shallow copy rotated right by a positive number of steps.
 */
if (!Array.prototype.rotate) {
    function toInteger(value) {
        var number = Number(value);

        if (number !== number || number === 0) return 0;
        if (number === Infinity || number === -Infinity) return number;
        return number < 0 ? Math.ceil(number) : Math.floor(number);
    }

    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

    Array.prototype.rotate = function (step) {
        "use strict";

        var object;
        var length;
        var offset;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.rotate called on null or undefined.");
        }
        object = Object(this);
        length = toLength(object.length);
        result = new Array(length);
        if (length === 0) return result;
        offset = toInteger(step);
        if (offset === Infinity || offset === -Infinity) offset = 0;
        offset = ((offset % length) + length) % length;
        for (i = 0; i < length; i++) {
            if (i in object) result[(i + offset) % length] = object[i];
        }
        return result;
    };
}
