/**
 * Returns a live iterator over [index, value] pairs.
 * Generic: requires only length and integer-indexed properties.
 */
if (!Array.prototype.entries) {
    Array.prototype.entries = function () {
        "use strict";

        var object;
        var index = 0;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.entries called on null or undefined.");
        }
        object = Object(this);

        function toLength(value) {
            var number = Number(value);

            if (number !== number || number <= 0) return 0;
            if (number === Infinity) return 9007199254740991;
            return Math.min(Math.floor(number), 9007199254740991);
        }

        return {
            next: function () {
                if (index >= toLength(object.length)) {
                    return {done: true, value: undefined};
                }
                return {done: false, value: [index, object[index++]]};
            }
        };
    };
}
