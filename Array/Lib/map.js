/**
 * Maps every present indexed value to a new Array.
 */
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var result;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.map called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.map: callback must be a function.");
        }

        function toLength(value) {
            var number = Number(value);

            if (number !== number || number <= 0) return 0;
            if (number === Infinity) return 9007199254740991;
            return Math.min(Math.floor(number), 9007199254740991);
        }

        object = Object(this);
        length = toLength(object.length);
        result = new Array(length);
        for (i = 0; i < length; i++) {
            if (i in object) result[i] = callback.call(thisArg, object[i], i, object);
        }
        return result;
    };
}
