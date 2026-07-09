/**
 * Calls a callback for every present indexed value.
 */
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.forEach called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.forEach: callback must be a function.");
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
            if (i in object) callback.call(thisArg, object[i], i, object);
        }
    };
}
