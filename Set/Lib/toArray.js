/**
 * Returns an array of all values in the Set object.
 *
 * @return {Array} An array of all values.
 */
Set.prototype.toArray = function () {
    return this._data.slice(); // return a shallow copy of the data array
};