/**
 * Checks if an object is empty.
 *
 * @param {Object} obj - The object to check.
 * @return {boolean} Returns true if the object is empty, false otherwise.
 */
if (!Object.isEmpty) {
    Object.isEmpty = function (obj) {
        if (!(typeof obj === 'object' && obj !== null)) throw new TypeError(obj.toString() + " is not an Object");
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    };
};