/**
 * Updates an element at the specified index in the array with a new value.
 *
 * @param {number} index - The index of the element to be updated.
 * @param {any} value - The new value to be assigned to the element.
 * @return {Array} - A new array with the updated element.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with
 */
#include "..\\..\\Object\\Lib\\deepCopy.js"
if (!Array.prototype.with) {
    Array.prototype.with = function (index, value) {
        var copy = Object.deepCopy(this);
        copy[index] = value;
        return copy;
    };
};