/**
 * Flattens the given object into a single-level object.
 *
 * @param {object} obj - The object to be flattened
 * @return {object} The flattened object
 */
Object.flat = function (obj) {
    if (!obj || typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'function') return obj;

    var result = {};
    function flatten(key, value, prefix) {
        var flatKey = prefix ? prefix + "_" + key : key;

        if (typeof value === 'object' && value !== null && !(value instanceof Array) && !(value instanceof Date)) {
            for (var innerKey in value) {
                flatten(innerKey, value[innerKey], flatKey);
            }
        } else {
            result[flatKey] = value;
        };
    };

    for (var key in obj) {
        flatten(key, obj[key], '');
    };

    return result;
};