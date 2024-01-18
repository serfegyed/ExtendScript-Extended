/**
 * Checks if a value is falsy: false, null, undefined, 0, NaN, and an empty string ("")
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns `true` if the value is falsy, `false` otherwise.
 */
if (typeof isFalsy === "undefined") {
    function isFalsy(value) {
        return !value;
    };
};