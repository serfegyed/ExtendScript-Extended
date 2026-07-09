/**
 * Merges the properties of the given object with the properties of the current object.
 *
 * @param {Object} object - The object to merge with the current object.
 * @throws {TypeError} Throws a TypeError if the provided object is not an object.
 * @return {Object} Returns a new object with the merged properties.
 * @dependency Object.deepCopy()
 */
if (!Object.prototype.merge) {
    Object.prototype.merge = function (object) {
        var thisObject;
        var secondObject;
        var result = {};
        var property;

        if (object === null || typeof object !== "object") {
            throw new TypeError("Object.merge: argument must be an object.");
        }

        thisObject = Object.deepCopy(this);
        secondObject = Object.deepCopy(object);

        for (property in thisObject) {
            if (Object.prototype.hasOwnProperty.call(thisObject, property)) {
                result[property] = thisObject[property];
            }
        }
        for (property in secondObject) {
            if (Object.prototype.hasOwnProperty.call(secondObject, property)) {
                result[property] = secondObject[property];
            }
        }
        return result;
    };
}
