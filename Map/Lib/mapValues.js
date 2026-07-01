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
    var newMap = new Map();
    var iterator;
    var entry;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.mapValues: callback must be a function.");
    }

    iterator = this.entries();
    entry = iterator.next();
    while (!entry.done) {
        newMap.set(
            entry.value[0],
            callback.call(thisArg, entry.value[1], entry.value[0], this)
        );
        entry = iterator.next();
    }

    return newMap;
};
