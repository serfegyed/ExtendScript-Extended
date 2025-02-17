#include "./Set_standard.js"

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
 * @external:   Object.isEmpty(), sameValueZero(), isPrimitive(), isArrayLike() from Set_standard.js
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
    return set.size === 0;
};

/**
 * Returns an array of all values in the Set object.
 *
 * @return {Array} An array of all values.
 */
Set.prototype.toArray = function () {
    return this._data.slice(); // return a shallow copy of the data array
};

/**
 * Returns a string representation of the contents of the Set, enclosed in curly braces.
 *
 * @return {string} A string representation of the contents of the object.
 */
Set.prototype.toString = function () {
    var str = "";
    for (var i = 0; i < this._data.length; i++) {
        if (str !== "") {
            str += ", ";
        };
        str += (typeof this._data[i] === 'string') ? '"' + this._data[i] + '"' : this._data[i];
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

        } else if (isArrayLike(iterable)) {
            if (!!iterable.length) {
                for (var j = 0; j < iterable.length; j++) {
                    this.add(iterable[j]);
                }
            } else {    // to add empty array
                this.add(iterable);
            }

        } else if (iterable instanceof Set) {
            for (var k = 0; k < iterable._data.length; k++) {
                this.add(iterable._data[k])
            };

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

/**
 * Checks if any element in the Set satisfies the provided testing function.
 *
 * @param {function} callback - A function that will be called for each element in the Set.
 * @param {Object} thisArg - An optional object to use as `this` when executing the callback function.
 * @return {boolean} Returns `true` if at least one element satisfies the provided testing function, otherwise `false`.
 */
Set.prototype.some = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.some(): Missing callback function");

    for (var i = 0; i < this._data.length; i++) {
        if (callback.call(thisArg, this._data[i], i, this)) return true;
    }

    return false;
};

/**
 * Checks if every element in the set satisfies the provided callback function.
 *
 * @param {function} callback - The callback function to test each element.
 * @param {Object} thisArg - Optional. The value to use as `this` when executing the callback.
 * @returns {boolean} Returns `true` if every element in the set satisfies the callback function, otherwise `false`.
 */
Set.prototype.every = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.every(): Missing callback function");

    for (var i = 0; i < this._data.length; i++) {
        if (!callback.call(thisArg, this._data[i], i, this)) return false;
    }

    return true;
};

/**
 * Filters the elements of the set based on the provided callback function.
 *
 * @param {function} callback - The function used to filter the elements. It should accept a single parameter and return a boolean value.
 * @param {Object} thisArg - The value to use as `this` when executing the callback function.
 * @return {Set} A new Set object containing only the elements for which the callback function returns true.
 */
Set.prototype.filter = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.filter(): Missing callback function");
    var filteredSet = new Set();

    for (var i = 0; i < this._data.length; i++) {
        if (callback.call(thisArg, this._data[i])) {
            filteredSet.add(this._data[i]);
        };
    }

    return filteredSet;
};

/**
 * Maps each element of the Set to a new value using a provided callback function.
 *
 * @param {Function} callback - The callback function to apply to each element of the Set. It should accept the current element as its argument and return the new value.
 * @param {*} thisArg - Optional. The value to use as `this` when executing the callback function.
 * @throws {TypeError} If the `callback` parameter is not a function.
 * @returns {Set} A new Set with the mapped values.
 */
Set.prototype.map = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.map(): Missing callback function");
    var newSet = new Set();

    for (var i = 0; i < this._data.length; i++) {
        newSet.add(callback.call(thisArg, this._data[i]));
    }

    return newSet;
};

/**
 * Finds the first element in the Set that satisfies the provided testing function.
 *
 * @param {function} callback - The testing function to call on each element.
 * @param {Object} thisArg - Object to use as `this` when executing the callback.
 * @return {*} The first element in the Set that satisfies the provided testing function, or undefined if no such element is found.
 */
Set.prototype.find = function (callback, thisArg) {
    if (typeof callback !== "function")
        throw new TypeError("Set.find(): Missing callback function");

    for (var i = 0; i < this._data.length; i++) {
        if (callback.call(thisArg, this._data[i])) {
            return this._data[i];
        };
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

    if (this.size === 0 && initialValue === undefined)
        throw new TypeError("Set.reduce(): Empty Set without an initial value");

    var accumulator = initialValue !== undefined ? initialValue : this._data[0];

    for (var i = 0; i < this._data.length; i++) {
        // Check if the types of the accumulator and currentValue are different
        if (typeof accumulator !== typeof this._data[i]) {
            throw new TypeError(
                "Set.reduce(): Type mismatch in Set.reduce(). All elements must be of the same type."
            );
        }
        accumulator = callback.call(this, accumulator, this._data[i]);
    };

    return accumulator;
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

    var originalData = this.toArray();
    // Make a copy to avoid modification during iteration
    for (var i = 0; i < originalData.length; i++) {
        var value = originalData[i];
        if (callback.call(thisArg, value, i, this)) {
            this.delete(value);
        }
    }
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