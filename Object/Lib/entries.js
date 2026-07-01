/**
 * Returns an array of key-value pairs representing the properties of an object.
 *
 * @param {Object} obj - The object to extract the properties from.
 * @return {Array} An array of key-value pairs representing the properties of the object.
 */
if (!Object.entries) {
    Object.entries = function (value) {
        var object;
        var results = [];
        var key;

        if (value === null || value === undefined) {
            throw new TypeError("Object.entries called on null or undefined");
        }

        object = typeof value === "string" ? value.split("") : Object(value);
        for (key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                results.push([key, object[key]]);
            }
        }

        return results;
    };
}
