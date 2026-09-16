/**
 * Calculates the difference between the current set and another set.
 *
 * @param {Set} other - The set to compare against.
 * @return {Set} The set containing the elements that are in the current set but not in the other set.
 */
Set.prototype.difference = function (other) {
    var record = __getSetRecord__(other);
    var result = new Set(this);
    var iterator;
    var item;

    if (this.size <= record.size) {
        iterator = result.values();
        item = iterator.next();
        while (!item.done) {
            if (record.has.call(record.object, item.value)) {
                result.delete(item.value);
            }
            item = iterator.next();
        }
    } else {
        iterator = __SetIterator__(record.keys.call(record.object));
        item = iterator.next();
        while (!item.done) {
            result.delete(item.value);
            item = iterator.next();
        }
    }

    return result;
};
