/**
 * Merges the properties of the given object with the properties of the current object.
 *
 * @param {Object} obj - The object to merge with the current object.
 * @throws {TypeError} Throws a TypeError if the provided object is not an object.
 * @return {Object} Returns a new object with the merged properties.
 */
if (!Object.prototype.merge) {
    Object.prototype.merge = function (obj) {
        if (!obj || obj.__class__ !== "Object")
            throw new TypeError(obj.toString() + " is not an object");
        var thisObj = Object.deepCopy(this);
        var secondObj = Object.deepCopy(obj);
        var mergedObj = {};
        for (var prop in thisObj) {
            if (thisObj.hasOwnProperty(prop)) mergedObj[prop] = thisObj[prop];
        }
        for (var prop in secondObj) {
            if (secondObj.hasOwnProperty(prop)) mergedObj[prop] = obj[prop];
        }
        return mergedObj;
    };
};