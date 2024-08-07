/**
 * Checks if an object has a specific property.
 *
 * @param {object} obj - The object to check.
 * @param {string} key - The key to check for.
 * @return {boolean} Returns true if the object has the property, false otherwise.
 */
if (!Object.hasOwn) {
    Object.hasOwn = function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
};