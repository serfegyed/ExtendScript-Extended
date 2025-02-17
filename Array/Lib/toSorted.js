/**
 * Sorts the array in ascending order using the provided compare function, if any.
 *
 * @param {function} compareFunc - Optional. A function that defines the sort order.
 * @return {Array} A new array with the elements sorted in ascending order.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
 */
#include "../../Object/Lib/deepCopy.js"
if (!Array.prototype.toSorted) {
    Array.prototype.toSorted = function (compareFunc) {
        var copy = Object.deepCopy(this);
        if (compareFunc) {
            return Array.prototype.sort.call(copy, compareFunc);
        } else {
            return Array.prototype.sort.call(copy);
        };
    };
};