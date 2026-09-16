/**
 * Removes every value from the Set.
 */
Set.prototype.clear = function () {
    this._records = [];
    this._data = [];
    this.size = 0;
};
