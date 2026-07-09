/**
 * Truncates the decimal part of a number towards zero.
 *
 * @param {number} value - The number to truncate.
 * @return {number} The truncated number.
 */
if (!Math.trunc) {
    Math.trunc = function (value) {
        // Check if value is NaN, return NaN to match Math.trunc behavior
        if (isNaN(value)) {
            return NaN;
        }

        // Use Math.ceil and Math.floor to truncate towards zero
        // This works for all finite numbers, including those outside the 32-bit range
        return value < 0 ? Math.ceil(value) : Math.floor(value);
    };
}
