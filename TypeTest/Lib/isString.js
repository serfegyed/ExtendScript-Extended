/**
 * Checks if a value is a string.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a string, otherwise false.
 */
if (typeof isString === "undefined") {
    function isString(value) {
        return typeof value === "string";
    };
};