/**
 * Deletes each key-value pair from the map for which the callback function returns true.
 *
 * @param {function} callback - The callback function to execute on each key-value pair. The function should return true to delete the pair, or false to keep it.
 * @param {any} thisArg - Optional. The value to use as `this` when executing the callback function.
 * @return {Map} - The Map object after deleting the key-value pairs.
 */
Map.prototype.deleteEach = function (callback, thisArg) {
    var iterator;
    var entry;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.deleteEach: callback must be a function.");
    }

    iterator = this.entries();
    entry = iterator.next();
    while (!entry.done) {
        if (callback.call(thisArg, entry.value[1], entry.value[0], this)) {
            this.delete(entry.value[0]);
        }
        entry = iterator.next();
    }

    return this;
};
