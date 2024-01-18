/**
 * Removes an element from the array at the specified index. The counterpart of the 'insert' method.
 *
 * @param {number} index - The index of the element to remove.
 * @return {Array} - A new array with the element removed.
 */
if (!Array.prototype.remove) {
    Array.prototype.remove = function (index) {
        // Check if the array is empty
        if (this.length === 0) {
            return undefined;
        }

        // Check if the index is a number
        if (typeof index !== 'number') {
            throw new TypeError('Index must be a number');
        }

        index = index < 0 ? this.length + index : index;
        if (index < 0 || index >= this.length) throw new RangeError();
        return this.splice(index, 1)[0];
    };
};