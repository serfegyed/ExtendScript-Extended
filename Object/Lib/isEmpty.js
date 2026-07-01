/**
 * Checks if an object is empty.
 *
 * @param {Object} obj - The object to check.
 * @return {boolean} Returns true if the object is empty, false otherwise.
 */
if (!Object.isEmpty) {
    Object.isEmpty = function (obj) {
        if ((typeof obj !== "object" || obj === null) && typeof obj !== "function") {
            throw new TypeError("Object.isEmpty: value must be an object.");
        }
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    };
}
