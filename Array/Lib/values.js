/**
 * Returns a live iterator over every indexed value below length.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.values) {
    Array.prototype.values = function () {
        "use strict";

        var object;
        var index = 0;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.values called on null or undefined.");
        }
        object = Object(this);

        return {
            next: function () {
                if (index >= __arrayToLength__(object.length)) {
                    return {done: true, value: undefined};
                }
                return {done: false, value: object[index++]};
            }
        };
    };
}
