/**
 * Returns the prototype of the specified object.
 *
 * @param {Object|Function} obj - The object whose prototype is to be returned.
 * @throws {TypeError} If the object is null or not an object or function.
 * @return {Object|null} The prototype of the object, or null if it is Object.prototype.
 */
if (typeof Object.getPrototypeOf !== 'function') {
    Object.getPrototypeOf = function (obj) {
        if (obj === null || typeof obj !== 'object' && typeof obj !== 'function') {
            throw new TypeError('Object.getPrototypeOf called on non-object');
        }
        if (obj === Object.prototype) {
            return null;
        }
        return obj.__proto__ || (obj.constructor ? obj.constructor.prototype : null);
    };
};