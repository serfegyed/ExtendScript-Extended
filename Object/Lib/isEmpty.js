/**
 * Checks if an object is empty.
 *
 * @param {Object} obj - The object to check.
 * @return {boolean} Returns true if the object is empty, false otherwise.
 */
if (!Object.isEmpty) {
    Object.isEmpty = function (obj) {
        if (obj.__class__ !== "Object") throw new TypeError(obj.toString() + " is not an Object");
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    };
};