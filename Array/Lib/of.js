/**
 * Creates a new array instance with a variable number of elements.
 *
 * @param {any} arguments - The elements to include in the array.
 * @return {Array} The newly created array instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
 */
if (!Array.of) {
    Array.of = function () {
        var constructor = this;
        var items = [].slice.call(arguments);
        var arrayLike =
            typeof constructor === "function"
                ? Object(new constructor(items.length))
                : new Array(items.length);
        for (var index = 0; index < items.length; index++) {
            arrayLike[index] = items[index];
        }
        arrayLike.length = items.length;
        return arrayLike;
    };
};