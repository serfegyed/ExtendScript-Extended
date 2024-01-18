/**
 * Reduce the array from right to left using a callback function.
 *
 * @param {function} callback - The function to execute on each element in the array.
 *                             It takes four arguments: accumulator, current element, current index, and the array itself.
 * @param {*} initialValue - The initial value of the accumulator. Optional.
 * @return {*} - The final value of the accumulator.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
 */
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function (callback, initialValue) {
        if (typeof callback !== "function")
            throw new TypeError("Callback must be a function");
        var array = this;
        var len = array.length;
        if (len === 0 && initialValue === undefined)
            throw new TypeError("Empty array without an initial value");

        var accumulator =
            initialValue !== undefined ? initialValue : array[len - 1];
        var endIndex = initialValue !== undefined ? len - 1 : len - 2;

        for (var i = endIndex; i >= 0; i--) {
            if (i in array) {
                accumulator = callback.call(undefined, accumulator, array[i], i, array);
            }
        }

        if (accumulator === undefined)
            throw new TypeError("Reducer function returns an invalid value");

        return accumulator;
    };
};