/**
 * Finds the first element in the map that satisfies the provided testing function.
 *
 * @param {function} callback - The testing function. It is called with three arguments:
 *          the value, the key, and the map itself.
 * @param {any} thisArg - Optional. The object to use as `this` when executing the testing function.
 * @return {any} The first element in the map that satisfies the provided testing function.
 *              If no element is found, `undefined` is returned.
 * @external Map.prototype.entries
 */
Map.prototype.find = function (callback, thisArg) {
    var iterator;
    var entry;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.find: callback must be a function.");
    }

    iterator = this.entries();
    entry = iterator.next();
    while (!entry.done) {
        if (callback.call(thisArg, entry.value[1], entry.value[0], this)) {
            return entry.value[1];
        }
        entry = iterator.next();
    }

    return undefined;
};
