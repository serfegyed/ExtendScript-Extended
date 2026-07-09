/**
 * Returns a best-effort descriptor for supported own properties.
 *
 * ExtendScript cannot expose full ES5 descriptor semantics. This subset
 * reports data descriptors for own values, array length, and function length.
 *
 * @param {object} value - The object to inspect.
 * @param {string} property - The own property name.
 * @return {object|undefined} A descriptor object, or undefined when missing.
 */
if (!Object.getOwnPropertyDescriptor) {
    var descriptorWritableFromReflection = function (properties, key) {
        var i;

        for (i = 0; i < properties.length; i++) {
            try {
                if (properties[i].name === key && properties[i].type === "readonly") {
                    return false;
                }
            } catch (error) {
                return true;
            }
        }
        return true;
    };

    Object.getOwnPropertyDescriptor = function (value, property) {
        var object;
        var key;
        var enumerable;
        var writable = true;
        var configurable = true;

        if (value === null || value === undefined) {
            throw new TypeError("Object.getOwnPropertyDescriptor called on null or undefined");
        }

        object = Object(value);
        key = String(property);

        if (object instanceof Array && key === "length") {
            return {
                value: object.length,
                writable: true,
                enumerable: false,
                configurable: false
            };
        }

        if (typeof object === "function" && key === "length") {
            return {
                value: object.length,
                writable: false,
                enumerable: false,
                configurable: true
            };
        }

        if (!Object.prototype.hasOwnProperty.call(object, key)) {
            return undefined;
        }

        enumerable = Object.prototype.propertyIsEnumerable.call(object, key);

        if (object.reflect && object.reflect.properties) {
            writable = descriptorWritableFromReflection(object.reflect.properties, key);
        }

        return {
            value: object[key],
            writable: writable,
            enumerable: enumerable,
            configurable: configurable
        };
    };
}
