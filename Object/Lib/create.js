/**
 * Creates a new object with the specified prototype and properties.
 *
 * @param {Object} prototype - The prototype object.
 * @param {Object} properties - The properties to be added to the new object.
 * @return {Object} The newly created object.
 */
if (!Object.create) {
    Object.create = function (prototype, properties) {
        function F() { }
        F.prototype = prototype;
        const obj = new F();
        if (typeof properties === "object") {
            for (var prop in properties) {
                if (properties.hasOwnProperty(prop)) {
                    obj[prop] = properties[prop];
                }
            }
        }
        return obj;
    };
};