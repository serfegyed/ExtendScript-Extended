/**
 * Removes every value from the Set.
 */
Set.prototype.clear = function () {
    for (var i = 0; i < this._records.length; i++) {
        this._records[i].active = false;
    }
    this._data = [];
    this.size = 0;
};
