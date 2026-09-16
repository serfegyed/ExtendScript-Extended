/**
 * Returns a live iterator over Set values in insertion order.
 */
Set.prototype.values = function () {
    var set = this;
    var lastId = -1;

    return {
        next: function () {
            var records;
            var low = 0;
            var high;
            var middle;

            if (set === null) return {value: undefined, done: true};

            records = set._records;
            high = records.length;
            while (low < high) {
                middle = Math.floor((low + high) / 2);
                if (records[middle].id <= lastId) low = middle + 1;
                else high = middle;
            }
            if (low < records.length) {
                lastId = records[low].id;
                return {value: records[low].value, done: false};
            }
            set = null;
            return {value: undefined, done: true};
        }
    };
};
