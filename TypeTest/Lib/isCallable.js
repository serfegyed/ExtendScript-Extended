/**
 * Determines if a given value is callable.
 *
 * @param {Object} func - The function to check if callable.
 * @return {boolean} - Returns true if the function is callable, false otherwise.
 */
if (typeof isCallable === "undefined") {
    function isCallable(func) {
        return typeof func === 'function';
    };
};