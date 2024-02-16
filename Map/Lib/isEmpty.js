/**
 * Determines whether the given object is an empty Set.
 *
 * @param {Map} obj - The Map to check.
 * @throws {TypeError} Throws a TypeError if the parameter is not a Map.
 * @return {boolean} Returns true if the Map is empty, false otherwise.
 */
Map.isEmpty = function (obj) {
    if (!Map.isMap(obj)) throw new TypeError(obj.toString() + " is not a Map");
    return obj.size() === 0;
};