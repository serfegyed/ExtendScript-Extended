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
    var i;

    if (this.size <= record.size) {
        for (i = 0; i < this._data.length; i++) {
            if (record.has.call(record.object, this._data[i])) {
                result.add(this._data[i]);
            }
        }
    } else {
        iterator = record.keys.call(record.object);
        if (!iterator || typeof iterator.next !== "function") {
            throw new TypeError("Set-like keys() must return an iterator.");
        }
        item = iterator.next();
        while (!item.done) {
            if (this.has(item.value)) result.add(item.value);
            item = iterator.next();
        }
    }

    return result;
};
