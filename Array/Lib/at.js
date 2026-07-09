/**
 * Returns the value at an absolute or relative integer index.
 * Generic: requires only length and integer-indexed properties.
 */
if (!Array.prototype.at) {
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

    Array.prototype.at = function (index) {
        "use strict";

        var object;
        var length;
        var relativeIndex;
        var actualIndex;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.at called on null or undefined.");
        }

        object = Object(this);
        length = toLength(object.length);
        relativeIndex = toInteger(index);
        actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;

        if (actualIndex < 0 || actualIndex >= length) return undefined;
        return object[actualIndex];
    };
}
