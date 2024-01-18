/**
 * Checks if the given value is null.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is null, otherwise returns false.
 */
if (typeof isNull === "undefined") {
    function isNull(value) {
        return value === null;
    };
};