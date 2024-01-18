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
    Array.prototype.fill = function (value /*, start, end*/) {
        var len = this.length;

        // Handle start parameter
        var start = arguments[1];
        start = start === undefined ? 0 : Math.floor(start);
        if (start < 0) {
            start = Math.max(len + start, 0);
        } else {
            start = Math.min(start, len);
        }

        // Handle end parameter
        var end = arguments[2];
        end = end === undefined ? len : Math.floor(end);
        if (end < 0) {
            end = Math.max(len + end, 0);
        } else {
            end = Math.min(end, len);
        }

        // If start is greater than or equal to end, do nothing
        if (start >= end) {
            return this;
        }

        // Fill the array
        for (var i = start; i < end; i++) {
            this[i] = value;
        }

        return this;
    };
};