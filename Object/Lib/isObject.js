/**
 * Checks if the given object is an instance of the Object class.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the object is an instance of the Object class, false otherwise.
 */
if (!Object.isObject) {
    Object.isObject = function (value) {
        return (typeof value === "object" && value !== null) || typeof value === "function";
    };
};
