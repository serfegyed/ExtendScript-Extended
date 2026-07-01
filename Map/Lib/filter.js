/**
 * Filters the elements of a Map object based on a provided callback function.
 *
 * @param {function} callback - The callback function used to test each element of the Map.
 *          It should return true to keep the element, or false otherwise.
 * @param {Object} thisArg - Optional. The value to use as `this` when executing the callback function.
 * @return {Map} A new Map object containing the key-value pairs that passed the test
 *          implemented by the callback function.
 * @external Map.prototype.entries
 */
Map.prototype.filter = function (callback, thisArg) {
    var filteredMap = new Map();
    var iterator;
    var entry;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.filter: callback must be a function.");
    }

    iterator = this.entries();
    entry = iterator.next();
    while (!entry.done) {
        if (callback.call(thisArg, entry.value[1], entry.value[0], this)) {
            filteredMap.set(entry.value[0], entry.value[1]);
        }
        entry = iterator.next();
    }

    return filteredMap;
};
