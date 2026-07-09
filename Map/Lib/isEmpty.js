/**
 * Determines whether the given Map is empty.
 *
 * @param {Map} value - The Map to check.
 * @throws {TypeError} Throws a TypeError if the parameter is not a Map.
 * @return {boolean} Returns true if the Map is empty, false otherwise.
 */
Map.isEmpty = function (value) {
    if (!Map.isMap(value)) {
        throw new TypeError("Map.isEmpty: value must be a Map.");
    }
    return value.size === 0;
};
