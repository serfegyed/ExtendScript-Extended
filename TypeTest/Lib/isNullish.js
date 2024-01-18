/**
 * Checks if a value is null or undefined.
 *
 * @param {any} value - The value to check.
 * @return {boolean} True if the value is null or undefined, false otherwise.
 */
if (typeof isNullish === "undefined") {
    function isNullish(value) {
        return value === null || value === undefined;
    };
};