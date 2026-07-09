/**
 * Returns an array containing the enumerable property names of an object.
 *
 * @param {object} value - The object to retrieve the property names from.
 * @return {Array} An array containing the property names of the object.
 */
if (!Object.keys) {
    Object.keys = function (value) {
        var object;
        var results = [];
        var key;

        if (value === null || value === undefined) {
            throw new TypeError("Object.keys called on null or undefined");
        }

        object = typeof value === "string" ? value.split("") : Object(value);
        for (key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                results.push(key);
            }
        }

        return results;
    };
}
