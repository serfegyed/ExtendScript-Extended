/**
 * Returns a live iterator over independent [value, value] pairs.
 */
Set.prototype.entries = function () {
    var iterator = this.values();

    return {
        next: function () {
            var item = iterator.next();
            if (item.done) return item;
            return {value: [item.value, item.value], done: false};
        }
    };
};
