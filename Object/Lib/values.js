/**
 * Returns an array of all the values in the given object.
 *
 * @param {Object} obj - The object to extract values from.
 * @return {Array} An array of all the values in the object.
 */
if (!Object.values) {
    Object.values = function (obj) {
        if (!obj || typeof obj !== "object") throw new TypeError(obj.toString() + " is not an object");

        var results = [];
        for (var key in obj) {
            (obj.hasOwnProperty ? obj.hasOwnProperty(key) : key in obj) && results.push(obj[key]);
        }
        return results;
    };
};