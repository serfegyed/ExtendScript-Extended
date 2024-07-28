/**
 * Check if the given value is an integer.
 *
 * @param {any} value - The value to be checked for being an integer
 * @return {boolean} true if the value is an integer, false otherwise
 */
if (!Number.isInteger) {
    Number.isInteger = function (value) {
        // Check if the type of the value is 'number' and it is not NaN
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
            // Check if the absolute value is the same as its integer part
            return Math.floor(Math.abs(value)) === Math.abs(value);
        }
        return false;
    }
}