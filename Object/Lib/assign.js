/**
 * Assigns enumerable properties from one or more source objects to a target object.
 *
 * @param {Object} targetObj - The object to assign the properties to.
 * @param {Object} sourceObj - The source object(s) containing the properties to assign.
 * @return {Object} - The target object with the assigned properties.
 */
if (!Object.assign) {
    Object.assign = function (targetObj /*, sourceObj1, sourceObj2, ..., sourceObjN */) {
        if (!targetObj || typeof targetObj !== 'object') {
            throw new TypeError("Target is not an Object");
        }

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            if (typeof source === 'string') {
                source = source.split('');
            }
            if (!source || typeof source !== 'object') continue;

            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    targetObj[prop] = source[prop];
                }
            }
        }

        return targetObj;
    };
};