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