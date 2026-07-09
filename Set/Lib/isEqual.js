/**
 * Checks if the current set is equal to another set.
 *
 * @param {Set} other - The set to compare against.
 * @throws {TypeError} If the parameter is not a set.
 * @return {boolean} Returns true if the sets are equal, false otherwise.
 */
Set.prototype.isEqual = function (other) {
    if (!Set.isSet(other)) {
        throw new TypeError("Set.prototype.isEqual: value must be a Set.");
    }
    if (this.size !== other.size) {
        return false;
    }

    for (var i = 0; i < this._data.length; i++) {
        if (!other.has(this._data[i])) {
            return false;
        }
    }

    return true;
};
