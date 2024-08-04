/**
 * Maps the keys of the map using a callback function.
 *
 * @param {function} callback - The callback function to apply to each key-value pair. The callback function takes three arguments: key, value, and the original map.
 * @param {Object} thisArg - An optional object to which the `this` keyword can refer inside the callback function.
 * @return {Map} - A new map with the updated keys.
 * @external Map.prototype.entries
 */
Map.prototype.mapKeys = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Map.mapKeys(): Missing callback function");
    var newMap = new Map();

    for (var i = 0; i < this._entries.length; i++) {
        newMap.set(callback.call(thisArg, this._entries[i][0], this._entries[i][1], this), this._entries[i][1]);
    };

    return newMap;
};