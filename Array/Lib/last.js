/**
 * Returns the last element of the array.
 *
 * @return {*} The last element of the array.
 */
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
};