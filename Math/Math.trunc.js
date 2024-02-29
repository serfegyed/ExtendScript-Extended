/**
 * Truncates the decimal part of a number towards zero.
 *
 * @param {number} v - The number to truncate.
 * @return {number} The truncated number.
 */
if (!Math.trunc) {
    Math.trunc = function (v) {
        // Check if v is NaN, return NaN to match Math.trunc behavior
        if (isNaN(v)) {
            return NaN;
        }

        // Use Math.ceil and Math.floor to truncate towards zero
        // This works for all finite numbers, including those outside the 32-bit range
        return v < 0 ? Math.ceil(v) : Math.floor(v);
    };
}