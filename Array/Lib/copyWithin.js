/**
 * Copies a sequence of array elements within the array to the position starting
 * at the specified target index. The copy is taken from the index positions
 * between the start and end arguments. The end parameter is optional and, if
 * omitted, the copy is made to the end of the array. Returns the modified array.
 *
 * @param {number} target - Target index position to which to copy the elements.
 * @param {number} start - The index position from which to start copying elements.
 * @param {number} [end] - The index position up to which to copy elements.
 * @return {Array} The modified array.
 */
if (!Array.prototype.copyWithin) {
    Array.prototype.copyWithin = function (target, start, end) {
        var len = this.length >>> 0;
        var to = target >> 0;
        var from = start >> 0;
        var last = end === undefined ? len : end >> 0;

        // Normalize negative indices
        if (to < 0) to = Math.max(len + to, 0);
        if (from < 0) from = Math.max(len + from, 0);
        if (last < 0) last = Math.max(len + last, 0);

        // Ensure indices are within range
        to = Math.min(Math.max(to, 0), len);
        from = Math.min(Math.max(from, 0), len);
        last = Math.min(Math.max(last, 0), len);

        // Compute the number of elements to copy
        var count = Math.min(last - from, len - to);

        // Determine direction of copy
        var direction = from < to && to < from + count ? -1 : 1;

        if (direction === -1) {
            from += count - 1;
            to += count - 1;
        }

        // Copy elements
        while (count > 0) {
            if (from in this) this[to] = this[from];
            else delete this[to];

            from += direction;
            to += direction;
            count--;
        }

        return this;
    };
};