/**
 * Implements the map function for the Array prototype.
 *
 * @param {function} callback - The function to execute on each element of the array.
 * @param {Object} [thisArg] - Object to use as `this` when executing the callback.
 * @return {Array} - A new array with the results of calling the callback function on each element.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        var len = this.length;
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = thisArg || undefined;

        var res = new Array(len);
        for (var i = 0; i < len; i++) {
            if (i in this) res[i] = callback.call(thisArg, this[i], i, this);
        }
        return res;
    };
};