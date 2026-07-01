/**
 * Checks if this set is a superset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter is not a Set.
 * @return {boolean} True if this set is a superset of the given set, false otherwise.
 */
Set.prototype.isSupersetOf = function (otherSet) {
    var other = __getSetRecord__(otherSet);
    var iterator;
    var item;

    if (this.size < other.size) return false;
    iterator = other.keys.call(other.object);
    if (!iterator || typeof iterator.next !== "function") {
        throw new TypeError("Set-like keys() must return an iterator.");
    }
    item = iterator.next();
    while (!item.done) {
        if (!this.has(item.value)) return false;
        item = iterator.next();
    }
    return true;
};
