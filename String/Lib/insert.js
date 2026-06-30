/**
 * Inserts a converted value at the specified string index.
 *
 * @param {*} element - The value to insert.
 * @param {number} index - The zero-based insertion index.
 * @return {string} The string with the value inserted.
 * @throws {RangeError} If the index is invalid or outside the string.
 */
if (!String.prototype.insert) {
    String.prototype.insert = function (element, index) {
        var string = String(this);
        var insertion = String(element);
        var position = Number(index);

        if (!isFinite(position) || position < 0 || position > string.length) {
            throw new RangeError("String.insert: index out of range");
        }

        position = Math.floor(position);
        return string.slice(0, position) + insertion + string.slice(position);
    };
}
