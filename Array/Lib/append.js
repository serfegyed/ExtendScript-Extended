/**
 * Appends the elements of the given array to the end of the original array.
 *
 * @param {Array} arrayToAppend - the array to be appended
 * @param {number} depth - the depth to which the array should be flattened before being appended
 * @return {Array} - the original array with the appended elements
 */
if (!Array.prototype.append) {
    //@include "./isArray.js"
    //@include "./Array-flat.js"
    Array.prototype.append = function (arrayToAppend, depth) {
        if (!Array.isArray(arrayToAppend)) {
            throw new TypeError("Can't append non-array values")
        }

        Array.prototype.push.apply(this, arrayToAppend.flat(depth === undefined ? 0 : depth))
        return this
    }
}