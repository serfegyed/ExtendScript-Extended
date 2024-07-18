/**
 * Calculates the intersection of two sets.
 *
 * @param {Set} otherSet - The set to intersect with.
 * @return {Set} A new set containing the elements that are common to both sets.
 */
Set.prototype.intersection = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.intersection(): wrong parameter type.");
    }

    var intersectionSet = new Set();
    for (var i = 0; i < this._data.length; i++) {
        if (otherSet.has(this._data[i])) {
            intersectionSet.add(this._data[i]);
        }
    };

    return intersectionSet;
};