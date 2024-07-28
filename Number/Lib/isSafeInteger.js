// Defining MAX_SAFE_INTEGER and MIN_SAFE_INTEGER
Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
Number.MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;

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