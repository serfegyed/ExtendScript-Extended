/**
 * Returns a live iterator over [index, value] pairs.
 * Generic: requires only length and integer-indexed properties.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.entries) {
    Array.prototype.entries = function () {
        "use strict";

        var object;
        var index = 0;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.entries called on null or undefined.");
        }
        object = Object(this);

        return {
            next: function () {
                if (index >= __arrayToLength__(object.length)) {
                    return {done: true, value: undefined};
                }
                return {done: false, value: [index, object[index++]]};
            }
        };
    };
}
