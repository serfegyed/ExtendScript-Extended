/**
 * Checks if an array is empty.
 *
 * @param {Array} arr - The array to be checked.
 * @return {boolean} Returns true if the array is empty, false otherwise.
 */
//@include "./isArray.js"
if (!Array.isEmpty) {
    Array.isEmpty = function (arr) {
        if (!Array.isArray(arr)) {
            throw new TypeError("Array.isEmpty requires an Array.");
        }
        return arr.length === 0;
    };
}
