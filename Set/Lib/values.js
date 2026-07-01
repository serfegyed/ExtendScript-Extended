/**
 * Returns a live iterator over Set values in insertion order.
 */
Set.prototype.values = function () {
    var index = 0;
    var records = this._records;

    return {
        next: function () {
            while (index < records.length) {
                if (records[index].active) {
                    return {value: records[index++].value, done: false};
                }
                index++;
            }
            return {value: undefined, done: true};
        }
    };
};
