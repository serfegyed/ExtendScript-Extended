/**
 * Checks if every element in the set satisfies the provided callback function.
 *
 * @param {function} callback - The callback function to test each element.
 * @param {Object} thisArg - Optional. The value to use as `this` when executing the callback.
 * @returns {boolean} Returns `true` if every element in the set satisfies the callback function, otherwise `false`.
 */
Set.prototype.every = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.every(): Missing callback function");
    var iterator = this.values();
    var currentItem = iterator.next();
    while (!currentItem.done) {
        if (!callback.call(thisArg, currentItem.value)) {
            return false;
        }
        currentItem = iterator.next();
    }
    return true;
};