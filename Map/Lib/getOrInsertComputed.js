/**
 * Returns the value for a key, computing and inserting it when absent.
 *
 * @param {*} key - The key to find or insert.
 * @param {Function} callback - Receives the key and computes the missing value.
 * @return {*} The existing or computed value.
 */
Map.prototype.getOrInsertComputed = function (key, callback) {
    var index;
    var value;

    if (typeof callback !== "function") {
        throw new TypeError(
            "Map.prototype.getOrInsertComputed: callback must be a function."
        );
    }

    index = this._findEntry(key);
    if (index !== -1) {
        return this._entries[index][1];
    }

    value = callback.call(undefined, key);
    index = this._findEntry(key);
    this._setEntryAt(index, key, value);
    return value;
};
