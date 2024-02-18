/**
 * Fill all the elements of an array with a static value from a start index to an end index (excluding the end index).
 *
 * @param {any} value - The value to fill the array with.
 * @param {number} start - The index to start filling the array from. If not provided, default is 0.
 * @param {number} end - The index to stop filling the array at. If not provided, default is the length of the array.
 * @return {Array} - The modified array with filled elements.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
 */
if (!Array.prototype.fill) {
    Array.prototype.fill = function (value, start, end) {
        // Convert start and end to integers, providing default values if undefined
        start = start !== undefined ? Math.floor(start) : 0;
        end = end !== undefined ? Math.floor(end) : this.length;

        // Adjust negative indices relative to the length of the array
        start = start < 0 ? Math.max(this.length + start, 0) : Math.min(start, this.length);
        end = end < 0 ? Math.max(this.length + end, 0) : Math.min(end, this.length);

        // Fill the array if the start is less than the end
        if (start < end) {
            for (var i = start; i < end; i++) {
                this[i] = value;
            }
        }

        return this;
    };
}