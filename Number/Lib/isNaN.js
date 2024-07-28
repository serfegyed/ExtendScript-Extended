/**
 * Checks if the given value is NaN (Not a Number).
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is NaN, otherwise false.
 */
if (!Number.isNaN) {
    Number.isNaN = function (value) {
        return typeof value === 'number' && isNaN(value);
    };
}