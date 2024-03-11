/**
 * Calculates the sum of numbers in a given list of arguments or an array. 
 * If an array is provided, the function will recursively flatten before computing the sum. 
 * Non-numeric values are ignored in the sum calculation.
 * 
 * @param {...(number|Array<number>)} arguments - A comma-separated list of numbers or a single array. 
 * @returns {number} The sum of the provided numbers.
 */
if (!Math.sum) {
    Math.sum = function () {    // ExtendScript version
        // Helper function to recursively flatten an array and compute the sum
        function flattenAndSum(arr) {
            var sum = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] instanceof Array) {
                    sum += flattenAndSum(arr[i]); // Recurse for sub-arrays
                } else {
                    sum += (typeof arr[i] === 'number' ? arr[i] : 0); // Sum the elements
                }
            }
            return sum;
        }

        // Determine if the input is an array or multiple arguments
        if (arguments.length === 0) {
            // No arguments
            return 0;
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
            // Handle a single array argument (possibly multi-dimensional)
            return flattenAndSum(arguments[0]);
        } else {
            // Handle multiple numeric arguments by treating them as a flat array
            var args = Array.prototype.slice.call(arguments);
            return flattenAndSum(args);
        }
    };
}