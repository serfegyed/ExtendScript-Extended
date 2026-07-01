/**
 * Returns present values for which the callback is false.
 */
//@include "./filter.js"
if (!Array.prototype.reject) {
    Array.prototype.reject = function (callback, thisArg) {
        "use strict";

        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.reject: callback must be a function.");
        }
        return Array.prototype.filter.call(this, function (value, index, object) {
            return !callback.call(thisArg, value, index, object);
        });
    };
}
