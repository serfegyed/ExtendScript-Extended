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
    if (typeof callback !== "function")
        throw new TypeError("Map.filter(): Missing callback function");
    var filteredMap = new Map();
    var iterator = this.entries();
    var entry = iterator.next();

    while (!entry.done) {
        var key = entry.value[0];
        var value = entry.value[1];

        if (callback.call(thisArg, value, key, this)) {
            filteredMap.set(key, value);
        }
        entry = iterator.next();
    }

    return filteredMap;
};