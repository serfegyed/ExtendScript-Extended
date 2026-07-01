/**
 * Determines whether the given Map is empty.
 *
 * @param {Map} obj - The Map to check.
 * @throws {TypeError} Throws a TypeError if the parameter is not a Map.
 * @return {boolean} Returns true if the Map is empty, false otherwise.
 */
Map.isEmpty = function (obj) {
    if (!Map.isMap(obj)) {
        throw new TypeError("Map.isEmpty: value must be a Map.");
    }
    return obj.size === 0;
};
