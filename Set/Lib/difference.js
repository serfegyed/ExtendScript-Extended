/**
 * Calculates the difference between the current set and another set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @return {Set} The set containing the elements that are in the current set but not in the other set.
 */
Set.prototype.difference = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.difference(): wrong parameter type.");
    }
    var originalData = this.toArray();
    // Make a copy to avoid modification during iteration
    var diffSet = new Set(originalData);

    for (var i = 0; i < originalData.length; i++) {
        if (otherSet.has(originalData[i])) {
            diffSet.delete(originalData[i]);
        }
    };

    return diffSet;
};