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
 * - entries()  - Returns a new iterator object that contains the key/value pairs in the map.
 * - forEach()  - Iterates through each element of the map and applies a callback function.
 * - groupBy()  - Groups the elements according to the string values returned by a callback function
 * - keys()     - Returns a new iterator object that contains the keys in the map.
 * - size()     - Returns the number of key-value pairs in the map.
 * - values()   - Returns a new iterator object that contains the values in the map.
 * 
 * @external:   nothing
 */
#include "./Map_basic.js";
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

/**
 * Groups the elements of an iterable according to the result of a callback function.
 *
 * @param {Iterable} iterable - The iterable to group.
 * @param {Function} callback - The function that produces the grouping key.
 * @return {Map} A Map object with the grouped elements.
 */
if (!Map.groupBy) {
    Map.groupBy = function (iterable, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Second argument must be a function');
        }

        var groups = new Map();

        if (iterable instanceof Map) {
            iterable.forEach(function (value, key) {
                var groupName = callback(value, key, iterable);
                if (!groups.has(groupName)) {
                    groups.set(groupName, []);
                }
                groups.get(groupName).push(value);
            });
        } else if (iterable instanceof Array || typeof iterable === 'object') {
            for (var key in iterable) {
                if (iterable.hasOwnProperty(key)) {
                    var value = iterable[key];
                    var groupName = callback(value, key, iterable);
                    if (!groups.has(groupName)) {
                        groups.set(groupName, []);
                    }
                    groups.get(groupName).push(value);
                }
            }
        } else {
            throw new TypeError('First argument must be an iterable (Map, Array, or Object)');
        }

        return groups;
    };
}