/**
 * Checks if the current set is equal to another set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter is not a set.
 * @return {boolean} Returns true if the sets are equal, false otherwise.
 */
Set.prototype.isEqual = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isEqual(): wrong parameter type.");
    }
    if (this.size() !== otherSet.size()) {
        return false;
    }

    for (var value in this._data) {
        if (!otherSet.has(value)) {
            return false;
        }
    }

    return true;
};