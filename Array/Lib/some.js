/**
 * Implements the `some` method for the Array prototype.
 *
 * @param {function} callback - A function to test each element of the array.
 * @param {object} thisArg - An object to use as `this` when executing the callback.
 * @return {boolean} Returns `true` if the callback function returns a truthy value for at least one element, otherwise `false`.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
 */
if (!Array.prototype.some) {
    Array.prototype.some = function (callback, thisArg) {
        var len = this.length;
        if (typeof callback !== "function") throw new TypeError();
        thisArg = thisArg || undefined;

        for (var i = 0; i < len; i++) {
            if (i in this && callback.call(thisArg, this[i], i, this)) return true;
        }
        return false;
    };
};