/**
 * Determines whether the given parameter is an empty Set.
 *
 * @param {Set} value - The Set to check.
 * @throws {TypeError} Throws a TypeError if the parameter is not a Set.
 * @return {boolean} Returns true if the Set is empty, false otherwise.
 */
Set.isEmpty = function (value) {
    if (!Set.isSet(value)) {
        throw new TypeError("Set.isEmpty: value must be a Set.");
    }
    return value.size === 0;
};
