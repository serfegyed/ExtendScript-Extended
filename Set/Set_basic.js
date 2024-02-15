/**
 * @title Set class - ExtendScript (ES3)
 *
 * @description A lightweight Set class implemented in Extendscript (ES3).
 *              These are the basic methods of the Set object.
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

/**
* Initializes a new Set object.
*
* @param {Array|Set} elements - The initial values to add to the set (optional).
* @return {undefined}
*/
function Set(elements) {
    this._data = {};
    this._size = 0;

    // Add initial values if provided during initialization
    if (elements instanceof Array || elements instanceof Set) {
        this.from(elements);
    }
}

/**
 * Returns the number of elements in the set.
 *
 * @return {number} The number of elements in the set.
 */
Set.prototype.size = function () {
    return this._size;
};

/**
 * Adds a value to the Set.
 *
 * @param {any} value - The value to be added to the Set.
 * @return {Set} - The updated Set with the value added.
 */
Set.prototype.add = function (value) {
    if (!this.has(value)) {
        this._size++;
    }
    this._data[value] = value;
    return this;
};

/**
 * Checks if the given value exists in the set object or not.
 *
 * @param {any} value - The value to check for existence in the object.
 * @return {boolean} A boolean indicating whether the value is in the set or not.
 */
Set.prototype.has = function (value) {
    return this._data.hasOwnProperty(value);
};

/**
 * Deletes the given value from the set.
 *
 * @param {any} value - The value to be deleted from the set.
 */
Set.prototype.delete = function (value) {
    if (this.has(value)) {
        delete this._data[value];
        this._size--;
        return true;
    }
    return false;
};
