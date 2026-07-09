/**
 * Fills an index range on an Array or array-like object.
 */
if (!Array.prototype.fill) {
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

    Array.prototype.fill = function (value, start, end) {
        "use strict";

        var object;
        var length;
        var first;
        var finalIndex;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.fill called on null or undefined.");
        }

        object = Object(this);
        length = toLength(object.length);
        first = start === undefined ? 0 : toInteger(start);
        finalIndex = end === undefined ? length : toInteger(end);
        first = first < 0 ? Math.max(length + first, 0) : Math.min(first, length);
        finalIndex = finalIndex < 0 ?
            Math.max(length + finalIndex, 0) : Math.min(finalIndex, length);

        while (first < finalIndex) {
            object[first] = value;
            first++;
        }
        return object;
    };
}
