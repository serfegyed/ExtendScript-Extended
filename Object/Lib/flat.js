/**
 * Flattens the given object into a single-level object.
 *
 * @param {object} object - The object to be flattened
 * @return {object} The flattened object
 * @dependency Object.isCyclic()
 */
if (!Object.flat) {
    Object.flat = function (object) {
        var result = {};
        var key;

        if (object === null || typeof object !== "object") return object;
        if (Object.isCyclic(object)) {
            throw new TypeError("Object.flat: cyclic reference.");
        }

        function flatten(property, value, prefix) {
            var flatKey = prefix ? prefix + "_" + property : property;
            var hasOwn = false;
            var innerKey;

            if (typeof value === "object" && value !== null &&
                    !(value instanceof Array) && !(value instanceof Date)) {
                for (innerKey in value) {
                    if (Object.prototype.hasOwnProperty.call(value, innerKey)) {
                        hasOwn = true;
                        flatten(innerKey, value[innerKey], flatKey);
                    }
                }
                if (!hasOwn) result[flatKey] = value;
            } else {
                result[flatKey] = value;
            }
        }

        for (key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                flatten(key, object[key], "");
            }
        }

        return result;
    };
}
