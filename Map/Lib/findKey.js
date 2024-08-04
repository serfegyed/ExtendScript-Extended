/**
 * Find the key that satisfies the given condition in the map.
 *
 * @param {function} callback - The condition function to be satisfied by the value, key, and map.
 * @param {object} thisArg - The value to use as "this" when executing the condition function.
 * @return {any} The key that satisfies the condition, or undefined if no key is found.
 * @external Map.prototype.entries
 */
Map.prototype.findKey = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Map.findKey(): Missing callback function");

    for (var i = 0; i < this._entries.length; i++) {
        if (callback.call(thisArg, this._entries[i][1], this._entries[i][0], this)) {
            return this._entries[i][0];
        }
    };

    return undefined;
};