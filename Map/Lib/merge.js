/**
 * Merges the current map with another map.
 *
 * @param {Map} otherMap - The map to merge with the current map.
 * @throws {TypeError} Throws a TypeError if `otherMap` is not an instance of Map.
 * @return {Map} Returns the current map after merging.
 */
Map.prototype.merge = function (otherMap) {
    var i;
    var entry;

    if (!(otherMap instanceof Map)) {
        throw new TypeError("Map.prototype.merge: value must be a Map.");
    }

    for (i = 0; i < otherMap._entries.length; i++) {
        entry = otherMap._entries[i];
        this.set(entry[0], entry[1]);
    }

    return this;
};
