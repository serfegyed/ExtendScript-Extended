/**
 * Checks if the current set is a subset of the given set.
 *
 * @param {Set} other - The set to compare against.
 * @throws {TypeError} If the parameter type is not a Set.
 * @return {boolean} Returns true if the current set is a subset of the given set, otherwise false.
 */
Set.prototype.isSubsetOf = function (other) {
    var record = __getSetRecord__(other);
    var iterator;
    var item;

    if (this.size > record.size) return false;
    iterator = this.values();
    item = iterator.next();
    while (!item.done) {
        if (!record.has.call(record.object, item.value)) return false;
        item = iterator.next();
    }

    return true;
};
