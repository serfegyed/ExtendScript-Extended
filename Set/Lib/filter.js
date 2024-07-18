/**
 * Filters the elements of the set based on the provided callback function.
 *
 * @param {function} callback - The function used to filter the elements. It should accept a single parameter and return a boolean value.
 * @param {Object} thisArg - The value to use as `this` when executing the callback function.
 * @return {Set} A new Set object containing only the elements for which the callback function returns true.
 */
Set.prototype.filter = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.filter(): Missing callback function");
    var filteredSet = new Set();

    for (var i = 0; i < this._data.length; i++) {
        if (callback.call(thisArg, this._data[i])) {
            filteredSet.add(this._data[i]);
        };
    }

    return filteredSet;
};