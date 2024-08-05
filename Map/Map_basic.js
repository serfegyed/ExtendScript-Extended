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
 * - set()      - Adds or overwrites an element of a key in the map.
 * Property for the Map class:
 * - size       - Returns the number of key-value pairs in the map.
 *
 * @external:   nothing
 */
function Map(iterable) {
    this._entries = []; // Store entries as an array of [key, value] arrays
    this.size = 0;

    Map.prototype._findEntry = function (key) {
        for (var i = 0; i < this._entries.length; i++) {
            if (sameValueZero(this._entries[i][0], key)) {
                return i;
            }
        }
        return -1; // Return -1 if no entry is found
    };

    Map.prototype._findIndex = function (value) {
        for (var i = 0; i < this._entries.length; i++) {
            if (sameValueZero(this._entries[i][1], value)) {
                return i;
            }
        }
        return -1; // Return -1 if no entry is found
    };

    if (iterable instanceof Array) {
        for (var i = 0; i < iterable.length; i++) {
            var entry = iterable[i];
            if (entry instanceof Array && entry.length === 2) {
                this.set(entry[0], entry[1]);
            }
        }
    }
}

/**
 * Sets the value of a key in the data object.
 *
 * @param {string} key - The key to set.
 * @param {*} value - The value to set for the key.
 */
Map.prototype.set = function (key, value) {
    var index = this._findEntry(key);
    if (index === -1) {
        this._entries.push([key, value]);
        this.size = this._entries.length;
    } else {
        this._entries[index][1] = value;
    }
    return this;
};

/**
 * Retrieves a value from the object's data using the provided key.
 *
 * @param {string} key - The key to retrieve the value for.
 * @return {*} The value associated with the provided key.
 */
Map.prototype.get = function (key) {
    var index = this._findEntry(key);
    return index !== -1 ? this._entries[index][1] : undefined;
};

/**
 * Checks if the given key exists in the object's data.
 *
 * @param {string} key - The key to check for existence in the object's data.
 * @return {boolean} True if the object's data contains the given key, false otherwise.
 */
Map.prototype.has = function (key) {
    return this._findEntry(key) !== -1;
};

/**
 * Deletes a key-value pair from the data object.
 *
 * @param {string} key - the key to delete
 */
Map.prototype.delete = function (key) {
    var index = this._findEntry(key);
    if (index !== -1) {
        this._entries.splice(index, 1);
        this.size = this._entries.length;
        return true;
    }
    return false;
};
