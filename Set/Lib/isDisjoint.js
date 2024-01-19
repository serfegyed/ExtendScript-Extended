/**
 * Checks if the current set is disjoint with another set.
 *
 * @param {Set} otherSet - The set to compare with.
 * @return {boolean} Returns true if the sets are disjoint, false otherwise.
 */
Set.prototype.isDisjoint = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isDisjoint(): wrong parameter type.");
    }

    if (Set.isEmpty(this) || Set.isEmpty(otherSet)) {
        // Two empty sets are always disjoint
        return true;
    }

    var iterator = this.values();
    var entry = iterator.next();
    while (!entry.done) {
        if (otherSet.has(entry.value)) {
            // If any element is found in both sets, they are not disjoint
            return false;
        }
        entry = iterator.next();
    }

    // If no common elements are found, they are disjoint
    return true;
};