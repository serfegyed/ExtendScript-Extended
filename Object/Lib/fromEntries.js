/**
 * Creates an object from an array of key-value pairs. (Counterpart of Object.entries())
 *
 * @param {Array} entries - The array of key-value pairs.
 * @return {Object} The resulting object.
 */
if (!Object.fromEntries) {
    Object.fromEntries = function (entries) {
        if (!Array.isArray(entries)) {
            throw new TypeError("Object.fromEntries requires an array as input");
        }

        var obj = {};
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];

            if (Array.isArray(entry) && entry.length === 2) {
                var key = entry[0];
                var value = entry[1];
                obj[key] = value;
            }
        }

        return obj;
    };
};