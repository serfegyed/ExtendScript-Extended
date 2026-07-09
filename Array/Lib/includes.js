/**
 * Tests indexed values using SameValueZero comparison.
 */
if (!Array.prototype.includes) {
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

    Array.prototype.includes = function (searchElement, fromIndex) {
        "use strict";

        var object;
        var length;
        var from;
        var value;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.includes called on null or undefined.");
        }

        object = Object(this);
        length = toLength(object.length);
        if (length === 0) return false;
        from = toInteger(fromIndex);
        if (from === Infinity) return false;
        i = from >= 0 ? from : Math.max(length + from, 0);
        for (; i < length; i++) {
            value = object[i];
            if (value === searchElement ||
                    (value !== value && searchElement !== searchElement)) return true;
        }
        return false;
    };
}
