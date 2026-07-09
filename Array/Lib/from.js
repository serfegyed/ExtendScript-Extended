/**
 * Creates an Array from an array-like value.
 *
 * ExtendScript does not expose the standard iterator protocol, so this
 * polyfill intentionally implements the array-like branch.
 */
//@include "./arrayInternals.js"
if (!Array.from) {
    Array.from = function (arrayLike, callback, thisArg) {
        var object;
        var length;
        var constructor;
        var result;
        var i;

        if (arrayLike === null || arrayLike === undefined) {
            throw new TypeError("Array.from called with null or undefined.");
        }
        if (callback !== undefined && typeof callback !== "function") {
            throw new TypeError("Array.from: mapFunction must be a function.");
        }

        object = Object(arrayLike);
        length = __arrayToLength__(object.length);
        constructor = typeof this === "function" ? this : Array;
        result = new constructor(length);
        if (callback === undefined) {
            for (i = 0; i < length; i++) {
                result[i] = object[i];
            }
        } else {
            for (i = 0; i < length; i++) {
                result[i] = callback.call(thisArg, object[i], i);
            }
        }
        result.length = length;
        return result;
    };
}
