/**
 * The entries() method returns a new set iterator object that contains
 * an array of [value, value] for each element in the Set object, in insertion order.
 * For Set objects there is no key like in Map objects.
 * However, to keep the API similar to the Map object, each entry has the same value
 * for its key and value here, so that an array [value, value] is returned.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries
 *
 * @return {Object} An iterator object that contains the key-value pairs of
 * all enumerable properties of the calling object.
 */
Set.prototype.entries = function () {
    var index = 0;
    var data = this._data;
    return {
        next: function () {
            if (index < data.length) {
                var value = data[index++];
                return { value: [value, value], done: false };
            } else {
                return { done: true };
            }
        }
    };
};