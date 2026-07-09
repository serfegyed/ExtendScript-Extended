/**
 * Calculates the natural logarithm of 1 plus a number.
 *
 * @param {number} x - The number to calculate log(1 + x) for.
 * @return {number} The natural logarithm of 1 plus the input number.
 */
if (!Math.log1p) {
    Math.log1p = function (x) {
        var y = x * 1;
        var term;
        var sum;
        var n;

        if (y === -1) {
            return -Infinity;
        }
        if (y === 0 || y === Infinity || y !== y) {
            return y + y;
        }
        if (y < -1) {
            return NaN;
        }
        if (Math.abs(y) < 1e-4) {
            term = y;
            sum = 0;
            for (n = 1; n < 40; n++) {
                sum += (n % 2 ? 1 : -1) * term / n;
                term *= y;
            }
            return sum;
        }
        return Math.log(1 + y);
    };
}
