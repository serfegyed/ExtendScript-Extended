/**
 * Checks if any element in the Set satisfies the provided testing function.
 *
 * @param {function} callback - A function that will be called for each element in the Set.
 * @param {Object} thisArg - An optional object to use as `this` when executing the callback function.
 * @return {boolean} Returns `true` if at least one element satisfies the provided testing function, otherwise `false`.
 */
Set.prototype.some = function (callback, thisArg) {
    var iterator;
    var item;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.some: callback must be a function.");
    }

    iterator = this.values();
    item = iterator.next();
    while (!item.done) {
        if (callback.call(thisArg, item.value, item.value, this)) return true;
        item = iterator.next();
    }

    return false;
};
