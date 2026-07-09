/**
 * Tests whether an Array is ordered by the supplied comparator.
 */
//@include "./isArray.js"
if (!Array.isSorted) {
    function defaultCompare(a, b) {
        if (a === undefined) return b === undefined ? 0 : 1;
        if (b === undefined) return -1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    Array.isSorted = function (array, compareFunction) {
        var compare;
        var i;

        if (!Array.isArray(array)) {
            throw new TypeError("Array.isSorted requires an Array.");
        }
        if (compareFunction !== undefined && typeof compareFunction !== "function") {
            throw new TypeError("Array.isSorted: comparator must be a function.");
        }
        compare = compareFunction === undefined ?
            defaultCompare : compareFunction;
        for (i = 0; i < array.length - 1; i++) {
            if (compare(array[i], array[i + 1]) > 0) return false;
        }
        return true;
    };
}
