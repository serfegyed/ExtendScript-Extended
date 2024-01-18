/**
 * Find the key that satisfies the given condition in the map.
 *
 * @param {function} callback - The condition function to be satisfied by the value, key, and map.
 * @param {object} thisArg - The value to use as "this" when executing the condition function.
 * @return {any} The key that satisfies the condition, or undefined if no key is found.
 * @external Map.prototype.entries
 */
Map.prototype.findKey = function (fn, thisArg) {
    var iterator = this.entries();
    var entry = iterator.next();
    while (!entry.done) {
        var key = entry.value[0];
        var value = entry.value[1];
        if (fn.call(thisArg, value, key, this)) {
            return key;
        }
        entry = iterator.next();
    }
    return undefined;
};