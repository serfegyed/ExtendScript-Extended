/**
 * Returns the enumerable own property names visible to ExtendScript.
 * Non-enumerable properties cannot be discovered through ES3 `for...in`.
 *
 * @param {object} value - The object to retrieve the property names from.
 * @return {array} An array of property names.
 */
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function (value) {
        var object;
        var propertyNames = [];
        var property;

        if (value === null || value === undefined) {
            throw new TypeError("Object.getOwnPropertyNames called on null or undefined");
        }

        object = typeof value === "string" ? value.split("") : Object(value);
        for (property in object) {
            if (Object.prototype.hasOwnProperty.call(object, property)) {
                propertyNames.push(property);
            }
        }

        return propertyNames;
    };
}
