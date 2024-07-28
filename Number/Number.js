// Defining MAX_SAFE_INTEGER and MIN_SAFE_INTEGER
Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
Number.MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
Number.EPSILON = Math.pow(2, -52);

/**
 * Check if the given value is an integer.
 *
 * @param {any} value - The value to be checked for being an integer
 * @return {boolean} true if the value is an integer, false otherwise
 */
if (!Number.isInteger) {
    Number.isInteger = function (value) {
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
            return Math.floor(Math.abs(value)) === Math.abs(value);
        }
        return false;
    }
}

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

/**
 * Checks if the given value is NaN (Not a Number).
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is NaN, otherwise false.
 */
if (!Number.isNaN) {
    Number.isNaN = function (value) {
        return typeof value === 'number' && isNaN(value);
    };
};

/**
 * Checks if a value is a finite number.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns true if the value is a finite number, otherwise false.
 */
if (!Number.isFinite) {
    Number.isFinite = function (value) {
        return typeof value === 'number' && isFinite(value);
    };
};