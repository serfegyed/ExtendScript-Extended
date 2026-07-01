/**
 * Filters the elements of the set based on the provided callback function.
 *
 * @param {function} callback - The function used to filter the elements. It should accept a single parameter and return a boolean value.
 * @param {Object} thisArg - The value to use as `this` when executing the callback function.
 * @return {Set} A new Set object containing only the elements for which the callback function returns true.
 */
Set.prototype.filter = function (callback, thisArg) {
    var filteredSet = new Set();
    var iterator;
    var item;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.filter: callback must be a function.");
    }

    iterator = this.values();
    item = iterator.next();
    while (!item.done) {
        if (callback.call(thisArg, item.value, item.value, this)) {
            filteredSet.add(item.value);
        }
        item = iterator.next();
    }

    return filteredSet;
};
