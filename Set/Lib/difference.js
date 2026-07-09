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
    var i;

    if (this.size <= record.size) {
        for (i = 0; i < this._data.length; i++) {
            if (record.has.call(record.object, this._data[i])) {
                result.delete(this._data[i]);
            }
        }
    } else {
        iterator = record.keys.call(record.object);
        if (!iterator || typeof iterator.next !== "function") {
            throw new TypeError("Set-like keys() must return an iterator.");
        }
        item = iterator.next();
        while (!item.done) {
            result.delete(item.value);
            item = iterator.next();
        }
    }

    return result;
};
