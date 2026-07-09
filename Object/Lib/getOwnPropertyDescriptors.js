/**
 * Returns best-effort descriptors for supported own properties.
 *
 * @param {object} value - The object to inspect.
 * @return {object} A map of own property descriptors.
 */
if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function (value) {
        var object;
        var descriptors = {};
        var names;
        var name;
        var descriptor;
        var i;

        if (value === null || value === undefined) {
            throw new TypeError("Object.getOwnPropertyDescriptors called on null or undefined");
        }

        object = Object(value);
        names = Object.getOwnPropertyNames(object);

        if (object instanceof Array) {
            names.push("length");
        } else if (typeof object === "function") {
            names.push("length");
        }

        for (i = 0; i < names.length; i++) {
            name = names[i];
            if (!Object.prototype.hasOwnProperty.call(descriptors, name)) {
                descriptor = Object.getOwnPropertyDescriptor(object, name);
                if (descriptor !== undefined) {
                    descriptors[name] = descriptor;
                }
            }
        }

        return descriptors;
    };
}
