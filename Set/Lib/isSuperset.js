/**
 * Checks if this set is a superset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter is not a Set.
 * @return {boolean} True if this set is a superset of the given set, false otherwise.
 */
Set.prototype.isSuperset = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isSubset(): wrong parameter type.");
    }
    if (this.size() < otherSet.size()) {
        return false;
    }
    if (Set.isEmpty(otherSet)) {
        // An empty set is subset of any other sets so 'this' is a superset
        return true;
    }

    return otherSet.isSubset(this);
};