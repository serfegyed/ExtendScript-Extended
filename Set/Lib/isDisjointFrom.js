/**
 * Checks if the current set is disjoint with another set.
 *
 * @param {Set} other - The set to compare with.
 * @return {boolean} Returns true if the sets are disjoint, false otherwise.
 */
Set.prototype.isDisjointFrom = function (other) {
    var record = __getSetRecord__(other);
    var iterator;
    var item;

    if (this.size <= record.size) {
        iterator = this.values();
        item = iterator.next();
        while (!item.done) {
            if (record.has.call(record.object, item.value)) return false;
            item = iterator.next();
        }
    } else {
        iterator = __SetIterator__(record.keys.call(record.object));
        item = iterator.next();
        while (!item.done) {
            if (this.has(item.value)) {
                iterator.close();
                return false;
            }
            item = iterator.next();
        }
    }

    return true;
};
