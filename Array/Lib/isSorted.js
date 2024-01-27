/**
 * Check if the given array is sorted using the provided compare function, or a default compare function for numbers and strings.
 *
 * @param {Array} array - The array to be checked for sorting.
 * @param {Function} [compareFunction] - The function used to compare elements. If not provided, a default compare function is used.
 * @return {boolean} Returns true if the array is sorted, otherwise returns false.
 */
if (!Array.isSorted) {
    Array.isSorted = function (array, compareFunction) {
        if (!Array.isArray(array)) {
            throw new TypeError('The provided value is not an array.');
        }

        // Default compare function for numbers and strings
        if (!compareFunction) {
            compareFunction = function (a, b) {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            };
        }

        for (var i = 0; i < array.length - 1; i++) {
            if (compareFunction(array[i], array[i + 1]) > 0) {
                return false; // The array is not sorted
            }
        }

        return true; // The array is sorted
    };
};