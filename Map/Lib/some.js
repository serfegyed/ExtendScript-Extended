/**
 * Executes the provided callback function once for each key-value pair in the Map object.
 *
 * @param {Function} callback - Function to execute for each element.
 * @param {Object} [thisArg] - Value to use as this when executing callback.
 * @return {boolean} Returns true if the callback function returns a truthy value for at least one key-value pair, otherwise false.
 * @external Map.prototype.entries
 */
Map.prototype.some = function (callback, thisArg) {
    var iterator;
    var entry;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.some: callback must be a function.");
    }

    iterator = this.entries();
    entry = iterator.next();
    while (!entry.done) {
        if (callback.call(thisArg, entry.value[1], entry.value[0], this)) {
            return true;
        }
        entry = iterator.next();
    }

    return false;
};
