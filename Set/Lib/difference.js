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
    var diffSet = new Set(this);

    var iterator = diffSet.values();
    var result = iterator.next();

    while (!result.done) {
        if (otherSet.has(result.value)) {
            diffSet.delete(result.value);
        }
        result = iterator.next();
    }

    return diffSet;
};