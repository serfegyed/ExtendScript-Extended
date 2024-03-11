/**
 * Returns the sign of a number, indicating whether the number is positive, negative, or zero.
 *
 * @param {number} value - The number to evaluate.
 * @return {number} The sign of the given number.
 */
if (!Math.sign) {
    Math.sign = function (value) {
        if (isNaN(value)) {
            return NaN;
        }
        if (value === 0 || value === -0) {
            return value;
        }
        return value > 0 ? 1 : -1;
    };
}