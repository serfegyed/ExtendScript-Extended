/**
 * Returns a new set that is the union of the current set and the otherSet.
 *
 * @param {Set} otherSet - The set to be combined with the current set.
 * @throws {TypeError} If the otherSet parameter is not an instance of Set.
 * @return {Set} A new set that contains all the elements from both sets.
 */
Set.prototype.union = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.union(): wrong parameter type.");
    }
    var unionSet = new Set(this);

    return unionSet.from(otherSet);
};