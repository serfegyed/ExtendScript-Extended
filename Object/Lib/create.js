/**
 * Creates a new object with the specified prototype and properties.
 *
 * @param {Object} prototype - The prototype object.
 * @param {Object} properties - Direct property values used by this project subset.
 * @return {Object} The newly created object.
 */
if (!Object.create) {
    Object.create = function (prototype, properties) {
        function F() {}

        var object;
        var property;

        if (prototype !== null && typeof prototype !== "object" &&
                typeof prototype !== "function") {
            throw new TypeError("Object prototype may only be an Object or null");
        }

        if (prototype === null) {
            object = {};
            object.__proto__ = null;
        } else {
            F.prototype = prototype;
            object = new F();
        }

        if (properties !== undefined &&
                (properties === null || typeof properties !== "object")) {
            throw new TypeError("Object.create properties must be an object");
        }
        if (typeof properties === "object") {
            for (property in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, property)) {
                    object[property] = properties[property];
                }
            }
        }

        return object;
    };
}
