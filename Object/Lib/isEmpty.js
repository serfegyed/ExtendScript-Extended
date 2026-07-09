/**
 * Checks if an object is empty.
 *
 * @param {Object} object - The object to check.
 * @return {boolean} Returns true if the object is empty, false otherwise.
 */
if (!Object.isEmpty) {
    Object.isEmpty = function (object) {
        if ((typeof object !== "object" || object === null) && typeof object !== "function") {
            throw new TypeError("Object.isEmpty: value must be an object.");
        }
        for (var key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) return false;
        }
        return true;
    };
}
