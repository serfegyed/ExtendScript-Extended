/**
 * Returns the prototype of the specified object.
 *
 * @param {Object|Function} value - The object whose prototype is to be returned.
 * @throws {TypeError} If the object is null or not an object or function.
 * @return {Object|null} The prototype of the object, or null if it is Object.prototype.
 */
if (typeof Object.getPrototypeOf !== 'function') {
    Object.getPrototypeOf = function (value) {
        if (value === null || typeof value !== 'object' && typeof value !== 'function') {
            throw new TypeError('Object.getPrototypeOf called on non-object');
        }
        if (value === Object.prototype) {
            return null;
        }
        return value.__proto__ || (value.constructor ? value.constructor.prototype : null);
    };
};
