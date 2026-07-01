/**
 * Removes every key-value pair from the Map.
 */
Map.prototype.clear = function () {
    this._entries = [];
    this.size = 0;
};
