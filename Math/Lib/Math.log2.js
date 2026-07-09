/**
 * Calculates the base 2 logarithm of a number.
 *
 * @param {number} x - The number to calculate the logarithm of.
 * @return {number} The base 2 logarithm of the input number.
 */
if (!Math.log2) {
    Math.log2 = function (x) {
        return Math.log(x) / Math.LN2;
    };
}
