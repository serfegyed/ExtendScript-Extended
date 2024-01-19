/**
 * Calculates the symmetric difference between this set and another set.
 *
 * @param {Set} otherSet - The set to calculate the difference with.
 * @return {Set} The set containing the elements that are in either this set or the other set, but not in both.
 */
Set.prototype.symmetricDifference = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.symmetricDifference(): wrong parameter type.");
    }

    var diffSet1 = this.difference(otherSet);
    var diffSet2 = otherSet.difference(this);

    return diffSet1.from(diffSet2);
};