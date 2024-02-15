/**
 * Merges the elements of the _sorted_ array with another _array_, using the provided compare function.
 * If any of them unsorted, the result will be unpredictable.
 * @param {Array} arrayToMerge - The array to merge with the original array.
 * @param {Function} [compareFunc] - The function used to compare elements during the merge.
 * @throws {TypeError} Throws a TypeError if the provided value is not an array or if the compare function is not a function.
 * @returns {Array} The original array with the merged result.
 */
#include ".\\isArray.js"
if (!Array.prototype.merge) {
    Array.prototype.merge = function (arrayToMerge, compareFunc) {
        if (!Array.isArray(arrayToMerge)) {
            throw new TypeError('The provided value is not an array.');
        }

        var compare = compareFunc || function (a, b) {
            if (a === undefined || b === undefined) {
                return (a === undefined) - (b === undefined);
            } else {
                return a.toString().localeCompare(b.toString());
            }
        };
        if (typeof (compare) !== 'function') {
            throw new TypeError('The provided compare function is not a function.');
        }

        var i = 0, j = 0, k = 0;
        var result = new Array(this.length + arrayToMerge.length);

        while (i < this.length && j < arrayToMerge.length) {
            result[k++] = compare(this[i], arrayToMerge[j]) < 0 ? this[i++] : arrayToMerge[j++];
        }

        while (i < this.length) {
            result[k++] = this[i++];
        }

        while (j < arrayToMerge.length) {
            result[k++] = arrayToMerge[j++];
        }

        this.length = 0;
        Array.prototype.push.apply(this, result);

        return this;
    };
};