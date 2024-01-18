/**
 * Returns an iterator object that contains the keys for each index in the array.
 *
 * @return {object} An iterator object with a `next` method that returns an object with a `done` property (a boolean indicating if the iterator is done) and a `value` property (the current index value).
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys
 */
if (!Array.prototype.keys) {
    Array.prototype.keys = function () {
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
                        value: index++,
                    };
            },
        };
        return iterator;
    };
};