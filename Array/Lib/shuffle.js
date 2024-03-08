/**
 * Shuffles an array implementing the Fisher-Yates algorithm.
 * This method performs an in-place shuffle, directly modifying the original  array. 
 *
 * @returns {Array} The original array, shuffled.
 */
if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function () {
        var i = this.length, j, temp;
        while (--i > 0) {
            j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
            // Swap elements at indices i and j
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
        return this;
    };
}