/**
 * Checks if a given object is array-like.
 * An object is considered array-like if it has a numeric 'length' property
 * and indexed elements.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns true if the object is array-like, otherwise false.
 */
if (typeof isArrayLike === "undefined") {
    function isArrayLike(value) {
        if (!value && typeof value !== 'string') return false; // Checks for null or undefined, but allows strings
        return typeof value === 'string' || (
            typeof value.length === 'number' &&
            value.length >= 0 &&
            (value.length === 0 || (value.length - 1) in value)
        );
    };
};
