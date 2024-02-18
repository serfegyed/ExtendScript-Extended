/**
 * Retrieves the element at the specified index of the array.
 *
 * @param {number} index - The index of the element to retrieve.
 * @return {*} - The element at the specified index, or undefined if the index is out of range.
 * !dependency Math.trunc
 */
if (!Array.prototype.at) {
    #include "../Math/Lib/Math.trunc.js"
    Array.prototype.at = function (index) {
        // Check array length
        if (this.length === 0) {
            return undefined;
        };

        // Convert index to an integer
        index = Math.trunc(index);

        // Adjust index if Infinite or NaN
        if (isNaN(index)) { index = 0 };
        if (!isFinite(index)) { return undefined };

        // Adjust for negative indices
        if (index < 0) {
            index += this.length;
        }

        // Check range
        if (index < 0 || index >= this.length) {
            return undefined;
        }

        return this[index];
    };
}