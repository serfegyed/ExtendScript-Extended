/**
 * Calculates e raised to a number, minus 1.
 *
 * @param {number} value - The exponent.
 * @return {number} e raised to value, minus 1.
 */
if (!Math.expm1) {
    Math.expm1 = function (value) {
        var number = value * 1;
        var term;
        var sum;
        var i;

        if (number === 0 || number === Infinity || number === -Infinity || number !== number) {
            return number === -Infinity ? -1 : number;
        }
        if (Math.abs(number) < 1e-5) {
            term = number;
            sum = number;
            for (i = 2; i < 30; i++) {
                term *= number / i;
                sum += term;
            }
            return sum;
        }
        return Math.exp(number) - 1;
    };
}
