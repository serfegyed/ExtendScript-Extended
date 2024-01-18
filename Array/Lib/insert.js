/**
 * Inserts an element at the specified index in the array.
 *
 * @param {any} elem - The element to be inserted.
 * @param {number} index - The index at which the element should be inserted.
 * @return {Array} - A new array with the element inserted at the specified index.
 */
if (!Array.prototype.insert) {
    Array.prototype.insert = function (elem, index) {
        if (elem === null) throw new TypeError();
        index = index < 0 ? this.length + index : index;
        if (index < 0 || index >= this.length) throw new RangeError();
        var arr = this.slice();
        arr.splice(index, 0, elem);
        return arr;
    };
};