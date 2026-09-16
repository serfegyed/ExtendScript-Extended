/**
 * Calculates the symmetric difference between this set and another set.
 *
 * @param {Set} other - The set to calculate the difference with.
 * @return {Set} The set containing the elements that are in either this set or the other set, but not in both.
 */
Set.prototype.symmetricDifference = function (other) {
    var record = __getSetRecord__(other);
    var result = new Set(this);
    var iterator = __SetIterator__(record.keys.call(record.object));
    var item;

    item = iterator.next();
    while (!item.done) {
        if (this.has(item.value)) {
            result.delete(item.value);
        } else {
            result.add(item.value);
        }
        item = iterator.next();
    }

    return result;
};
