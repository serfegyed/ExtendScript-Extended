/**
 * Calculates the difference between the current set and another set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @return {Set} The set containing the elements that are in the current set but not in the other set.
 */
Set.prototype.difference = function (otherSet) {
    var other = __getSetRecord__(otherSet);
    var result = new Set(this);
    var iterator;
    var item;
    var i;

    if (this.size <= other.size) {
        for (i = 0; i < this._data.length; i++) {
            if (other.has.call(other.object, this._data[i])) {
                result.delete(this._data[i]);
            }
        }
    } else {
        iterator = other.keys.call(other.object);
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
