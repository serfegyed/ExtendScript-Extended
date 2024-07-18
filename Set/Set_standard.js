#include ".\\external.js"
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
 *  - values() - Returns a new set iterator object that contains the values for each element in the set.
 *
 * Standard property for the Set object:
 *  - size - The number of elements in the set
 *
 * @external:   Object.isEmpty(), sameValueZero(), isPrimitive(), isArrayLike() from external.js
 */

/**
* Initializes a new Set object.
*
* @param {Array|Set} elements - The initial values to add to the set (optional).
* @return {undefined}
*/
function Set(elements) {
    this._data = [];
    this.size = 0;

    Set.prototype.indexOf = function (value) {
        for (var i = 0; i < this._data.length; i++) {
            if (this._data[i] === value || sameValueZero(value, this._data[i])) {
                return i;
            }
        }
        return -1;
    };

    // Add initial values if provided during initialization
    if (elements instanceof Array) {
        for (var i = 0; i < elements.length; i++) {
            this.add(elements[i]);
        }
    }
};

/**
 * Adds a value to the Set.
 *
 * @param {any} value - The value to be added to the Set.
 * @return {Set} - The updated Set with the value added.
 */
Set.prototype.add = function (value) {
    if (this.indexOf(value) === -1) {
        this._data.push(value);
        this.size = this._data.length;
    }
    return this;
};

/**
 * Checks if the given value exists in the set object or not.
 *
 * @param {any} value - The value to check for existence in the object.
 * @return {boolean} A boolean indicating whether the value is in the set or not.
 */
Set.prototype.has = function (value) {
    return this.indexOf(value) !== -1;
};

/**
 * Deletes the given value from the set.
 *
 * @param {any} value - The value to be deleted from the set.
 */
Set.prototype.delete = function (value) {
    var index = this.indexOf(value);
    if (index !== -1) {
        this._data.splice(index, 1);
        this.size = this._data.length;
        return true;
    }
    return false;
};


/**
 * Clears all element in the set and sets the size to 0.
 *
 * @param {} None
 * @return {} None
 */
Set.prototype.clear = function () {
    this._data = [];
    this.size = this._data.length;
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
    var index = 0;
    var data = this._data;
    return {
        next: function () {
            if (index < data.length) {
                return { value: data[index++], done: false };
            } else {
                return { done: true };
            }
        }
    };
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
    var index = 0;
    var data = this._data;
    return {
        next: function () {
            if (index < data.length) {
                var value = data[index++];
                return { value: [value, value], done: false };
            } else {
                return { done: true };
            }
        }
    };
};

/**
 * Iterates over the elements of the Set and calls the callback function for each element.
 *
 * @param {Function} callback - Function to execute for each element, taking three arguments:
 *                              value, currentValue, index, and object being traversed.
 * @param {Object} [thisArg] - Object to use as `this` when executing `callback`.
 */
Set.prototype.forEach = function (callback, thisArg) {
    var data = this._data;
    for (var i = 0; i < data.length; i++) {
        callback.call(thisArg, data[i], data[i], this);
    }
};