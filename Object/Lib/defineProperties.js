/**
 * Defines new or modifies existing properties directly on an object, returning the object.
 *
 * @param {object} obj - The object on which to define or modify properties.
 * @param {object} properties - An object whose keys represent the names of properties to be defined or modified
 * and whose values are objects defining the attributes for the properties to be defined or modified.
 * ({desc1: {value: data}, desc2:...}) For example:({name: {value: "John"}, ...})
 * @throws {TypeError} If obj is not an object or is null, or if properties is not an object or is null.
 * @return {object} The object with the defined or modified properties.
 */
if (!Object.defineProperties) {
    Object.defineProperties = function (object, properties) {
        var property;

        if (object === null ||
                (typeof object !== "object" && typeof object !== "function")) {
            throw new TypeError("Object.defineProperties called on non-object");
        }
        if (typeof properties !== "object" || properties === null) {
            throw new TypeError(
                "Object.defineProperties called with non-object properties argument"
            );
        }

        for (property in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, property)) {
                Object.defineProperty(object, property, properties[property]);
            }
        }

        return object;
    };
}
