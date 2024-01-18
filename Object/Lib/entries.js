/**
 * Returns an array of key-value pairs representing the properties of an object.
 *
 * @param {Object} obj - The object to extract the properties from.
 * @return {Array} An array of key-value pairs representing the properties of the object.
 */
if (!Object.entries) {
    Object.entries = function (obj) {
        if (!obj || typeof obj !== "object") throw new TypeError(obj.toString() + " is not an object");
        var results = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) results.push([key, obj[key]]);
        }
        return results;
    };
};