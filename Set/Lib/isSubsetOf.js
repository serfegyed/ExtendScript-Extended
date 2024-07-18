/**
 * Checks if the current set is a subset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter type is not a Set.
 * @return {boolean} Returns true if the current set is a subset of the given set, otherwise false.
 */
Set.prototype.isSubsetOf = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isSubsetOf(): wrong parameter type.");
    }
    if (this.size > otherSet.size) {
        return false;
    }
    if (Set.isEmpty(this)) {
        // An empty set is subset of any other sets
        return true;
    }

    for (var i = 0; i < this._data.length; i++) {
        if (!otherSet.has(this._data[i])) {
            // If any element isn't found in both sets, 'this' is not a subset
            return false;
        }
    };

    return true;
};