/**
 * Returns a live iterator over every integer index below length.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.keys) {
    Array.prototype.keys = function () {
        "use strict";

        var object;
        var index = 0;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.keys called on null or undefined.");
        }
        object = Object(this);

        return {
            next: function () {
                if (index >= __arrayToLength__(object.length)) {
                    return {done: true, value: undefined};
                }
                return {done: false, value: index++};
            }
        };
    };
}
