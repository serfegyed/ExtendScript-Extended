/**
 * Converts an array to a string representation.
 *
 * @return {string} The string representation of the array.
 */
Array.prototype.toString = function () {
    var length = this.length;
    var elements = new Array(length);
    for (var i = 0; i < length; i++) {
        if (i in this) {
            elements[i] = (typeof this[i] === 'string') ? '"' + this[i] + '"' : this[i];
        }
    }
    return "[" + elements.join(", ") + "]";
};