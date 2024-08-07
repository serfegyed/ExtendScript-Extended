/**
 * Maps each value of the Map object using a callback function.
 *
 * @param {Function} callback - The function to map each value. It accepts three arguments: value, key, and the Map object.
 * @param {Object} [thisArg] - An optional object to which the this keyword can refer inside the callback function.
 * @throws {TypeError} If the callback parameter is not a function.
 * @return {Map} A new Map object with the mapped values.
 * @external Map.prototype.entries
 */
Map.prototype.mapValues = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Map.mapValues(): Missing callback function");
    var newMap = new Map();

    for (var i = 0; i < this._entries.length; i++) {
        newMap.set(this._entries[i][0], callback.call(thisArg, this._entries[i][1], this._entries[i][0], this));
    };

    return newMap;
};