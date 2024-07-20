/**
 * @description Minimal Map class - ExtendScript (ES3)
 *
 * A minimal version of the Map class. It contains all standard ES6 Map methods.
 *
 * @author Egyed Serf
 * @license MIT
 *
 * Methods for the Map class:
 * - delete()   - Deletes a key-value pair from the map.
 * - get()      - Retrieves a value from the map's data using the provided key.
 * - has()      - Checks if the given key exists in the map's data.
 * - set()      - Sets the value of a key in the map.
 * Property for the Map class:
 * - size       - Returns the number of key-value pairs in the map.
 *
 * @external:   nothing
 */
function Map(iterable) {
    this._data = {};
    this.size = 0;

    if (iterable instanceof Array) {
        for (var i = 0; i < iterable.length; i++) {
            var entry = iterable[i];
            if (entry instanceof Array) {
                this.set(entry[0], entry[1]);
            };
        };
    };
};

/**
 * Sets the value of a key in the data object.
 *
 * @param {string} key - The key to set.
 * @param {*} value - The value to set for the key.
 */
Map.prototype.set = function (key, value) {
    if (!this.has(key)) {
        this.size++;
    }
    this._data[key] = value;
    return this;
};

/**
 * Retrieves a value from the object's data using the provided key.
 *
 * @param {string} key - The key to retrieve the value for.
 * @return {*} The value associated with the provided key.
 */
Map.prototype.get = function (key) {
    return this._data[key];
};

/**
 * Checks if the given key exists in the object's data.
 *
 * @param {string} key - The key to check for existence in the object's data.
 * @return {boolean} True if the object's data contains the given key, false otherwise.
 */
Map.prototype.has = function (key) {
    return this._data.hasOwnProperty(key);
};

/**
 * Deletes a key-value pair from the data object.
 *
 * @param {string} key - the key to delete
 */
Map.prototype.delete = function (key) {
    if (this.has(key)) {
        delete this._data[key];
        this.size--;
        return true;
    } else {
        return false;
    }
};
