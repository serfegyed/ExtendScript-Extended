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
    var iterator = this.entries();
    var entry = iterator.next();

    while (!entry.done) {
        var key = entry.value[0];
        var value = entry.value[1];
        newMap.set(key, callback.call(thisArg, value, key, this));
        entry = iterator.next();
    }

    return newMap;
};