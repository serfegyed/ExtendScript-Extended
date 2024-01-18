/**
 * Adds a new method to the Array prototype that returns a random element from the array.
 *
 * @return {*} The randomly selected element from the array.
 */
if (!Array.prototype.random) {
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };
};