/**
 * Calculates the natural logarithm of 1 plus a number.
 *
 * @param {number} value - The number to calculate log(1 + value) for.
 * @return {number} The natural logarithm of 1 plus the input number.
 */
if (!Math.log1p) {
    Math.log1p = function (value) {
        var number = value * 1;
        var term;
        var sum;
        var i;

        if (number === -1) {
            return -Infinity;
        }
        if (number === 0 || number === Infinity || number !== number) {
            return number + number;
        }
        if (number < -1) {
            return NaN;
        }
        if (Math.abs(number) < 1e-4) {
            term = number;
            sum = 0;
            for (i = 1; i < 40; i++) {
                sum += (i % 2 ? 1 : -1) * term / i;
                term *= number;
            }
            return sum;
        }
        return Math.log(1 + number);
    };
}
