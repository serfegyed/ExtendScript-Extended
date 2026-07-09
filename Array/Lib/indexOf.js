/**
 * Finds the first present index containing a strictly equal value.
 */
if (!Array.prototype.indexOf) {
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

    Array.prototype.indexOf = function (searchElement, fromIndex) {
        "use strict";

        var object;
        var length;
        var from;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.indexOf called on null or undefined.");
        }

        object = Object(this);
        length = toLength(object.length);
        if (length === 0) return -1;
        from = toInteger(fromIndex);
        if (from === Infinity) return -1;
        i = from >= 0 ? from : Math.max(length + from, 0);
        for (; i < length; i++) {
            if (i in object && object[i] === searchElement) return i;
        }
        return -1;
    };
}
