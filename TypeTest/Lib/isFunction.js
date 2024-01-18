/**
 * Checks if a given value is a function.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns true if the value is a function, otherwise false.
 */
if (typeof isFunction === "undefined") {
    function isFunction(value) {
        return value instanceof Function;
    };
};