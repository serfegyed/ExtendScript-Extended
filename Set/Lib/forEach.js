/**
 * Calls a callback for every live Set value in insertion order.
 */
Set.prototype.forEach = function (callback, thisArg) {
    var records = this._records;
    var i;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.forEach: callback must be a function.");
    }
    for (i = 0; i < records.length; i++) {
        if (records[i].active) {
            callback.call(thisArg, records[i].value, records[i].value, this);
        }
    }
};
