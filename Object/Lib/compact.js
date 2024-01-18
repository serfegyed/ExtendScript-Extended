/**
 * Compacts an object or an array by removing any falsy values.
 *
 * @param {Object|Array} val - The object or array to be compacted.
 * @throws {TypeError} If val is not an object or array.
 * @return {Object|Array} The compacted object or array.
 */
Object.compact = function (val) {
    if (!Object.isObject(val) && !Array.isArray(val)) {
        throw new TypeError("Object.compact: " + typeof val + " is not an Object.");
    };
    const data = Array.isArray(val) ? val.filter(Boolean) : val;
    return Object.keys(data).reduce(
        function (acc, key) {
            const value = data[key];
            if (Boolean(value))
                acc[key] = typeof value === 'object' ? Object.compact(value) : value;
            return acc;
        },
        Array.isArray(val) ? [] : {}
    );
};