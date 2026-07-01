/**
 * Checks if the current set is disjoint with another set.
 *
 * @param {Set} otherSet - The set to compare with.
 * @return {boolean} Returns true if the sets are disjoint, false otherwise.
 */
Set.prototype.isDisjointFrom = function (otherSet) {
    var other = __getSetRecord__(otherSet);
    var iterator;
    var item;
    var i;

    if (this.size <= other.size) {
        for (i = 0; i < this._data.length; i++) {
            if (other.has.call(other.object, this._data[i])) return false;
        }
    } else {
        iterator = other.keys.call(other.object);
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
