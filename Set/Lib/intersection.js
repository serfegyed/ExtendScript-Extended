/**
 * Calculates the intersection of two sets.
 *
 * @param {Set} other - The set to intersect with.
 * @return {Set} A new set containing the elements that are common to both sets.
 */
Set.prototype.intersection = function (other) {
    var record = __getSetRecord__(other);
    var result = new Set();
    var iterator;
    var item;

    if (this.size <= record.size) {
        iterator = this.values();
        item = iterator.next();
        while (!item.done) {
            if (record.has.call(record.object, item.value)) {
                result.add(item.value);
            }
            item = iterator.next();
        }
    } else {
        iterator = __SetIterator__(record.keys.call(record.object));
        item = iterator.next();
        while (!item.done) {
            if (this.has(item.value)) result.add(item.value);
            item = iterator.next();
        }
    }

    return result;
};
