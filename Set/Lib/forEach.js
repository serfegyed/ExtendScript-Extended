/**
 * Calls a callback for every live Set value in insertion order.
 */
Set.prototype.forEach = function (callback, thisArg) {
    var iterator;
    var item;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.forEach: callback must be a function.");
    }
    iterator = this.values();
    item = iterator.next();
    while (!item.done) {
        callback.call(thisArg, item.value, item.value, this);
        item = iterator.next();
    }
};
