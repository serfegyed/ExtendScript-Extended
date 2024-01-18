/**
 * Defines or modifies a property on an object.
 *
 * @param {Object} obj - The object on which to define or modify the property.
 * @param {string} prop - The name or Symbol of the property to be defined or modified.
 * @param {Object} descriptor - The descriptor for the property being defined or modified.
 * @throws {TypeError} If obj is not an object or is null.
 * @throws {TypeError} If descriptor is not an object or is null.
 * @return {Object} The object that was passed to the function.
 */
if (!Object.defineProperty) {
    Object.defineProperty = function (obj, prop, descriptor) {
        if (typeof obj !== "object" || obj === null) {
            throw new TypeError("Object.defineProperty called on non-object");
        }

        if (typeof descriptor !== "object" || descriptor === null) {
            throw new TypeError("Property description must be an object");
        }

        if (typeof descriptor.value !== "undefined") {
            obj[prop] = descriptor.value;
        }

        // Other descriptor attributes (writable, enumerable, configurable) are not supported in ES3

        return obj;
    };
}
