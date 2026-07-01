/**
 * Adds all elements from the given array to the set.
 *
 * @param {Array} argArr - The array of elements to be added to the set.
 * @return {Set} - The modified set with the added elements.
 */
Set.prototype.addAll = function (argArr) {
    if (!(argArr instanceof Array)) {
        throw new TypeError("Set.prototype.addAll: values must be an array.");
    }
    for (var i = 0; i < argArr.length; i++) {
        this.add(argArr[i]);
    }
    return this;
};
