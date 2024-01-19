/**
 * Filters the elements of the set based on the provided callback function.
 *
 * @param {function} callback - The function used to filter the elements. It should accept a single parameter and return a boolean value.
 * @param {Object} thisArg - The value to use as `this` when executing the callback function.
 * @return {Set} A new Set object containing only the elements for which the callback function returns true.
 */
Set.prototype.filter = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.filter(): Missing callback function");
    var filteredSet = new Set();
    var iterator = this.values();
    var entry = iterator.next();

    while (!entry.done) {
        if (callback.call(thisArg, entry.value)) {
            filteredSet.add(entry.value);
        }
        entry = iterator.next();
    }

    return filteredSet;
};