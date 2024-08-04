/**
 * Returns the first key associated with the specified search element in the map.
 *
 * @param {any} searchElement - The element to search for in the map.
 * @return {any} The key associated with the search element, or undefined if the element is not found.
 * @external Map.prototype.entries, sameValueZero()
 */
Map.prototype.keyOf = function (searchElement) {
    if (!arguments.length) throw new TypeError('Map.keyOf(): Missing search element')
    index = this._findIndex(searchElement);

    return index === -1 ? undefined : this._entries[index][0];
};