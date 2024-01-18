/**
 * Maps each element to an array using a callback function and then flattens the resulting array.
 *
 * @param {function} callback - The function used to map each element of the array
 * @return {Array} A new array with the mapped and flattened elements
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
 * ! Dependency: flat()
 */
if (!Array.prototype.flatMap) {
    #include ".\\flat.js"
    Array.prototype.flatMap = function (callback) {
        callback = callback || function (x) {
            return x;
        };
        return Array.prototype.map.call(this, callback).flat();
    };
};