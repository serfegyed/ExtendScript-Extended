/**
 * Checks if the current set is a subset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter type is not a Set.
 * @return {boolean} Returns true if the current set is a subset of the given set, otherwise false.
 */
Set.prototype.isSubset = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isSubset(): wrong parameter type.");
    }
    if (this.size() > otherSet.size()) {
        return false;
    }
    if (Set.isEmpty(this)) {
        // An empty set is subset of any other sets
        return true;
    }

    var iterator = this.values();
    var entry = iterator.next();
    while (!entry.done) {
        if (!otherSet.has(entry.value)) {
            // If any element isn't found in both sets, 'this' is not a subset
            return false;
        }
        entry = iterator.next();
    }

    return true;
};