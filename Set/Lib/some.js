/**
 * Checks if any element in the Set satisfies the provided testing function.
 *
 * @param {function} callback - A function that will be called for each element in the Set.
 * @param {Object} thisArg - An optional object to use as `this` when executing the callback function.
 * @return {boolean} Returns `true` if at least one element satisfies the provided testing function, otherwise `false`.
 */
Set.prototype.some = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.some(): Missing callback function");

    for (var i = 0; i < this._data.length; i++) {
        if (callback.call(thisArg, this._data[i], i, this)) return true;
    }

    return false;
};