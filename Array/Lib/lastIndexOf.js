/**
 * Finds the last present index containing a strictly equal value.
 */
if (!Array.prototype.lastIndexOf) {
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

    Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
        "use strict";

        var object;
        var length;
        var from;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.lastIndexOf called on null or undefined.");
        }

        object = Object(this);
        length = toLength(object.length);
        if (length === 0) return -1;
        from = arguments.length > 1 ? toInteger(fromIndex) : length - 1;
        if (from === -Infinity) return -1;
        i = from >= 0 ? Math.min(from, length - 1) : length + from;
        for (; i >= 0; i--) {
            if (i in object && object[i] === searchElement) return i;
        }
        return -1;
    };
}
