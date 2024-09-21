/**
 * Finds the first element in the array that satisfies the provided testing function.
 *
 * @param {Function} callback - Function to execute on each value in the array.
 * @param {*} [thisArg] - Object to use as `this` when executing the callback.
 * @return {*} The first element in the array that satisfies the testing function, or `undefined` if no such element is found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */
if (!Array.prototype.find) {
  Array.prototype.find = function (callback, thisArg) {
    if (typeof callback !== "function") throw new TypeError("Callback must be a function");

    for (var i = 0, length = this.length; i < length; i++) {
      if (callback.call(thisArg, this[i], i, this)) return this[i];
    }
    return undefined;
  };
}