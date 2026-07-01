/**
 * Checks if the current set is a subset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter type is not a Set.
 * @return {boolean} Returns true if the current set is a subset of the given set, otherwise false.
 */
Set.prototype.isSubsetOf = function (otherSet) {
    var other = __getSetRecord__(otherSet);
    var i;

    if (this.size > other.size) return false;
    for (i = 0; i < this._data.length; i++) {
        if (!other.has.call(other.object, this._data[i])) return false;
    }

    return true;
};
