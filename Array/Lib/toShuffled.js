/**
 * Returns a shuffled shallow copy using the inside-out algorithm.
 */
if (!Array.prototype.toShuffled) {
    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

    Array.prototype.toShuffled = function () {
        "use strict";

        var object;
        var length;
        var result;
        var i;
        var j;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.toShuffled called on null or undefined.");
        }
        object = Object(this);
        length = toLength(object.length);
        result = new Array(length);
        for (i = 0; i < length; i++) {
            j = Math.floor(Math.random() * (i + 1));
            if (i !== j && j in result) result[i] = result[j];
            if (i in object) result[j] = object[i];
            else delete result[j];
        }
        return result;
    };
}
