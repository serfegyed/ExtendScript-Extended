/**
 * Checks if an array is empty.
 *
 * @param {Array} value - The array to be checked.
 * @return {boolean} Returns true if the array is empty, false otherwise.
 */
//@include "./isArray.js"
if (!Array.isEmpty) {
    Array.isEmpty = function (value) {
        if (!Array.isArray(value)) {
            throw new TypeError("Array.isEmpty requires an Array.");
        }
        return value.length === 0;
    };
}
