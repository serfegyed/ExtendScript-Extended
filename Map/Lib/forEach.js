/**
 * Iterates through each element of the object and applies a callback function.
 *
 * @param {function} callback - function to be called for each element in the object
 * @param {object} [thisArg=this] - object to use as 'this' when executing callback
 */
Map.prototype.forEach = function (callback, thisArg) {
    for (var i = 0; i < this._entries.length; i++) {
        var entry = this._entries[i];
        callback.call(thisArg, entry[1], entry[0], this);
    }
};