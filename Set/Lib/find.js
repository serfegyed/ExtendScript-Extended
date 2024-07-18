/**
 * Finds the first element in the Set that satisfies the provided testing function.
 *
 * @param {function} callback - The testing function to call on each element.
 * @param {Object} thisArg - Object to use as `this` when executing the callback.
 * @return {*} The first element in the Set that satisfies the provided testing function, or undefined if no such element is found.
 */
Set.prototype.find = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.find(): Missing callback function");

    for (var i = 0; i < this._data.length; i++) {
        if (callback.call(thisArg, this._data[i])) {
            return this._data[i];
        };
    }

    return undefined;
};