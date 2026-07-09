/**
 * Determines if a given value is callable.
 *
 * @param {Object} value - The value to check if callable.
 * @return {boolean} - Returns true if the function is callable, false otherwise.
 */
if (typeof isCallable === "undefined") {
    function isCallable(value) {
        return typeof value === 'function';
    };
};
