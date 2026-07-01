/**
 * Adds each element from the given array to the set, based on the result of the callback function.
 *
 * @param {Array} argArr - The array of elements to add to the set.
 * @param {Function} callback - The callback function that determines whether each element should be added to the set. It should return a boolean value.
 * @param {Object} thisArg - Optional. The value to use as "this" when executing the callback function.
 * @throws {TypeError} If the callback is not a function.
 * @return {Set} The modified set.
 */
Set.prototype.addEach = function (argArr, callback, thisArg) {
    if (!(argArr instanceof Array)) {
        throw new TypeError("Set.prototype.addEach: values must be an array.");
    }
    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.addEach: callback must be a function.");
    }

    for (var i = 0; i < argArr.length; i++) {
        if (callback.call(thisArg, argArr[i], i, this)) {
            this.add(argArr[i]);
        }
    }
    return this;
};
