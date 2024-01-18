/**
 * Reverses the order of the elements in an array.
 *
 * @return {Array} A new array with the elements in reverse order.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed
 */
if (!Array.prototype.toReversed) {
    #include "..\\..\\Object\\Lib\\deepCopy.js"
    Array.prototype.toReversed = function () {
        var copy = Object.deepCopy(this);
        return Array.prototype.reverse.call(copy);
    };
};