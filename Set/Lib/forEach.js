/**
 * Iterates over the elements of the Set and calls the callback function for each element.
 *
 * @param {Function} callback - Function to execute for each element, taking three arguments:
 *                              value, currentValue, index, and object being traversed.
 * @param {Object} [thisArg] - Object to use as `this` when executing `callback`.
 */
Set.prototype.forEach = function (callback, thisArg) {
    var data = this._data;
    for (var i = 0; i < data.length; i++) {
        callback.call(thisArg, data[i], data[i], this);
    }
};