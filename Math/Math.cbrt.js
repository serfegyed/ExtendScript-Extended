/**
 * Calculates the cube root of a given number.
 *
 * @param {number} x - The number for which the cube root is to be calculated
 * @return {number} The cube root of the input number
 */
if (!Math.cbrt) {
    Math.cbrt = function (x) {
        if (x === 0) return 0;
        var negate = x < 0,
            result;
        if (negate) {
            x = -x;
        }
        result = Math.exp(Math.log(x) / 3);
        return negate ? -result : result;
    };
}
