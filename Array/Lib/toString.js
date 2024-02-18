/**
 * Converts an array to a string representation.
 *
 * @return {string} The string representation of the array.
 */
Array.prototype.toString = function () {
    var elements = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
        if (i in this) {
            elements[i] = (typeof this[i] === 'string') ? '"' + this[i] + '"' : this[i];
        }
    }
    return "[" + elements.join(", ") + "]";
};