/**
 * Returns the value for a key, inserting the supplied value when absent.
 *
 * @param {*} key - The key to find or insert.
 * @param {*} value - The value to insert when the key is absent.
 * @return {*} The existing or inserted value.
 */
Map.prototype.getOrInsert = function (key, value) {
    var index = this._findEntry(key);

    if (index !== -1) {
        return this._entries[index][1];
    }

    this._setEntryAt(index, key, value);
    return value;
};
