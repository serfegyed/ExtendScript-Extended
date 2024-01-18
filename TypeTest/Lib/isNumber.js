/**
 * Checks if the given value is a number.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a number, otherwise false.
 */
if (typeof isNumber === "undefined") {
    function isNumber(value) {
        return typeof value === "number";
    };
};