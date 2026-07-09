/**
 * Calculates the cube root of a given number.
 *
 * @param {number} x - The number for which the cube root is to be calculated
 * @return {number} The cube root of the input number
 */
if (!Math.cbrt) {
    Math.cbrt = function (x) {
        x = x * 1;
        if (x === 0 || x !== x || x === Infinity || x === -Infinity) return x;
        var negate = x < 0,
            result,
            rounded;
        if (negate) {
            x = -x;
        }
        result = Math.exp(Math.log(x) / 3);
        result = (2 * result + x / (result * result)) / 3;
        rounded = Math.round(result);
        if (rounded * rounded * rounded === x) {
            result = rounded;
        }
        return negate ? -result : result;
    };
}
