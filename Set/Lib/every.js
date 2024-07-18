/**
 * Checks if every element in the set satisfies the provided callback function.
 *
 * @param {function} callback - The callback function to test each element.
 * @param {Object} thisArg - Optional. The value to use as `this` when executing the callback.
 * @returns {boolean} Returns `true` if every element in the set satisfies the callback function, otherwise `false`.
 */
Set.prototype.every = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.every(): Missing callback function");

    for (var i = 0; i < this._data.length; i++) {
        if (!callback.call(thisArg, this._data[i], i, this)) return false;
    }

    return true;
};