/**
 * Returns the value for a key, computing and inserting it when absent.
 *
 * @param {*} key - The key to find or insert.
 * @param {Function} callback - Receives the key and computes the missing value.
 * @return {*} The existing or computed value.
 */
Map.prototype.getOrInsertComputed = function (key, callback) {
    var value;

    if (typeof callback !== "function") {
        throw new TypeError(
            "Map.prototype.getOrInsertComputed: callback must be a function."
        );
    }
    if (this.has(key)) {
        return this.get(key);
    }

    value = callback.call(undefined, key);
    this.set(key, value);
    return value;
};
