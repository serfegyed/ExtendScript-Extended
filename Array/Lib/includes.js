/**
 * Tests indexed values using SameValueZero comparison.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement, fromIndex) {
        "use strict";

        var object;
        var length;
        var from;
        var value;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.includes called on null or undefined.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        if (length === 0) return false;
        from = __arrayToInteger__(fromIndex);
        if (from === Infinity) return false;
        i = from >= 0 ? from : Math.max(length + from, 0);
        for (; i < length; i++) {
            value = object[i];
            if (value === searchElement ||
                    (value !== value && searchElement !== searchElement)) return true;
        }
        return false;
    };
}
