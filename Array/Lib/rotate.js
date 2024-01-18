/**
 * Rotates the elements of an array by the specified number of steps.
 *
 * @param {number} step - The number of steps to rotate the array. Positive values rotate the array to the right, negative values rotate it to the left.
 * @return {Array} - The rotated array.
 */
if (!Array.prototype.rotate) {
  Array.prototype.rotate = function (step) {
    var length = this.length;
    var effectiveStep = ((step % length) + length) % length;
    var rotated = this.slice(effectiveStep).concat(
      this.slice(0, effectiveStep)
    );
    return rotated;
  };
};