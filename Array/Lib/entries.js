/**
 * Returns an iterator object that contains the key/value pairs for each index of the array.
 *
 * @return {Object} An iterator object with a `next` method.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries
 */
if (!Array.prototype.entries) {
    Array.prototype.entries = function () {
        var index = 0;
        var length = this.length;
        var arr = this;

        var iterator = {
            next: function () {
                if (index >= length)
                    return {
                        done: true,
                        value: undefined,
                    };
                else
                    return {
                        done: false,
                        value: [index, arr[index++]],
                    };
            },
        };
        return iterator;
    };
};