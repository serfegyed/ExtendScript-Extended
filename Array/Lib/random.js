/**
 * Returns the value at a uniformly selected index.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.random) {
    Array.prototype.random = function () {
        "use strict";

        var object;
        var length;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.random called on null or undefined.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        if (length === 0) return undefined;
        return object[Math.floor(Math.random() * length)];
    };
}
