/**
 * Executes the provided callback function once for each key-value pair in the Map object.
 *
 * @param {Function} callback - Function to execute for each element.
 * @param {Object} [thisArg] - Value to use as this when executing callback.
 * @return {boolean} Returns true if the callback function returns a truthy value for at least one key-value pair, otherwise false.
 * @external Map.prototype.entries
 */
Map.prototype.some = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Map.some(): Missing callback function");

    for (var i = 0; i < this._entries.length; i++) {
        if (callback.call(thisArg, this._entries[i][1], this._entries[i][0], this)) {
            return true;
        }
    };

    return false;
};