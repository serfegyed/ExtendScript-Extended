/**
 * Returns a new set iterator object that contains the values for each element
 * in the Set object in insertion order.
 *
 * @return {Object} An iterator object that contains the 'next' function that returns the
 * 	next value of the set on each call, and a 'done' property that is set to
 * 	'true' once all the values have been exhausted.
 */
Set.prototype.values = function () {
    var index = 0;
    var data = this._data;
    return {
        next: function () {
            if (index < data.length) {
                return { value: data[index++], done: false };
            } else {
                return { done: true };
            }
        }
    };
};