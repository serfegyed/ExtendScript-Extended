/**
 * Returns an array containing the enumerable property names of an object.
 *
 * @param {object} obj - The object to retrieve the property names from.
 * @return {Array} An array containing the property names of the object.
 */
if (!Object.keys) {
    Object.keys = function (obj) {
        if (!obj || typeof obj !== "object") throw new TypeError(obj.toString() + " is not an object");

        var results = [];
        for (var key in obj) {
            (obj.hasOwnProperty ? obj.hasOwnProperty(key) : key in obj) && results.push(key);
        }
        return results;
    };
};
