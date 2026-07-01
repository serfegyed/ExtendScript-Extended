/**
 * Assigns enumerable properties from one or more source objects to a target object.
 *
 * @param {Object} targetObj - The object to assign the properties to.
 * @param {Object} sourceObj - The source object(s) containing the properties to assign.
 * @return {Object} - The target object with the assigned properties.
 */
if (!Object.assign) {
    Object.assign = function (target /*, source1, source2, ..., sourceN */) {
        var targetObject;
        var source;
        var property;
        var i;

        if (target === null || target === undefined) {
            throw new TypeError("Object.assign target is null or undefined");
        }

        targetObject = Object(target);
        for (i = 1; i < arguments.length; i++) {
            source = arguments[i];

            if (source === null || source === undefined) {
                continue;
            }
            source = typeof source === "string" ? source.split("") : Object(source);
            for (property in source) {
                if (Object.prototype.hasOwnProperty.call(source, property)) {
                    targetObject[property] = source[property];
                }
            }
        }

        return targetObject;
    };
}
