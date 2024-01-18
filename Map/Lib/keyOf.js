/**
 * Returns the first key associated with the specified search element in the map.
 *
 * @param {any} searchElement - The element to search for in the map.
 * @return {any} The key associated with the search element, or undefined if the element is not found.
 * @external Map.prototype.entries, sameValueZero()
 */
Map.prototype.keyOf = function (searchElement) {
    var iterator = this.entries();
    var entry = iterator.next();

    while (!entry.done) {
        var key = entry.value[0];
        var value = entry.value[1];
        if (sameValueZero(value, searchElement)) {
            return key;
        }
        entry = iterator.next();
    }
    return undefined;
};