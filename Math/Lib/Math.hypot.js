/**
 * Calculates the square root of the sum of squares of its arguments.
 *
 * @return {number} The Euclidean norm of the given values.
 */
if (!Math.hypot) {
    Math.hypot = function () {
        var max = 0;
        var sum = 0;
        var containsNaN = false;
        var value;
        var i;

        for (i = 0; i < arguments.length; i++) {
            value = arguments[i] * 1;
            if (value === Infinity || value === -Infinity) {
                return Infinity;
            }
            if (value !== value) {
                containsNaN = true;
            } else {
                value = Math.abs(value);
                if (value > max) {
                    if (max !== 0) {
                        sum = sum * (max / value) * (max / value);
                    }
                    max = value;
                }
                if (value !== 0) {
                    sum += (value / max) * (value / max);
                }
            }
        }

        if (containsNaN) {
            return NaN;
        }
        if (max === 0) {
            return 0;
        }
        return max * Math.sqrt(sum);
    };
}
