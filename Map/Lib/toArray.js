/**
 * Converts a Map object to an array.
 *
 * @return {Array} The resulting array containing the elements of the Map object.
 */
Map.prototype.toArray = function () {
    var entries = [];
    for (var i = 0; i < this._entries.length; i++) {
        entries.push([this._entries[i][0], this._entries[i][1]]);
    }
    return entries; // Returns an array of [key, value] pairs
};