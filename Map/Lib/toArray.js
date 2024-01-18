/**
 * Converts a Map object to an array.
 *
 * @return {Array} The resulting array containing the elements of the Map object.
 */
Map.prototype.toArray = function () {
    var array = [];
    for (var key in this._data) {
        array.push([key, this._data[key]])
    }
    return array;
};