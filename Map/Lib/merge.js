/**
 * Merges the current map with another map.
 *
 * @param {Map} otherMap - The map to merge with the current map.
 * @throws {TypeError} Throws a TypeError if `otherMap` is not an instance of Map.
 * @return {Map} Returns the current map after merging.
 */
Map.prototype.merge = function (otherMap) { //
    if (!(otherMap instanceof Map)) {
        throw new TypeError(otherMap + " is not a Map instance.");
    };
    for (var i = 0; i < otherMap._entries.length; i++) {
        this.set(otherMap._entries[i][0], otherMap._entries[i][1])
    };

    return this;
};