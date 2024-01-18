/**
 * Returns an iterator object that contains the values of the array.
 *
 * @return {object} An iterator object with a `next` method that returns the next value in the array.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values
 */
if (!Array.prototype.values) {
    Array.prototype.values = function () {
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
                        value: arr[index++],
                    };
            },
        };
        return iterator;
    };
};