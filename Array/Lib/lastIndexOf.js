/**
 * Finds the last present index containing a strictly equal value.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
        "use strict";

        var object;
        var length;
        var from;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.lastIndexOf called on null or undefined.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        if (length === 0) return -1;
        from = arguments.length > 1 ? __arrayToInteger__(fromIndex) : length - 1;
        if (from === -Infinity) return -1;
        i = from >= 0 ? Math.min(from, length - 1) : length + from;
        for (; i >= 0; i--) {
            if (i in object && object[i] === searchElement) return i;
        }
        return -1;
    };
}
