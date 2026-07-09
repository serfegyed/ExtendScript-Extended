/**
 * Returns the value at a uniformly selected index.
 */
if (!Array.prototype.random) {
    Array.prototype.random = function () {
        "use strict";

        var object;
        var length;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.random called on null or undefined.");
        }
        function toLength(value) {
            var number = Number(value);

            if (number !== number || number <= 0) return 0;
            if (number === Infinity) return 9007199254740991;
            return Math.min(Math.floor(number), 9007199254740991);
        }

        object = Object(this);
        length = toLength(object.length);
        if (length === 0) return undefined;
        return object[Math.floor(Math.random() * length)];
    };
}
