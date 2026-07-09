/**
 * Checks if an object has a specific property.
 *
 * @param {object} object - The object to check.
 * @param {string} property - The property to check for.
 * @return {boolean} Returns true if the object has the property, false otherwise.
 */
if (!Object.hasOwn) {
    Object.hasOwn = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
};
