/**
 * Checks if a given object is array-like.
 * An object is considered array-like if it has a numeric 'length' property
 * and indexed elements.
 *
 * @param {any} obj - The object to check.
 * @return {boolean} Returns true if the object is array-like, otherwise false.
 */
if (typeof isArrayLike === "undefined") {
    function isArrayLike(obj) {
        if (!obj && typeof obj !== 'string') return false; // Checks for null or undefined, but allows strings
        return typeof obj === 'string' || (
            typeof obj.length === 'number' &&
            obj.length >= 0 &&
            (obj.length === 0 || (obj.length - 1) in obj)
        );
    };
};
