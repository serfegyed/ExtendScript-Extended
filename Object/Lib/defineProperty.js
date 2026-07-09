/**
 * Defines or modifies a property on an object.
 *
 * @param {Object} object - The object on which to define or modify the property.
 * @param {string} property - The name or Symbol of the property to be defined or modified.
 * @param {Object} descriptor - The descriptor for the property being defined or modified.
 * @throws {TypeError} If object is not an object or is null.
 * @throws {TypeError} If descriptor is not an object or is null.
 * @return {Object} The object that was passed to the function.
 */
if (!Object.defineProperty) {
    Object.defineProperty = function (object, property, descriptor) {
        if (object === null ||
                (typeof object !== "object" && typeof object !== "function")) {
            throw new TypeError("Object.defineProperty called on non-object");
        }

        if (typeof descriptor !== "object" || descriptor === null) {
            throw new TypeError("Property description must be an object");
        }

        object[String(property)] = descriptor.value;

        // Other descriptor attributes are not supported in ES3.

        return object;
    };
}
