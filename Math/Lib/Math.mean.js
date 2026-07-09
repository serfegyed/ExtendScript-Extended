/**
 * Calculate the mean of an array or across a specified dimension.
 *
 * @param {Array|number} values - The array of values or the array and the dimension along which to calculate the mean
 * @param {number} dimension - The dimension along which to calculate the mean. 
 *					Should be 0 or 1. If not specified, the mean is calculated as flattened array
 * @return {Array|number} The mean value or an array of mean values
 */
Math.mean = function (/*values, dimension*/) {
    //@include "../../Array/Lib/flat.js"
    //@include "../../Array/Lib/info.js"
    //@include "../../Array/Lib/reduce.js"
    //@include "../../Array/Lib/map.js"
    // Helper function to calculate mean of an array
    function meanOfArray(values) {
        var sum = values.reduce(function (a, b) { return a + b; }, 0);
        return sum / values.length;
    }

    // Calculate mean across the specified dimension
    function meanAcrossDimension(values, dimension) {
        var result = [];
        if (dimension === 0) { // Calculate mean of each column
            for (var i = 0; i < values[0].length; i++) {
                var column = values.map(function (row) { return row[i]; });
                result.push(meanOfArray(column));
            }
        } else if (dimension === 1) { // Calculate mean of each row
            for (var j = 0; j < values.length; j++) {
                result.push(meanOfArray(values[j]));
            }
        } else {
            throw new Error('Invalid dimension. Should be 0 or 1.');
        }
        return result;
    }

    var argumentList = Array.prototype.slice.call(arguments);

    if (argumentList.length === 2 && argumentList[0] instanceof Array && typeof argumentList[1] === 'number') { // Array and dimension
        // Check the array uniformity and dimensions
        const info = Array.info(argumentList[0]);
        if (!info.isUniform) {
            throw new Error('Array is not uniform.');
        } else if (info.maxDepth > 1) { //maxDepth is zero-based
            throw new Error('Array has too many dimensions.');
        };
        return meanAcrossDimension(argumentList[0], argumentList[1]);
    } else { // Array to flatten or value list
        var values = argumentList[0] instanceof Array ? argumentList[0] : argumentList;
        var flattened = values.flat(Infinity);
        return meanOfArray(flattened);
    }
};
