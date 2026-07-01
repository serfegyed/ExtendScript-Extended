/**
 * Maps each element of the Set to a new value using a provided callback function.
 *
 * @param {Function} callback - The callback function to apply to each element of the Set. It should accept the current element as its argument and return the new value.
 * @param {*} thisArg - Optional. The value to use as `this` when executing the callback function.
 * @throws {TypeError} If the `callback` parameter is not a function.
 * @returns {Set} A new Set with the mapped values.
 */
Set.prototype.map = function (callback, thisArg) {
    var newSet = new Set();
    var iterator;
    var item;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.map: callback must be a function.");
    }

    iterator = this.values();
    item = iterator.next();
    while (!item.done) {
        newSet.add(callback.call(thisArg, item.value, item.value, this));
        item = iterator.next();
    }

    return newSet;
};
