#include "./external.js";

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
 * Non-standard methods for the Set object:
 * (They are mostly Array-like methods in some stage of tc39 proposal phase)
 *  - addAll() - Adds elements defined as parameters to the set.
 *  - addEach() - Adds elements defined as parameters to the set based on the result of a callback function
 *  - deleteAll() - Removes elements defined as parameters from the set.
 *  - deleteEach() - Removes elements defined by a callback function from the set.
 *  - every() - Checks if all elements in the set satisfy the provided callback function
 *  - filter() - Filters the elements of a Set object based on a provided callback function
 *  - find() - Finds the first element in the set that satisfies the provided testing function
 *  - from() - Adds values from iterable(s) and/or primitive(s)to the Set.
 *  - isEmpty() - Determines whether the given parameter is an empty Set.
 *  - isSet() - Checks if an object is a Set.
 *  - join() - Joins all elements of a Set into a string with a given separator
 *  - map() - Applies a callback function to each element in the set and returns a new set with the results.
 *  - reduce() - Reduce the set to a single value by applying a callback function
 *  - some() - Checks if any element in the set satisfies the provided callback function
 *  - toArray() - Returns an array representation of the set.
 *  - toString() - Returns a string representation of the set.
 *
 * Set composition:
 *  - difference() - Calculates the difference between the current set and another set.
 *  - intersection() - Calculates the intersection of two sets.
 *  - isDisjointFrom() - Checks if the current set is a disjoint of another set
 *  - isEqual() - Checks if the current set is equal to another set
 *  - isSubsetOf() - Checks if the current set is a subset of another set
 *  - isSupersetOf() - Checks if the current set is a superset of another set
 *  - symmetricDifference() - Calculates the symmetric difference between this set and another set.
 *  - union() - Returns a new Set with the union of the two sets
 *
 * @external:   Object.isEmpty(), sameValueZero(), isPrimitive(), isArrayLike() from external.js
 */
/*************************************************************************************/
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
 * Checks if an object is a Set.
 *
 * @param {any} obj - The object to be checked.
 * @return {boolean} Returns true if the object is a Set, otherwise returns false.
 */
Set.isSet = function (obj) {
    return obj instanceof Set;
};

/**
 * Returns the number of elements in the set.
 *
 * @return {number} The number of elements in the set.
 */
Set.prototype.size = function () {
    return this._size;
};

/**
 * Determines whether the given parameter is an empty Set.
 *
 * @param {Set} set - The Set to check.
 * @throws {TypeError} Throws a TypeError if the parameter is not a Set.
 * @return {boolean} Returns true if the Set is empty, false otherwise.
 */
Set.isEmpty = function (set) {
    if (!set instanceof Set) throw new TypeError(set.toString() + " is not a Set");
    return set.size() === 0;
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

/**
 * Returns an array of all values in the Set object.
 *
 * @return {Array} An array of all values.
 */
Set.prototype.toArray = function () {
    var values = [];
    for (var value in this._data) {
        values.push(this._data[value]);
    }
    return values;
};

/**
 * Returns a string representation of the contents of the Set, enclosed in curly braces.
 *
 * @return {string} A string representation of the contents of the object.
 */
Set.prototype.toString = function () {
    var str = "";
    for (var value in this._data) {
        if (str !== "") {
            str += ", ";
        };
        str += (typeof value === 'string') ? '"' + value + '"' : value;
    }

    return "{" + str + "}";
};

/**
 * Adds values from iterable(s) and/or primitive(s)to the Set.
 *
 * @param {Object} iterables - The iterable(s) and/or primitive(s) to add to the Set.
 * @return {Set} The modified Set object.
 */
Set.prototype.from = function (iterables) {
    for (var i = 0; i < arguments.length; i++) {
        var iterable = arguments[i];

        if (isPrimitive(iterable)) {
            this.add(iterable);
        } else if (sameValueZero(iterable, NaN)) {
            this.add(iterable);
        } else if (iterable instanceof Array) {
            if (!!iterable.length) {
                for (var i = 0; i < iterable.length; i++) {
                    this.add(iterable[i]);
                }
            } else {    // to add empty array
                this.add(iterable);
            }
        } else if (iterable instanceof Set) {
            var iterator = iterable.values();
            var result = iterator.next();
            while (!result.done) {
                this.add(result.value);
                result = iterator.next();
            }
        } else if (typeof iterable === "object") {
            if (!Object.isEmpty(iterable)) {
                for (var key in iterable) {
                    if (iterable.hasOwnProperty(key)) {
                        this.add(key);
                    }
                }
            } else {    // to add empty object
                this.add(iterable);
            }
        } else {
            // For other unsupported types, directly add them to the Set.
            this.add(iterable);
        }
    }

    return this;
};

Set.prototype.some = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.some(): Missing callback function");
    var iterator = this.values();
    var currentItem = iterator.next();
    while (!currentItem.done) {
        if (callback.call(thisArg, currentItem.value)) {
            return true;
        }
        currentItem = iterator.next();
    }
    return false;
};

Set.prototype.every = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.every(): Missing callback function");
    var iterator = this.values();
    var currentItem = iterator.next();
    while (!currentItem.done) {
        if (!callback.call(thisArg, currentItem.value)) {
            return false;
        }
        currentItem = iterator.next();
    }
    return true;
};

Set.prototype.filter = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.filter(): Missing callback function");
    var filteredSet = new Set();
    var iterator = this.values();
    var entry = iterator.next();

    while (!entry.done) {
        if (callback.call(thisArg, entry.value)) {
            filteredSet.add(entry.value);
        }
        entry = iterator.next();
    }

    return filteredSet;
};

Set.prototype.map = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.map(): Missing callback function");
    var newSet = new Set();
    var iterator = this.values();
    var entry = iterator.next();

    while (!entry.done) {
        newSet.add(callback.call(thisArg, entry.value));
        entry = iterator.next();
    }

    return newSet;
};

Set.prototype.find = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.find(): Missing callback function");
    var iterator = this.values();
    var entry = iterator.next();
    while (!entry.done) {
        if (callback.call(thisArg, entry.value)) {
            return entry.value;
        }
        entry = iterator.next();
    }
    return undefined;
};

/**
 * Reduces the elements of the Set to a single value using a callback function.
 *
 * @param {function} callback - The function to execute on each element of the Set.
 *                              It takes two arguments: the accumulator and the current value.
 *                              The function should return the updated accumulator value.
 * @param {any} initialValue - Optional. The initial value of the accumulator.
 * @throws {TypeError} If the callback parameter is not a function or if the Set is empty and no initial value is provided.
 * @throws {TypeError} If the types of the accumulator and the current value are different.
 * @throws {TypeError} If the reducer function returns an invalid value.
 * @return {any} The final value of the accumulator after the reduction.
 */
Set.prototype.reduce = function (callback, initialValue) {
    if (typeof callback !== "function")
        throw new TypeError("Set.reduce(): Callback must be a function");

    if (this.size() === 0 && initialValue === undefined)
        throw new TypeError("Set.reduce(): Empty Set without an initial value");

    var iterator = this.values();
    var entry = iterator.next();
    var accumulator = initialValue;

    if (!entry.done && !accumulator) {
        accumulator = entry.value;
        entry = iterator.next();
    }

    while (!entry.done) {
        var currentValue = entry.value;
        // Check if the types of the accumulator and currentValue are different
        if (typeof accumulator !== typeof currentValue) {
            throw new TypeError(
                "Set.reduce(): Type mismatch in Set.reduce(). All elements must be of the same type."
            );
        }

        accumulator = callback.call(this, accumulator, currentValue);
        entry = iterator.next();
    }

    if (accumulator === undefined)
        throw new TypeError(
            "Set.reduce(): Reducer function returns an invalid value"
        );

    return accumulator;
};

/**
 * Returns a new set that is the union of the current set and the otherSet.
 *
 * @param {Set} otherSet - The set to be combined with the current set.
 * @throws {TypeError} If the otherSet parameter is not an instance of Set.
 * @return {Set} A new set that contains all the elements from both sets.
 */
Set.prototype.union = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.union(): wrong parameter type.");
    }
    var unionSet = new Set(this);

    return unionSet.from(otherSet);
};

/**
 * Calculates the difference between the current set and another set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @return {Set} The set containing the elements that are in the current set but not in the other set.
 */
Set.prototype.difference = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.difference(): wrong parameter type.");
    }
    var diffSet = new Set(this);

    var iterator = diffSet.values();
    var result = iterator.next();

    while (!result.done) {
        if (otherSet.has(result.value)) {
            diffSet.delete(result.value);
        }
        result = iterator.next();
    }

    return diffSet;
};

/**
 * Calculates the symmetric difference between this set and another set.
 *
 * @param {Set} otherSet - The set to calculate the difference with.
 * @return {Set} The set containing the elements that are in either this set or the other set, but not in both.
 */
Set.prototype.symmetricDifference = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.symmetricDifference(): wrong parameter type.");
    }

    var diffSet1 = this.difference(otherSet);
    var diffSet2 = otherSet.difference(this);

    return diffSet1.from(diffSet2);
};

/**
 * Calculates the intersection of two sets.
 *
 * @param {Set} otherSet - The set to intersect with.
 * @return {Set} A new set containing the elements that are common to both sets.
 */
Set.prototype.intersection = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.intersection(): wrong parameter type.");
    }

    var intersectionSet = new Set();
    this.forEach(function (value) {
        if (otherSet.has(value)) {
            intersectionSet.add(value);
        }
    });

    return intersectionSet;
};

/**
 * Checks if the current set is a subset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter type is not a Set.
 * @return {boolean} Returns true if the current set is a subset of the given set, otherwise false.
 */
Set.prototype.isSubset = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isSubset(): wrong parameter type.");
    }
    if (this.size() > otherSet.size()) {
        return false;
    }
    if (Set.isEmpty(this)) {
        // An empty set is subset of any other sets
        return true;
    }

    var iterator = this.values();
    var entry = iterator.next();
    while (!entry.done) {
        if (!otherSet.has(entry.value)) {
            // If any element isn't found in both sets, 'this' is not a subset
            return false;
        }
        entry = iterator.next();
    }

    return true;
};

/**
 * Checks if this set is a superset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter is not a Set.
 * @return {boolean} True if this set is a superset of the given set, false otherwise.
 */
Set.prototype.isSuperset = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isSubset(): wrong parameter type.");
    }
    if (this.size() < otherSet.size()) {
        return false;
    }
    if (Set.isEmpty(otherSet)) {
        // An empty set is subset of any other sets so 'this' is a superset
        return true;
    }

    return otherSet.isSubset(this);
};

/**
 * Checks if the current set is disjoint with another set.
 *
 * @param {Set} otherSet - The set to compare with.
 * @return {boolean} Returns true if the sets are disjoint, false otherwise.
 */
Set.prototype.isDisjoint = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isDisjoint(): wrong parameter type.");
    }

    if (Set.isEmpty(this) || Set.isEmpty(otherSet)) {
        // Two empty sets are always disjoint
        return true;
    }

    var iterator = this.values();
    var entry = iterator.next();
    while (!entry.done) {
        if (otherSet.has(entry.value)) {
            // If any element is found in both sets, they are not disjoint
            return false;
        }
        entry = iterator.next();
    }

    // If no common elements are found, they are disjoint
    return true;
};

/**
 * Checks if the current set is equal to another set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter is not a set.
 * @return {boolean} Returns true if the sets are equal, false otherwise.
 */
Set.prototype.isEqual = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isEqual(): wrong parameter type.");
    }
    if (this.size() !== otherSet.size()) {
        return false;
    }

    for (var value in this._data) {
        if (!otherSet.has(value)) {
            return false;
        }
    }

    return true;
};

/**
 * Adds all elements from the given array to the set.
 *
 * @param {Array} argArr - The array of elements to be added to the set.
 * @return {Set} - The modified set with the added elements.
 */
Set.prototype.addAll = function (argArr) {
    if (!argArr) throw new TypeError("Set.addAll(): Argument array needed.");
    for (var i = 0; i < argArr.length; i++) {
        this.add(argArr[i]);
    }
    return this;
};

/**
 * Adds each element from the given array to the set, based on the result of the callback function.
 *
 * @param {Array} argArr - The array of elements to add to the set.
 * @param {Function} callback - The callback function that determines whether each element should be added to the set. It should return a boolean value.
 * @param {Object} thisArg - Optional. The value to use as "this" when executing the callback function.
 * @throws {TypeError} If the callback is not a function.
 * @return {Set} The modified set.
 */
Set.prototype.addEach = function (argArr, callback, thisArg) { // callback returns boolean
    if (typeof callback !== "function") throw new TypeError("Set.addEach(): Missing callback function.");

    for (var i = 0; i < argArr.length; i++) {
        if (callback.call(thisArg, argArr[i], this)) {
            this.add(argArr[i]);
        };

    }
    return this;
};

/**
 * Deletes multiple values from the set.
 *
 * @param {any} value1 - The first value to be deleted.
 * @param {...any} valueN - Additional values to be deleted.
 * @return {Set} - The updated set after deleting the values.
 */
Set.prototype.deleteAll = function (value1/*, ..., valueN*/) {
    for (var i = 0; i < arguments.length; i++) {
        this.delete(arguments[i]);
    }
    return this;
};

/**
 * Deletes each element in the Set that satisfies the provided callback function.
 *
 * @param {function} callback - The function to test each element. It takes in the value of the element as a parameter.
 * @param {Object} thisArg - Optional. The value to use as 'this' when executing the callback function.
 * @return {Set} - The updated Set after removing the elements that satisfy the callback function.
 */
Set.prototype.deleteEach = function (callback, thisArg) {
    if (typeof callback !== "function") throw new TypeError("Set.deleteEach(): Missing callback function");

    for (key in this._data) {
        if (callback.call(thisArg, this._data[key], key, this)) {
            this.delete(key);
        };
    };

    return this;
};

/**
 * Join the elements of the Set into a string separated by the specified separator.
 *
 * @param {string} separator - The separator to use. If not provided, a comma will be used as the default separator.
 * @return {string} The joined string.
 */
Set.prototype.join = function (separator) {
    separator = separator !== undefined ? separator : ',';
    return this.toArray().join(separator);
};