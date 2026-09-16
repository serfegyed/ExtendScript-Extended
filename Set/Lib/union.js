/**
 * Returns a new set that is the union of the current set and the other set.
 *
 * @param {Object} other - The Set-like object to combine with this Set.
 * @return {Set} A new set that contains all the elements from both sets.
 */
Set.prototype.union = function (other) {
    var record = __getSetRecord__(other);
    var result = new Set(this);
    var iterator = __SetIterator__(record.keys.call(record.object));
    var item;

    item = iterator.next();
    while (!item.done) {
        result.add(item.value);
        item = iterator.next();
    }
    return result;
};
