/**
 * Finds the first index whose value satisfies the callback.
 */
if (!Array.prototype.findIndex) {
    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

    Array.prototype.findIndex = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.findIndex called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.findIndex: callback must be a function.");
        }

        object = Object(this);
        length = toLength(object.length);
        for (i = 0; i < length; i++) {
            if (callback.call(thisArg, object[i], i, object)) return i;
        }
        return -1;
    };
}
