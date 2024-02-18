/**
 * Creates a new array instance with a variable number of elements.
 *
 * @param {any} arguments - The elements to include in the array.
 * @return {Array} The newly created array instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
 */
Array.of = function () {
    var items = Array.prototype.slice.call(arguments);
    // Use 'this' to allow subclass factories
    var constructor = typeof this === 'function' ? this : Array;
    var arrayLike = new constructor(items.length);
    for (var i = 0; i < items.length; i++) {
        arrayLike[i] = items[i];
    }
    arrayLike.length = items.length; // Ensure length is set correctly
    return arrayLike;
};