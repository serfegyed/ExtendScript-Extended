/**
 * Returns a dense, shallow copy with one indexed value replaced.
 */
if (!Array.prototype.with) {
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

    Array.prototype.with = function (index, value) {
        "use strict";

        var object;
        var length;
        var relativeIndex;
        var actualIndex;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.with called on null or undefined.");
        }
        object = Object(this);
        length = toLength(object.length);
        relativeIndex = toInteger(index);
        actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
        if (actualIndex < 0 || actualIndex >= length) {
            throw new RangeError("Array.prototype.with index is out of range.");
        }

        result = new Array(length);
        for (i = 0; i < length; i++) {
            result[i] = i === actualIndex ? value : object[i];
        }
        return result;
    };
}
