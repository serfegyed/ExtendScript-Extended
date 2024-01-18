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
    if (typeof callback !== "function")
        throw new TypeError("Map.find(): Missing callback function");
    var iterator = this.entries();
    var entry = iterator.next();
    while (!entry.done) {
        var key = entry.value[0];
        var value = entry.value[1];
        if (callback.call(thisArg, value, key, this)) {
            return value;
        }
        entry = iterator.next();
    }
    return undefined;
};