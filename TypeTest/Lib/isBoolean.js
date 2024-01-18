/**
 * Checks if a given value is a boolean.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a boolean, false otherwise.
 */
if (typeof isBoolean === "undefined") {
    function isBoolean(value) {
        return typeof value === "boolean";
    };
};