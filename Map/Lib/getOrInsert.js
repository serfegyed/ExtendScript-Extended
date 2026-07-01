/**
 * Returns the value for a key, inserting the supplied value when absent.
 *
 * @param {*} key - The key to find or insert.
 * @param {*} value - The value to insert when the key is absent.
 * @return {*} The existing or inserted value.
 */
Map.prototype.getOrInsert = function (key, value) {
    if (this.has(key)) {
        return this.get(key);
    }
    this.set(key, value);
    return value;
};
