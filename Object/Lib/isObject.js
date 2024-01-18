/**
 * Checks if the given object is an instance of the Object class.
 *
 * @param {any} obj - The object to be checked.
 * @return {boolean} Returns true if the object is an instance of the Object class, false otherwise.
 */
if (!Object.isObject) {
    Object.isObject = function (obj) {
        return typeof obj === 'object' && obj !== null;
    };
};