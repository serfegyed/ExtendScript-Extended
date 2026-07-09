/**
 * Returns a shallow copy without the value at the requested index.
 */
if (!Array.prototype.remove) {
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

    Array.prototype.remove = function (index) {
        "use strict";

        var object;
        var length;
        var actualIndex;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.remove called on null or undefined.");
        }
        object = Object(this);
        length = toLength(object.length);
        if (length === 0) return undefined;
        actualIndex = toInteger(index);
        if (actualIndex < 0) actualIndex = length + actualIndex;
        if (actualIndex < 0 || actualIndex >= length) {
            throw new RangeError("Array.prototype.remove index is out of range.");
        }

        result = new Array(length - 1);
        for (i = 0; i < actualIndex; i++) {
            if (i in object) result[i] = object[i];
        }
        for (i = actualIndex + 1; i < length; i++) {
            if (i in object) result[i - 1] = object[i];
        }
        return result;
    };
}
