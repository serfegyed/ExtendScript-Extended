/**
 * Returns a live iterator over independent [value, value] pairs.
 */
Set.prototype.entries = function () {
    var index = 0;
    var records = this._records;

    return {
        next: function () {
            var value;

            while (index < records.length) {
                if (records[index].active) {
                    value = records[index++].value;
                    return {value: [value, value], done: false};
                }
                index++;
            }
            return {value: undefined, done: true};
        }
    };
};
