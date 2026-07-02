//@include "./MAX_SAFE_INTEGER.js"
//@include "./MIN_SAFE_INTEGER.js"

/**
 * Check if the given value is a safe integer.
 *
 * @param {number} value - The value to be checked
 * @return {boolean} true if the value is a safe integer, false otherwise
 */
if (!Number.isSafeInteger) {
    Number.isSafeInteger = function (value) {
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
            return Math.floor(Math.abs(value)) === Math.abs(value) &&
                value <= Number.MAX_SAFE_INTEGER &&
                value >= Number.MIN_SAFE_INTEGER;
        }
        return false;
    };
};
