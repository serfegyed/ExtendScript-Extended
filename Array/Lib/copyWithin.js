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
 * !dependency Math.trunc
 */
if (!Array.prototype.copyWithin) {
    #include "../Math/Lib/Math.trunc.js"
    Array.prototype.copyWithin = function (target, start, end) {
        var len = this.length;
        var to = Math.trunc(target);
        var from = Math.trunc(start);
        var last = end === undefined ? len : Math.trunc(end);

        // Normalize indices
        to = to < 0 ? Math.max(len + to, 0) : Math.min(to, len);
        from = from < 0 ? Math.max(len + from, 0) : Math.min(from, len);
        last = last < 0 ? Math.max(len + last, 0) : Math.min(last, len);

        var count = Math.min(last - from, len - to);
        var direction = from < to && to < from + count ? -1 : 1;

        if (direction === -1) {
            from += count - 1;
            to += count - 1;
        }

        while (count > 0) {
            if (from in this) {
                this[to] = this[from];
            } else {
                delete this[to];
            }
            from += direction;
            to += direction;
            count--;
        }

        return this;
    };
}