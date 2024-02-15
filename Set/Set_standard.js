/**
 * @title Set class - ExtendScript (ES3)
 *
 * @description A lightweight Set class implemented in Extendscript (ES3).
 *
 * @author Egyed Serf
 * @license MIT
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/
 *
 * Standard methods for the Set object:
 *  - add(value) - Adds a value to the set.
 *  - clear() - Clears all element in the set and sets the size to 0.
 *  - delete(value) - Deletes the given value from the set.
 *  - entries() - Returns a new set iterator object that contains the value/value pairs for each element in the set.
 *  - forEach() - Iterates through each element of the set and applies a callback function.
 *  - has(value) - Checks if the given value exists in the set object or not.
 *  - keys() - The keys() method is an alias for the values() method.
 *  - size() - The number of elemets in the set
 *  - values() - Returns a new set iterator object that contains the values for each element in the set.
 * 
 */
#include "./Set_basic.js"

/**
 * Clears all element in the set and sets the size to 0.
 *
 * @param {} None
 * @return {} None
 */
Set.prototype.clear = function () {
    this._data = {};
    this._size = 0;
};

/**
 * Returns a new set iterator object that contains the values for each element
 * in the Set object in insertion order.
 *
 * @return {Object} An iterator object that contains the 'next' function that returns the
 * 	next value of the set on each call, and a 'done' property that is set to
 * 	'true' once all the values have been exhausted.
 */
Set.prototype.values = function () {
    var arr = [];
    for (var value in this._data) {
        arr.push(this._data[value]);
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
                    value: arr[index++],
                };
        },
    };

    return iterator;
};

/**
 * The keys() method is an alias for the values() method.
 */
Set.prototype.keys = Set.prototype.values;

/**
 * The entries() method returns a new set iterator object that contains
 * an array of [value, value] for each element in the Set object, in insertion order.
 * For Set objects there is no key like in Map objects.
 * However, to keep the API similar to the Map object, each entry has the same value
 * for its key and value here, so that an array [value, value] is returned.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries
 *
 * @return {Object} An iterator object that contains the key-value pairs of
 * all enumerable properties of the calling object.
 */
Set.prototype.entries = function () {
    var arr = [];
    for (var value in this._data) {
        arr.push([this._data[value], this._data[value]]);
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
                    value: arr[index++],
                };
        },
    };

    return iterator;
};

/**
 * Iterates over the elements of the Set and calls the callback function for each element.
 *
 * @param {Function} callback - Function to execute for each element, taking three arguments:
 *                              value, currentValue, index, and object being traversed.
 * @param {Object} [thisArg] - Object to use as `this` when executing `callback`.
 */
Set.prototype.forEach = function (callback, thisArg) {
    for (var value in this._data) {
        callback.call(thisArg, this._data[value], value, this);
    }
};