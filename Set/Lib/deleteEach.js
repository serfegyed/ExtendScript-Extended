/**
 * Deletes each element in the Set that satisfies the provided callback function.
 *
 * @param {function} callback - The function to test each element. It takes in the value of the element as a parameter.
 * @param {Object} thisArg - Optional. The value to use as 'this' when executing the callback function.
 * @return {Set} - The updated Set after removing the elements that satisfy the callback function.
 */
Set.prototype.deleteEach = function (callback, thisArg) {
    var originalData;
    var i;
    var value;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.deleteEach: callback must be a function.");
    }

    originalData = this._data.slice();
    for (i = 0; i < originalData.length; i++) {
        value = originalData[i];
        if (callback.call(thisArg, value, i, this)) {
            this.delete(value);
        }
    }
    return this;
};
