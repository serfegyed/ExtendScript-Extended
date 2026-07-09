/**
 * Returns a dense Array containing present values accepted by a callback.
 */
if (!Array.prototype.filter) {
    Array.prototype.filter = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var result = [];
        var value;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.filter called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.filter: callback must be a function.");
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
            if (i in object) {
                value = object[i];
                if (callback.call(thisArg, value, i, object)) result.push(value);
            }
        }
        return result;
    };
}
