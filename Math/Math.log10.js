/**
 * Calculates the base 10 logarithm of a number.
 *
 * @param {number} x - The number to calculate the logarithm of
 * @return {number} The base 10 logarithm of the input number
 */
if (!Math.log10) {
    Math.log10 = function (x) {
        return Math.log(x) / Math.LN10;
    };
}
