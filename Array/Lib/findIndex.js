/**
 * Finds the index of the first element in the array that satisfies the provided testing function.
 *
 * @param {function} callback - A function that is called for each element in the array.
 * @param {any} thisArg - An optional object to which the this keyword can refer in the callback function.
 * @return {number} The index of the first element in the array that satisfies the provided testing function. If no element satisfies the function, -1 is returned.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
 */
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (callback /*, thisArg*/) {
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = arguments[1] || undefined;

        for (var i = 0; i < this.length; i++) {
            if (callback.call(thisArg, this[i], i, this)) return i;
        }
        return -1;
    };
};