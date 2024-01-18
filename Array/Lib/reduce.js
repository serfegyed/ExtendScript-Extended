/**
 * Reduces the array to a single value by applying a callback function to each element.
 *
 * @param {function} callback - The function to execute on each element of the array.
 * @param {*} initialValue - The initial value for the accumulator.
 * @return {*} The final value of the accumulator.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 */
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback, initialValue) {
        if (typeof callback !== "function")
            throw new TypeError("Callback must be a function");
        var array = this;
        var len = array.length;
        if (len === 0 && initialValue === undefined)
            throw new TypeError("Empty array without an initial value");

        var accumulator = initialValue !== undefined ? initialValue : array[0];
        var startIndex = initialValue !== undefined ? 0 : 1;

        for (var i = startIndex; i < len; i++) {
            if (i in array) {
                accumulator = callback.call(undefined, accumulator, array[i], i, array);
            }
        }

        if (accumulator === undefined)
            throw new TypeError("Reducer function returns an invalid value");

        return accumulator;
    };
};