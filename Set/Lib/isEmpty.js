/**
 * Determines whether the given parameter is an empty Set.
 *
 * @param {Set} set - The Set to check.
 * @throws {TypeError} Throws a TypeError if the parameter is not a Set.
 * @return {boolean} Returns true if the Set is empty, false otherwise.
 */
Set.isEmpty = function (set) {
    if (!set instanceof Set) throw new TypeError(set.toString() + " is not a Set");
    return set.size() === 0;
};