/**
 * Calculates the symmetric difference between this set and another set.
 *
 * @param {Set} other - The set to calculate the difference with.
 * @return {Set} The set containing the elements that are in either this set or the other set, but not in both.
 */
Set.prototype.symmetricDifference = function (other) {
    var record = __getSetRecord__(other);
    var result = new Set(this);
    var iterator = record.keys.call(record.object);
    var item;

    if (!iterator || typeof iterator.next !== "function") {
        throw new TypeError("Set-like keys() must return an iterator.");
    }
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
