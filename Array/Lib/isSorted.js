/**
 * Tests whether an Array is ordered by the supplied comparator.
 */
//@include "./arrayInternals.js"
//@include "./isArray.js"
if (!Array.isSorted) {
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
            __arrayDefaultCompare__ : compareFunction;
        for (i = 0; i < array.length - 1; i++) {
            if (compare(array[i], array[i + 1]) > 0) return false;
        }
        return true;
    };
}
