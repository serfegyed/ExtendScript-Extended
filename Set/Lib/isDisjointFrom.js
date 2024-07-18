/**
 * Checks if the current set is disjoint with another set.
 *
 * @param {Set} otherSet - The set to compare with.
 * @return {boolean} Returns true if the sets are disjoint, false otherwise.
 */
Set.prototype.isDisjointFrom = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isDisjointFrom(): wrong parameter type.");
    }

    if (Set.isEmpty(this) || Set.isEmpty(otherSet)) {
        // Two empty sets are always disjoint
        return true;
    }

    for (var i = 0; i < this._data.length; i++) {
        if (otherSet.has(this._data[i])) {
            // If any element isn't found in both sets, 'this' is not a subset
            return false;
        }
    };

    // If no common elements are found, they are disjoint
    return true;
};