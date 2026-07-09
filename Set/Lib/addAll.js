/**
 * Adds all elements from the given array to the set.
 *
 * @param {Array} values - The array of elements to be added to the set.
 * @return {Set} - The modified set with the added elements.
 */
Set.prototype.addAll = function (values) {
    if (!(values instanceof Array)) {
        throw new TypeError("Set.prototype.addAll: values must be an array.");
    }
    for (var i = 0; i < values.length; i++) {
        this.add(values[i]);
    }
    return this;
};
