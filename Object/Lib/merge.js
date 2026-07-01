/**
 * Merges the properties of the given object with the properties of the current object.
 *
 * @param {Object} obj - The object to merge with the current object.
 * @throws {TypeError} Throws a TypeError if the provided object is not an object.
 * @return {Object} Returns a new object with the merged properties.
 * @dependency Object.deepCopy()
 */
if (!Object.prototype.merge) {
    Object.prototype.merge = function (obj) {
        var thisObj;
        var secondObj;
        var mergedObj = {};
        var prop;

        if (obj === null || typeof obj !== "object") {
            throw new TypeError("Object.merge: argument must be an object.");
        }

        thisObj = Object.deepCopy(this);
        secondObj = Object.deepCopy(obj);

        for (prop in thisObj) {
            if (Object.prototype.hasOwnProperty.call(thisObj, prop)) {
                mergedObj[prop] = thisObj[prop];
            }
        }
        for (prop in secondObj) {
            if (Object.prototype.hasOwnProperty.call(secondObj, prop)) {
                mergedObj[prop] = secondObj[prop];
            }
        }
        return mergedObj;
    };
}
