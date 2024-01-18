/**
 * Determines if a value is a regular expression.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns `true` if the value is a regular expression, else `false`.
 */
if (typeof isRegExp === "undefined") {
    function isRegExp(value) {
        return value instanceof RegExp;
    };
};