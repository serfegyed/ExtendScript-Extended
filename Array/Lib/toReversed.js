/**
 * Returns a dense, shallow, reversed copy.
 */
if (!Array.prototype.toReversed) {
    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

    Array.prototype.toReversed = function () {
        "use strict";

        var object;
        var length;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.toReversed called on null or undefined.");
        }
        object = Object(this);
        length = toLength(object.length);
        result = new Array(length);
        for (i = 0; i < length; i++) result[i] = object[length - i - 1];
        return result;
    };
}
