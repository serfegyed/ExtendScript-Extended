/**
 * Finds the first element in the Set that satisfies the provided testing function.
 *
 * @param {function} callback - The testing function to call on each element.
 * @param {Object} thisArg - Object to use as `this` when executing the callback.
 * @return {*} The first element in the Set that satisfies the provided testing function, or undefined if no such element is found.
 */
Set.prototype.find = function (callback, thisArg) {
    var iterator;
    var item;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.find: callback must be a function.");
    }

    iterator = this.values();
    item = iterator.next();
    while (!item.done) {
        if (callback.call(thisArg, item.value, item.value, this)) {
            return item.value;
        }
        item = iterator.next();
    }

    return undefined;
};
