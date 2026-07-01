/**
 * Checks if every element in the set satisfies the provided callback function.
 *
 * @param {function} callback - The callback function to test each element.
 * @param {Object} thisArg - Optional. The value to use as `this` when executing the callback.
 * @returns {boolean} Returns `true` if every element in the set satisfies the callback function, otherwise `false`.
 */
Set.prototype.every = function (callback, thisArg) {
    var iterator;
    var item;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.every: callback must be a function.");
    }

    iterator = this.values();
    item = iterator.next();
    while (!item.done) {
        if (!callback.call(thisArg, item.value, item.value, this)) return false;
        item = iterator.next();
    }

    return true;
};
