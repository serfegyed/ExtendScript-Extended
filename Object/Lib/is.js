/**
 * Determines whether two values are the same value or both NaN.
 *
 * @param {any} x - The first value to compare.
 * @param {any} y - The second value to compare.
 * @return {boolean} Returns true if the values are the same value or both NaN; otherwise, false.
 */
if (!Object.is) {
    Object.is = function (x, y) {
        // Helper function to check for NaN
        var isItNaN = function (v) {
            return v !== v;
        };

        // Check for same value or if both are NaN
        if (x === y) {
            // Handle +/- 0
            return x !== 0 || 1 / x === 1 / y;
        } else {
            // Handle NaN
            return isItNaN(x) && isItNaN(y);
        }
    };
};