/**
 * Assigns enumerable properties from one or more source objects to a target object.
 *
 * @param {Object} targetObj - The object to assign the properties to.
 * @param {Object} sourceObj - The source object(s) containing the properties to assign.
 * @return {Object} - The target object with the assigned properties.
 */
if (!Object.assign) {
    Object.assign = function (targetObj, sourceObj /*, sourceObj2, sourceObjN*/) {
        if (!targetObj || targetObj.__class__ !== "Object")
            throw new TypeError("Target is not an Object");
        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i].__class__ !== "Object")
                throw new TypeError(arguments[i].toString() + " is not an object");
        }
        for (var j = 1; j < arguments.length; j++) {
            for (var prop in arguments[j]) {
                if (arguments[j].hasOwnProperty(prop)) {
                    targetObj[prop] = arguments[j][prop];
                }
            }
        }

        return targetObj;
    };
};