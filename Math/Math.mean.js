/**
 * Calculate the mean of an array or across a specified dimension.
 *
 * @param {Array|number} values - The array of values or the array and the dimension along which to calculate the mean
 * @param {number} dim - The dimension along which to calculate the mean. 
 *					Should be 0 or 1. If not specified, the mean is calculated as flattened array
 * @return {Array|number} The mean value or an array of mean values
 */
Math.mean = function (/*values, dim*/) {
    //@include "../Array/Lib/flat.js"
    //@include "../Array/Lib/info.js"
    //@include "../Array/Lib/reduce.js"
    //@include "../Array/Lib/map.js"
    // Helper function to calculate mean of an array
    function meanOfArray(arr) {
        var sum = arr.reduce(function (a, b) { return a + b; }, 0);
        return sum / arr.length;
    }

    // Calculate mean across the specified dimension
    function meanAcrossDimension(arr, dim) {
        var result = [];
        if (dim === 0) { // Calculate mean of each column
            for (var i = 0; i < arr[0].length; i++) {
                var column = arr.map(function (row) { return row[i]; });
                result.push(meanOfArray(column));
            }
        } else if (dim === 1) { // Calculate mean of each row
            for (var j = 0; j < arr.length; j++) {
                result.push(meanOfArray(arr[j]));
            }
        } else {
            throw new Error('Invalid dimension. Should be 0 or 1.');
        }
        return result;
    }

    var args = Array.prototype.slice.call(arguments);

    if (args.length === 2 && args[0] instanceof Array && typeof args[1] === 'number') { // Array and dimension
        // Check the array uniformity and dimensions
        const info = Array.info(args[0]);
        if (!info.isUniform) {
            throw new Error('Array is not uniform.');
        } else if (info.maxDepth > 1) { //maxDepth is zero-based
            throw new Error('Array has too many dimensions.');
        };
        return meanAcrossDimension(args[0], args[1]);
    } else { // Array to flatten or value list
        var values = args[0] instanceof Array ? args[0] : args;
        var flattened = values.flat(Infinity);
        return meanOfArray(flattened);
    }
};