/**
 * Maps the keys of the map using a callback function.
 *
 * @param {function} callback - The callback function to apply to each key-value pair. The callback function takes three arguments: key, value, and the original map.
 * @param {Object} thisArg - An optional object to which the `this` keyword can refer inside the callback function.
 * @return {Map} - A new map with the updated keys.
 * @external Map.prototype.entries
 */
Map.prototype.mapKeys = function (callback, thisArg) {
    var newMap = new Map();
    var iterator;
    var entry;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.mapKeys: callback must be a function.");
    }

    iterator = this.entries();
    entry = iterator.next();
    while (!entry.done) {
        newMap.set(
            callback.call(thisArg, entry.value[0], entry.value[1], this),
            entry.value[1]
        );
        entry = iterator.next();
    }

    return newMap;
};
