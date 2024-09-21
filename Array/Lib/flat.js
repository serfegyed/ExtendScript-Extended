/**
 *  Returns a new array with all sub-array elements concatenated up to the specified depth.
 * @param {number} depth - Optional. The depth level specifying how deep a nested array structure should be flattened.
 * @returns {Array} A new array with the sub-array elements concatenated up to the specified depth.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 */
if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth) {
        var flatDepth = isNaN(depth) ? 1 : Math.max(depth, 0);

        var flatten = function (arr, d) {
            var result = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i in arr) {
                    if (arr[i] instanceof Array && d > 0) {
                        result = result.concat(flatten(arr[i], d - 1));
                    } else {
                        result.push(arr[i]);
                    }
                }
            }
            return result;
        };

        return flatten(this, flatDepth);
    };
}