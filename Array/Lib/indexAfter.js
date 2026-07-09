/**
 * Returns the index following the first matching value, or -1.
 */
//@include "./indexOf.js"
if (!Array.prototype.indexAfter) {
    Array.prototype.indexAfter = function (element, fromIndex) {
        "use strict";

        var object;
        var length;
        var index;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.indexAfter called on null or undefined.");
        }
        function toLength(value) {
            var number = Number(value);

            if (number !== number || number <= 0) return 0;
            if (number === Infinity) return 9007199254740991;
            return Math.min(Math.floor(number), 9007199254740991);
        }

        object = Object(this);
        length = toLength(object.length);
        index = Array.prototype.indexOf.call(object, element, fromIndex);
        return index >= 0 && index < length - 1 ? index + 1 : -1;
    };
}
