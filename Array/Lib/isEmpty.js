/**
 * Checks if an array is empty.
 *
 * @param {Array} arr - The array to be checked.
 * @return {boolean} Returns true if the array is empty, false otherwise.
 */
if (!Array.isEmpty) {
    Array.isEmpty = function (arr) {
        if (arr.__class__ !== "Array")
            throw new TypeError(arr.toString() + " is not an Array");
        return arr.length === 0 ? true : false;
    };
};