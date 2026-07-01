/**
 * Returns an array of all the values in the given object.
 *
 * @param {Object} obj - The object to extract values from.
 * @return {Array} An array of all the values in the object.
 */
if (!Object.values) {
    Object.values = function (value) {
        var object;
        var results = [];
        var key;

        if (value === null || value === undefined) {
            throw new TypeError("Object.values called on null or undefined");
        }

        object = typeof value === "string" ? value.split("") : Object(value);
        for (key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                results.push(object[key]);
            }
        }

        return results;
    };
}
