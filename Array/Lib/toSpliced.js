/**
 * Splices elements from the array at the specified index.
 *
 * @param {number} index - The index at which to start splicing.
 * @param {number} deleteCount - The number of elements to remove.
 * @param {any} item1, item2, itemN - The items to insert at the specified index.
 * @return {Array} - A new array with the spliced elements.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced
 */
#include "../../Object/Lib/deepCopy.js"
if (!Array.prototype.toSpliced) {
    Array.prototype.toSpliced = function (index /*, deleteCount, item1, item2, itemN*/) {
        var copy = Object.deepCopy(this);
        var args = Array.prototype.slice.call(arguments);
        Array.prototype.splice.apply(copy, args);
        return copy;
    };
};