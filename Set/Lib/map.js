/**
 * Maps each element of the Set to a new value using a provided callback function.
 *
 * @param {Function} callback - The callback function to apply to each element of the Set. It should accept the current element as its argument and return the new value.
 * @param {*} thisArg - Optional. The value to use as `this` when executing the callback function.
 * @throws {TypeError} If the `callback` parameter is not a function.
 * @returns {Set} A new Set with the mapped values.
 */
Set.prototype.map = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.map(): Missing callback function");
    var newSet = new Set();

    for (var i = 0; i < this._data.length; i++) {
        newSet.add(callback.call(thisArg, this._data[i]));
    }

    return newSet;
};