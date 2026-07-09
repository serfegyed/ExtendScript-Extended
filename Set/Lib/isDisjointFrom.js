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
    var i;

    if (this.size <= record.size) {
        for (i = 0; i < this._data.length; i++) {
            if (record.has.call(record.object, this._data[i])) return false;
        }
    } else {
        iterator = record.keys.call(record.object);
        if (!iterator || typeof iterator.next !== "function") {
            throw new TypeError("Set-like keys() must return an iterator.");
        }
        item = iterator.next();
        while (!item.done) {
            if (this.has(item.value)) return false;
            item = iterator.next();
        }
    }

    return true;
};
