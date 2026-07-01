/**
 * Compacts an object or an array by removing any falsy values.
 *
 * @param {Object|Array} val - The object or array to be compacted.
 * @throws {TypeError} If val is not an object or array.
 * @return {Object|Array} The compacted object or array.
 */
if (!Object.compact) {
    Object.compact = function (val) {
        var result;
        var value;
        var key;
        var i;
        var isArray;
        var isPlainObject;

        if (val === null || val === undefined) {
            throw new TypeError("Object.compact: value must be an object or array.");
        }

        isArray = val instanceof Array;
        isPlainObject = val.__class__ === "Object" ||
            typeof val === "object" && val.constructor === Object;
        if (!isArray && !isPlainObject) {
            throw new TypeError("Object.compact: value must be an object or array.");
        }

        if (isArray) {
            result = [];
            for (i = 0; i < val.length; i++) {
                value = val[i];
                if (value) {
                    result.push(typeof value === "object" ? Object.compact(value) : value);
                }
            }
            return result;
        }

        result = {};
        for (key in val) {
            if (Object.prototype.hasOwnProperty.call(val, key) && val[key]) {
                value = val[key];
                result[key] = typeof value === "object" ? Object.compact(value) : value;
            }
        }
        return result;
    };
}
