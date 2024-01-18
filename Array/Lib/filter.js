/**
 * Filters the elements of an array based on a provided callback function.
 *
 * @param {function} callback - The function used to test each element of the array. Should return a boolean value.
 * @return {Array} - A new array with the elements that pass the test.
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
 */
if (!Array.prototype.filter) {
    Array.prototype.filter = function (callback /*, thisArg*/) {
        var len = this.length;
        if (typeof callback !== "function")
            throw new TypeError("Callback must be a function");

        var res = [];
        var thisArg = thisArg || undefined;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i];
                if (callback.call(thisArg, val, i, this)) res[res.length] = val;
            }
        }
        return res;
    };
};