/**
 * Compacts an object or an array by removing any falsy values.
 *
 * @param {Object|Array} value - The object or array to be compacted.
 * @throws {TypeError} If value is not an object or array.
 * @return {Object|Array} The compacted object or array.
 */
if (!Object.compact) {
    Object.compact = function (value) {
        var result;
        var item;
        var key;
        var i;
        var isArray;
        var isPlainObject;

        if (value === null || value === undefined) {
            throw new TypeError("Object.compact: value must be an object or array.");
        }

        isArray = value instanceof Array;
        isPlainObject = value.__class__ === "Object" ||
            typeof value === "object" && value.constructor === Object;
        if (!isArray && !isPlainObject) {
            throw new TypeError("Object.compact: value must be an object or array.");
        }

        if (isArray) {
            result = [];
            for (i = 0; i < value.length; i++) {
                item = value[i];
                if (item) {
                    result.push(typeof item === "object" ? Object.compact(item) : item);
                }
            }
            return result;
        }

        result = {};
        for (key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key) && value[key]) {
                item = value[key];
                result[key] = typeof item === "object" ? Object.compact(item) : item;
            }
        }
        return result;
    };
}
