/**
 * Returns an array of all properties (including non-enumerable properties) 
 * found directly on a given object.
 *
 * @param {object} obj - The object to retrieve the property names from.
 * @return {array} An array of property names.
 */
if (!Object.getOwnPropertyNames) { // ChatGPT version
    Object.getOwnPropertyNames = function (obj) {
        if (obj !== Object(obj)) {
            throw new TypeError('Object.getOwnPropertyNames: called on non-object');
        }

        var propNames = [];
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                propNames.push(prop);
            }
        }
        return propNames;
    };
};