/**
 * Checks if the Map instance includes a specific element.
 *
 * @param {any} searchElement - The element to search for in the Map.
 * @return {boolean} Returns true if the element is found in the Map, otherwise returns false.
 * @external Map.prototype.values, sameValueZero()
 */
Map.prototype.includes = function (searchElement) {
    if (!arguments.length) throw new TypeError('Map.includes(): Missing search element')

    return this._findIndex(searchElement) !== -1;
};