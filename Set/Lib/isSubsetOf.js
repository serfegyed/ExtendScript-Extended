/**
 * Checks if the current set is a subset of the given set.
 *
 * @param {Set} other - The set to compare against.
 * @throws {TypeError} If the parameter type is not a Set.
 * @return {boolean} Returns true if the current set is a subset of the given set, otherwise false.
 */
Set.prototype.isSubsetOf = function (other) {
    var record = __getSetRecord__(other);
    var i;

    if (this.size > record.size) return false;
    for (i = 0; i < this._data.length; i++) {
        if (!record.has.call(record.object, this._data[i])) return false;
    }

    return true;
};
