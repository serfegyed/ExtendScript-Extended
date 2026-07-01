/**
 * Find the key that satisfies the given condition in the map.
 *
 * @param {function} callback - The condition function to be satisfied by the value, key, and map.
 * @param {object} thisArg - The value to use as "this" when executing the condition function.
 * @return {any} The key that satisfies the condition, or undefined if no key is found.
 * @external Map.prototype.entries
 */
Map.prototype.findKey = function (callback, thisArg) {
    var iterator;
    var entry;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.findKey: callback must be a function.");
    }

    iterator = this.entries();
    entry = iterator.next();
    while (!entry.done) {
        if (callback.call(thisArg, entry.value[1], entry.value[0], this)) {
            return entry.value[0];
        }
        entry = iterator.next();
    }

    return undefined;
};
