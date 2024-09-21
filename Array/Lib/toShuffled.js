/**
 * Creates a shuffled copy of a given array using the Inside-Out Algorithm, a variant of the Fisher-Yates shuffle.
 * The original array remains unmodified
 *
 * @param {Array} array The array to shuffle.
 * @return {Array} A new array that is a shuffled copy of the input array.
 */
if (!Array.prototype.toShuffled) {
    Array.prototype.toShuffled = function () {
        var i, j, temp;
        var arrCopy = new Array(this.length);
        for (i = 0, length = this.length; i < length; i++) {
            j = Math.floor(Math.random() * (i + 1));
            if (i !== j) {
                arrCopy[i] = arrCopy[j];
            }
            arrCopy[j] = this[i];
        }
        return arrCopy;
    }
}