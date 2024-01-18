#include ".\\Set_standard.js";
#include ".\\external.js";

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
 * * Non-standard methods for the Set object:
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
 * @external:   Object.isEmpty(), sameValueZero(), isPrimitive()
 */

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