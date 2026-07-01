/**
 * Calculates the intersection of two sets.
 *
 * @param {Set} otherSet - The set to intersect with.
 * @return {Set} A new set containing the elements that are common to both sets.
 */
Set.prototype.intersection = function (otherSet) {
    var other = __getSetRecord__(otherSet);
    var result = new Set();
    var iterator;
    var item;
    var i;

    if (this.size <= other.size) {
        for (i = 0; i < this._data.length; i++) {
            if (other.has.call(other.object, this._data[i])) {
                result.add(this._data[i]);
            }
        }
    } else {
        iterator = other.keys.call(other.object);
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
