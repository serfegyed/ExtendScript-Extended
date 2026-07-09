/**
 * Calculates e raised to a number, minus 1.
 *
 * @param {number} x - The exponent.
 * @return {number} e raised to x, minus 1.
 */
if (!Math.expm1) {
    Math.expm1 = function (x) {
        var y = x * 1;
        var term;
        var sum;
        var n;

        if (y === 0 || y === Infinity || y === -Infinity || y !== y) {
            return y === -Infinity ? -1 : y;
        }
        if (Math.abs(y) < 1e-5) {
            term = y;
            sum = y;
            for (n = 2; n < 30; n++) {
                term *= y / n;
                sum += term;
            }
            return sum;
        }
        return Math.exp(y) - 1;
    };
}
