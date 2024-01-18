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

    var iterator = otherMap.entries();
    var entry = iterator.next();
    while (!entry.done) {
        this.set(entry.value[0], entry.value[1]);
        entry = iterator.next();
    }

    return this;
};