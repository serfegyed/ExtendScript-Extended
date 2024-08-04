/**
 * Returns an iterator object that generates key-value pairs of the Map.
 *
 * @returns {Object}
 */
Map.prototype.entries = function () {
    var entries = [];
    for (var i = 0; i < this._entries.length; i++) {
        entries.push([this._entries[i][0], this._entries[i][1]]);
    }

    var index = 0;
    var length = entries.length;

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
                    value: entries[index++],
                };
        },
    };
    return iterator;
};