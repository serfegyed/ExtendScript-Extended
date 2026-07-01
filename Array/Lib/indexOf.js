/**
 * Finds the first present index containing a strictly equal value.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        "use strict";

        var object;
        var length;
        var from;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.indexOf called on null or undefined.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        if (length === 0) return -1;
        from = __arrayToInteger__(fromIndex);
        if (from === Infinity) return -1;
        i = from >= 0 ? from : Math.max(length + from, 0);
        for (; i < length; i++) {
            if (i in object && object[i] === searchElement) return i;
        }
        return -1;
    };
}
