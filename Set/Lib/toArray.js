/**
 * Returns an array of all values in the Set object.
 *
 * @return {Array} An array of all values.
 */
Set.prototype.toArray = function () {
    var values = [];
    for (var value in this._data) {
        values.push(this._data[value]);
    }
    return values;
};