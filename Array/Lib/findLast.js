/**
 * Finds the last element that satisfies the provided testing function.
 *
 * @param {Function} callback - The testing function.
 * @param {*} [thisArg] - An optional object to use as the `this` value when executing the callback.
 * @return {*} - The value of the last element that satisfies the testing function, or `undefined` if no such element is found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast
 */
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function (callback, thisArg) {
    if (typeof callback !== 'function') throw new TypeError('Callback must be a function');

    var length = this.length;
    for (var i = length - 1; i >= 0; i--) {
      if (i in this && callback.call(thisArg, this[i], i, this)) {
        return this[i];
      }
    }
    return undefined;
  };
}