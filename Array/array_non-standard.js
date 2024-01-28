/**
 *  
 * ExtendScript-Array - Non-standard methods
 * 
 */

/**
 * Clears the array by setting its length to 0.
 *
 * @return {Array} The cleared array.
 */
if (!Array.prototype.clear) {
    Array.prototype.clear = function () {
        this.length = 0;
        return this;
    };
};

/**
 * Removes all falsy values from the array. ("false", "null", "0", `""`, "undefined" and "NaN")
 *
 * @return {Array} A new array with all falsy values removed.
 * !dependencies: filter()
 */

if (!Array.prototype.compact) {
    #include ".\\filter.js"
    Array.prototype.compact = function () {
        return this.filter(Boolean);
    };
};

/**
 * Returns the first element of the array.
 *
 * @return {any} The first element of the array.
 */
if (!Array.prototype.first) {
    Array.prototype.first = function () {
        return this[0];
    };
};

/**
 * Finds the index of the given element in the array and returns the index
 * of the element that comes after it. If the element is not found, it
 * returns -1.
 * Does not check whether there is actually a next element.
 *
 * @param {any} element - The element to find the index of.
 * @return {number} The index of the element that comes after the given
 * element, or -1 if the element is not found.
 * !dependencies: indexOf()
 */
if (!Array.prototype.indexAfter) {
    #include ".\\indexOf.js"
    Array.prototype.indexAfter = function (element/*, fromIndex*/) {
        // Check if fromIndex is out of bounds
        var fromIndex = Math.floor(arguments[1]) || 0;
        if (Math.abs(fromIndex) > this.length) return -1;
        fromIndex = fromIndex < 0 ? (fromIndex += this.length) : fromIndex;

        // Find the index of the element starting from fromIndex
        const index = this.indexOf(element, fromIndex);

        // Check if the element is found and not the last element
        if (index >= 0 && index < this.length - 1) {
            return index + 1;
        }

        return -1;
    };
};

/**
 * Inserts an element at the specified index in the array.
 *
 * @param {any} elem - The element to be inserted.
 * @param {number} index - The index at which the element should be inserted.
 * @return {Array} - A new array with the element inserted at the specified index.
 */
if (!Array.prototype.insert) {
    Array.prototype.insert = function (elem, index) {
        if (elem === null) throw new TypeError();
        index = index < 0 ? this.length + index : index;
        if (index < 0 || index >= this.length) throw new RangeError();
        var arr = this.slice();
        arr.splice(index, 0, elem);
        return arr;
    };
};

/**
 * Checks if an array is empty.
 *
 * @param {Array} arr - The array to be checked.
 * @return {boolean} Returns true if the array is empty, false otherwise.
 */
if (!Array.isEmpty) {
    Array.isEmpty = function (arr) {
        if (arr.__class__ !== "Array")
            throw new TypeError(arr.toString() + " is not an Array");
        return arr.length === 0 ? true : false;
    };
};

/**
 * Check if the given array is sorted using the provided compare function, or a default compare function for numbers and strings.
 *
 * @param {Array} array - The array to be checked for sorting.
 * @param {Function} [compareFunction] - The function used to compare elements. If not provided, a default compare function is used.
 * @return {boolean} Returns true if the array is sorted, otherwise returns false.
 */
if (!Array.isSorted) {
    Array.isSorted = function (array, compareFunction) {
        if (!Array.isArray(array)) {
            throw new TypeError('The provided value is not an array.');
        }

        // Default compare function for numbers and strings
        if (!compareFunction) {
            compareFunction = function (a, b) {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            };
        }

        for (var i = 0; i < array.length - 1; i++) {
            if (compareFunction(array[i], array[i + 1]) > 0) {
                return false; // The array is not sorted
            }
        }

        return true; // The array is sorted
    };
};

/**
 * Returns the last element of the array.
 *
 * @return {*} The last element of the array.
 */
if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
};

/**
 * Finds the maximum value in an array based on a salient property or the element itself.
 *
 * @param {string|function} salient - A function or string representing the property to compare for each element.
 * @return {*} The maximum value in the array.
 * @example
 *     > var people = [{'name': 'Alfred'}, {'name': 'Zed'}];
 *     > people.max(function (obj) {return obj.name});
 *     {'name': 'Zed'}
 */
if (!Array.prototype.max) {
    Array.prototype.max = function (salient) {
        var mapper;
        if (salient && typeof salient === "string") {
            mapper = function (obj) {
                return obj[salient];
            };
        } else {
            mapper = salient || function (obj) {
                return obj;
            };
        }

        var maxValue = this[0];
        for (var i = 1; i < this.length; i++) {
            if (mapper(this[i]) > mapper(maxValue)) {
                maxValue = this[i];
            }
        }

        return maxValue;
    };
};
/**
 * Merges the elements of the _sorted_ array with another _array_, using the provided compare function.
 * If any of them unsorted, the result will be unpredictable.
 * @param {Array} arrayToMerge - The array to merge with the original array.
 * @param {Function} [compareFunc] - The function used to compare elements during the merge.
 * @throws {TypeError} Throws a TypeError if the provided value is not an array or if the compare function is not a function.
 * @returns {Array} The original array with the merged result.
 */

if (!Array.prototype.merge) {
    #include ".\\isArray.js"
    Array.prototype.merge = function (arrayToMerge, compareFunc) {
        if (!Array.isArray(arrayToMerge)) {
            throw new TypeError('The provided value is not an array.');
        }

        var compare = compareFunc || function (a, b) {
            if (a === undefined || b === undefined) {
                return (a === undefined) - (b === undefined);
            } else {
                return a.toString().localeCompare(b.toString());
            }
        };
        if (typeof (compare) !== 'function') {
            throw new TypeError('The provided compare function is not a function.');
        }

        var i = 0, j = 0, k = 0;
        var result = new Array(this.length + arrayToMerge.length);

        while (i < this.length && j < arrayToMerge.length) {
            result[k++] = compare(this[i], arrayToMerge[j]) < 0 ? this[i++] : arrayToMerge[j++];
        }

        while (i < this.length) {
            result[k++] = this[i++];
        }

        while (j < arrayToMerge.length) {
            result[k++] = arrayToMerge[j++];
        }

        this.length = 0;
        Array.prototype.push.apply(this, result);

        return this;
    };
};

/**
 * Finds the minimum value in an array.
 *
 * @param {function|string} salient - A function or string representing the property to compare for each element.
 * @return {*} The minimum value in the array.
 */
if (!Array.prototype.min) {
    Array.prototype.min = function (salient) {
        var mapper;
        if (salient && typeof salient === "string") {
            mapper = function (obj) {
                return obj[salient];
            };
        } else {
            mapper = salient || function (obj) {
                return obj;
            };
        }

        var minValue = this[0];
        for (var i = 1; i < this.length; i++) {
            if (mapper(this[i]) < mapper(minValue)) {
                minValue = this[i];
            }
        }

        return minValue;
    };
};

/**
 * Plucks the specified property from each item in the array.
 *
 * @param {string} name - The name of the property to pluck.
 * @return {Array} An array containing the values of the specified property from each item.
 * @example
 *     > var people = [{'name': 'Alfred', age: 33}, {'name': 'Zed', age: 45}];
 *     > people.pluck('age');
 *     [33,45]
 *     > people.pluck('age').sum();
 *     78
 *     > people.sum('age');
 *     78
 *     > people.sum(function (person) { return person.age });
 *     78
 * !dependency map()
 */
if (!Array.prototype.pluck) {
    #include ".\\map.js"
    Array.prototype.pluck = function (name) {
        return this.map(function (item) {
            return item[name];
        });
    };
};

/**
 * Adds a new method to the Array prototype that returns a random element from the array.
 *
 * @return {*} The randomly selected element from the array.
 */
if (!Array.prototype.random) {
    Array.prototype.random = function () {
        return this[Math.floor(Math.random() * this.length)];
    };
};

/**
 * Rejects elements in the array that satisfy the provided testing function.
 *
 * @param {Function} fun - The testing function.
 * @param {*} [thisp] - Optional. The value to use as `this` when executing the testing function.
 * @return {Array} - A new array with the elements that do not satisfy the testing function.
 */
if (!Array.prototype.reject) {
    Array.prototype.reject = function (callback /*, thisArg*/) {
        var len = this.length;
        if (typeof callback !== "function")
            throw new TypeError("Callback must be a function");

        var res = [];
        var thisArg = thisArg || undefined;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (!callback.call(thisArg, val, i, this)) res[res.length] = val;
            }
        }
        return res;
    };
};

/**
 * Removes an element from the array at the specified index.
 *
 * @param {number} index - The index of the element to remove.
 * @return {any} The removed element.
 */
if (!Array.prototype.remove) {
    Array.prototype.remove = function (index) {
        // Check if the array is empty
        if (this.length === 0) {
            return undefined;
        }

        // Check if the index is a number
        if (typeof index !== 'number') {
            throw new TypeError('Index must be a number');
        }

        index = index < 0 ? this.length + index : index;
        if (index < 0 || index >= this.length) throw new RangeError();
        return this.splice(index, 1)[0];
    };
};

/**
 * Rotates the elements of an array by the specified number of steps.
 *
 * @param {number} step - The number of steps to rotate the array. Positive values rotate the array to the right, negative values rotate it to the left.
 * @return {Array} - The rotated array.
 */
if (!Array.prototype.rotate) {
    Array.prototype.rotate = function (step) {
        var length = this.length;
        var effectiveStep = ((step % length) + length) % length;
        var rotated = this.slice(effectiveStep).concat(
            this.slice(0, effectiveStep)
        );
        return rotated;
    };
};

/**
 * Calculates the sum of the elements in an array.
 *
 * @param {string|Function} salient - A function or string representing the property to compare for each element.
 *        If a string, the elements are mapped using the property value.
 *        If a function, the elements are mapped using the function's return value.
 *        If not provided, the elements themselves are used.
 * @return {number} The sum of the mapped elements in the array.
 * @example
 *     > var persons = [
 *     ... {'name': 'Abraham', 'children': 5},
 *     ... {'name': 'Joe', 'children': 3},
 *     ... {'name': 'Zed', 'children': 0}
 *     ... ];
 *     > persons.sum('children');
 *     8
 *! dependency map(), reduce()
 */
if (!Array.prototype.sum) {
    #include ".\\map.js"
    #include ".\\reduce.js"
    Array.prototype.sum = function (salient) {
        if (salient && typeof salient === "string") {
            var mapper = function (obj) {
                return obj[salient];
            };
        } else {
            var mapper = salient || function (obj) {
                return obj;
            };
        }
        var features = Array.prototype.map.call(this, mapper);
        return Array.prototype.reduce.call(features, function (a, b) {
            return a + b;
        });
    };
};

/**
 * A function that returns an array with only unique elements.
 * @param {function} [callback] - An optional function that is used to generate the keys used for checking uniqueness.
 * @returns {array} - An array with only unique elements.
 */
if (!Array.prototype.unique) {
    Array.prototype.unique = function (callback, thisArg) {
        var len = this.length;
        var result = [];
        var keys = {};
        for (var i = 0; i < len; i++) {
            var key =
                (callback && callback.call(thisArg, this[i], i, this)) || this[i]; // generate the key
            if (!(key in keys)) {
                // check if the key already exists in the keys object
                keys[key] = true; // add the key to the keys object
                result.push(this[i]); // add the element to the result array
            }
        }
        return result;
    };
};
