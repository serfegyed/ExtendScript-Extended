/**
 * Returns a new set that is the union of the current set and the otherSet.
 *
 * @param {Object} otherSet - The Set-like object to combine with this Set.
 * @return {Set} A new set that contains all the elements from both sets.
 */
Set.prototype.union = function (otherSet) {
    var other = __getSetRecord__(otherSet);
    var result = new Set(this);
    var iterator = other.keys.call(other.object);
    var item;

    if (!iterator || typeof iterator.next !== "function") {
        throw new TypeError("Set-like keys() must return an iterator.");
    }
    item = iterator.next();
    while (!item.done) {
        result.add(item.value);
        item = iterator.next();
    }
    return result;
};
