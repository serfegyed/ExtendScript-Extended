/**
 * Maps each element to an array using a callback function and then flattens the resulting array.
 *
 * @param {function} callback - The function used to map each element of the array
 * @return {Array} A new array with the mapped and flattened elements
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
 * ! Dependency: flat()
 */
#include "./flat.js"
if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function (callback, thisArg) {
        if (typeof callback !== 'function') throw new TypeError('Callback must be a function');

        var mappedArray = Array.prototype.map.call(this, callback, thisArg);

        return mappedArray.flat();
    };
}