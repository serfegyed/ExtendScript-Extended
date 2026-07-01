/**
 * Returns the index following the first matching value, or -1.
 */
//@include "./arrayInternals.js"
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
        object = Object(this);
        length = __arrayToLength__(object.length);
        index = Array.prototype.indexOf.call(object, element, fromIndex);
        return index >= 0 && index < length - 1 ? index + 1 : -1;
    };
}
