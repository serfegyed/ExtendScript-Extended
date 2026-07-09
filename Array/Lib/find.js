/**
 * Finds the first indexed value that satisfies the callback.
 */
if (!Array.prototype.find) {
    Array.prototype.find = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var value;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.find called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.find: callback must be a function.");
        }

        function toLength(value) {
            var number = Number(value);

            if (number !== number || number <= 0) return 0;
            if (number === Infinity) return 9007199254740991;
            return Math.min(Math.floor(number), 9007199254740991);
        }

        object = Object(this);
        length = toLength(object.length);
        for (i = 0; i < length; i++) {
            value = object[i];
            if (callback.call(thisArg, value, i, object)) return value;
        }
        return undefined;
    };
}
