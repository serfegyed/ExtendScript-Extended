/**
 * Appends the elements of the given array to the end of the original array.
 *
 * @param {Array} arrayToAppend - the array to be appended
 * @param {number} depth - the depth to which the array should be flattened before being appended
 * @return {Array} - the original array with the appended elements
 */
//@include "./isArray.js"
//@include "./flat.js"
if (!Array.prototype.append) {
    Array.prototype.append = function (arrayToAppend, depth) {
        if (!Array.isArray(arrayToAppend)) {
            throw new TypeError("Array.prototype.append requires an Array.");
        }

        Array.prototype.push.apply(this,
            Array.prototype.flat.call(arrayToAppend, depth === undefined ? 0 : depth));
        return this;
    };
}
