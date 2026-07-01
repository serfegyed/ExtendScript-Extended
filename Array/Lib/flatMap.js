/**
 * Maps present indexed values and flattens the result by one level.
 */
//@include "./map.js"
//@include "./flat.js"
if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function (callback, thisArg) {
        "use strict";

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.flatMap called on null or undefined.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.flatMap: callback must be a function.");
        }

        return Array.prototype.flat.call(
            Array.prototype.map.call(this, callback, thisArg), 1
        );
    };
}
