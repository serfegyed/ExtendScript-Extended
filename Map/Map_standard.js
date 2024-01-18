/**
 * @description Minimal Map class - ExtendScript (ES3)
 *
 * A minimal version of the Map class. It contains all standard ES6 Map methods.
 *
 * @author Egyed Serf
 * @license MIT
 * 
 * Methods for the Map class:
 * - clear()    - Clears the map.
 * - delete()   - Deletes a key-value pair from the map.
 * - entries()  - Returns a new iterator object that contains the key/value pairs in the map.
 * - forEach()  - Iterates through each element of the map and applies a callback function.
 * - get()      - Retrieves a value from the map's data using the provided key.
 * - has()      - Checks if the given key exists in the map's data.
 * - keys()     - Returns a new iterator object that contains the keys in the map.
 * - set()      - Sets the value of a key in the map.
 * - size()     - Returns the number of key-value pairs in the map.
 * - values()   - Returns a new iterator object that contains the values in the map.
 * 
 * @external:   nothing
 */
function Map(iterable) {
    this._data = {};
    this._size = 0;

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
 * Returns the number of key-value pairs in the map.
 *
 * @return {number} The number of key-value pairs in the map.
 */
Map.prototype.size = function () {
    return this._size;
};

/**
 * Sets the value of a key in the data object.
 *
 * @param {string} key - The key to set.
 * @param {*} value - The value to set for the key.
 */
Map.prototype.set = function (key, value) {
    if (!this.has(key)) {
        this._size++;
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
        this._size--;
        return true;
    } else {
        return false;
    }
};

/**
 * Clears the data object.
 *
 */
Map.prototype.clear = function () {
    this._data = {};
    this._size = 0;
};

/**
 * Iterates through each element of the object and applies a callback function.
 *
 * @param {function} callback - function to be called for each element in the object
 * @param {object} [thisArg=this] - object to use as 'this' when executing callback
 */
Map.prototype.forEach = function (callback, thisArg) {
    for (var key in this._data) {
        callback.call(thisArg, this._data[key], key, this);
    }
};

/**
 * Returns an iterator object that generates keys of the Map.
 *
 * @return {Object}
 */
Map.prototype.keys = function () {
    var keys = [];
    for (var key in this._data) {
        keys.push(key);
    }

    var index = 0;
    var length = keys.length;

    var iterator = {
        next: function () {
            if (index >= length)
                return {
                    done: true,
                    value: undefined,
                };
            else
                return {
                    done: false,
                    value: keys[index++],
                };
        },
    };
    return iterator;
};

/**
 * Returns an iterator object that generates values of the Map.
 *
 * @return {Object}
 */
Map.prototype.values = function () {
    var values = [];
    for (var key in this._data) {
        values.push(this._data[key]);
    }
    var index = 0;
    var length = values.length;

    var iterator = {
        next: function () {
            if (index >= length)
                return {
                    done: true,
                    value: undefined,
                };
            else
                return {
                    done: false,
                    value: values[index++],
                };
        },
    };
    return iterator;
};

/**
 * Returns an iterator object that generates key-value pairs of the Map.
 *
 * @returns {Object}
 */
Map.prototype.entries = function () {
    var arr = [];
    for (var key in this._data) {
        arr.push([key, this._data[key]]);
    }

    var index = 0;
    var length = arr.length;

    var iterator = {
        next: function () {
            if (index >= length)
                return {
                    done: true,
                    value: undefined,
                };
            else
                return {
                    done: false,
                    value: [arr[index][0], arr[index++][1]],
                };
        },
    };
    return iterator;
};