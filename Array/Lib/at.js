/**
 * Retrieves the element at the specified index of the array.
 *
 * @param {number} index - The index of the element to retrieve.
 * @return {*} - The element at the specified index, or undefined if the index is out of range.
 */
if (!Array.prototype.at) {
    Array.prototype.at = function (index) {
        index = Math.floor(index) || 0;
        // Check if index is a number and not NaN
        if (typeof index !== 'number' || isNaN(index)) {
            throw new TypeError('Index must be a valid number');
        }
        // Check range
        if (index < -this.length || index >= this.length) {
            return undefined;
        }

        // Adjust negative index
        index = index < 0 ? this.length + index : index;

        return this[index];
    };
}