/**
 *  
 * ExtendScript-Array - Standard methods
 * 
 */

/**
 * Retrieves the element at the specified index of the array.
 *
 * @param {number} index - The index of the element to retrieve.
 * @return {*} - The element at the specified index, or undefined if the index is out of range.
 */
if (!Array.prototype.at) {
    Array.prototype.at = function (index) {
        index = Math.floor(index) || 0;
        // Check if index is a number and not NaN
        if (typeof index !== 'number' || isNaN(index)) {
            throw new TypeError('Index must be a valid number');
        }
        // Check range
        if (index < -this.length || index >= this.length) {
            return undefined;
        }

        // Adjust negative index
        index = index < 0 ? this.length + index : index;

        return this[index];
    };
}

/**
 * Copies a sequence of array elements within the array to the position starting
 * at the specified target index. The copy is taken from the index positions
 * between the start and end arguments. The end parameter is optional and, if
 * omitted, the copy is made to the end of the array. Returns the modified array.
 *
 * @param {number} target - Target index position to which to copy the elements.
 * @param {number} start - The index position from which to start copying elements.
 * @param {number} [end] - The index position up to which to copy elements.
 * @return {Array} The modified array.
 */
if (!Array.prototype.copyWithin) {
    Array.prototype.copyWithin = function (target, start, end) {
        var len = this.length >>> 0;
        var to = target >> 0;
        var from = start >> 0;
        var last = end === undefined ? len : end >> 0;

        // Normalize negative indices
        if (to < 0) to = Math.max(len + to, 0);
        if (from < 0) from = Math.max(len + from, 0);
        if (last < 0) last = Math.max(len + last, 0);

        // Ensure indices are within range
        to = Math.min(Math.max(to, 0), len);
        from = Math.min(Math.max(from, 0), len);
        last = Math.min(Math.max(last, 0), len);

        // Compute the number of elements to copy
        var count = Math.min(last - from, len - to);

        // Determine direction of copy
        var direction = from < to && to < from + count ? -1 : 1;

        if (direction === -1) {
            from += count - 1;
            to += count - 1;
        }

        // Copy elements
        while (count > 0) {
            if (from in this) this[to] = this[from];
            else delete this[to];

            from += direction;
            to += direction;
            count--;
        }

        return this;
    };
};

/**
 * Returns an iterator object that contains the key/value pairs for each index of the array.
 *
 * @return {Object} An iterator object with a `next` method.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries
 */
if (!Array.prototype.entries) {
    Array.prototype.entries = function () {
        var index = 0;
        var length = this.length;
        var arr = this;

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
                        value: [index, arr[index++]],
                    };
            },
        };
        return iterator;
    };
};

/**
 * A callback function is executed on each element in the array, until it finds an element for which the callback returns a falsy value. If such an element is found, the method immediately returns false. Otherwise, if the callback returns a truthy value for all elements, the method returns true.
 *
 * @param {function} callback - The function to execute on each element.
 * @param {any} [thisArg] - An object to which the this keyword can refer in the callback function. If thisArg is omitted, undefined is used as the this value.
 * @return {boolean} - Returns true if the callback returns a truthy value for all elements in the array; otherwise, returns false.
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
 */
if (!Array.prototype.every) {
    Array.prototype.every = function (callback /*, thisArg*/) {
        var len = this.length;
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = arguments[1] || undefined;

        for (var i = 0; i < len; i++) {
            if (i in this && !callback.call(thisArg, this[i], i, this))
                return false;
        }
        return true;
    };
};

/**
 * Fill all the elements of an array with a static value from a start index to an end index (excluding the end index).
 *
 * @param {any} value - The value to fill the array with.
 * @param {number} start - The index to start filling the array from. If not provided, default is 0.
 * @param {number} end - The index to stop filling the array at. If not provided, default is the length of the array.
 * @return {Array} - The modified array with filled elements.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
 */
if (!Array.prototype.fill) {
    Array.prototype.fill = function (value /*, start, end*/) {
        var len = this.length;

        // Handle start parameter
        var start = arguments[1];
        start = start === undefined ? 0 : Math.floor(start);
        if (start < 0) {
            start = Math.max(len + start, 0);
        } else {
            start = Math.min(start, len);
        }

        // Handle end parameter
        var end = arguments[2];
        end = end === undefined ? len : Math.floor(end);
        if (end < 0) {
            end = Math.max(len + end, 0);
        } else {
            end = Math.min(end, len);
        }

        // If start is greater than or equal to end, do nothing
        if (start >= end) {
            return this;
        }

        // Fill the array
        for (var i = start; i < end; i++) {
            this[i] = value;
        }

        return this;
    };
};

/**
 * Filters the elements of an array based on a provided callback function.
 *
 * @param {function} callback - The function used to test each element of the array. Should return a boolean value.
 * @return {Array} - A new array with the elements that pass the test.
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
 */
if (!Array.prototype.filter) {
    Array.prototype.filter = function (callback /*, thisArg*/) {
        var len = this.length;
        if (typeof callback !== "function")
            throw new TypeError("Callback must be a function");

        var res = [];
        var thisArg = thisArg || undefined;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i];
                if (callback.call(thisArg, val, i, this)) res[res.length] = val;
            }
        }
        return res;
    };
};

/**
 * Finds the first element in the array that satisfies the provided testing function.
 *
 * @param {Function} callback - Function to execute on each value in the array.
 * @param {*} [thisArg] - Object to use as `this` when executing the callback.
 * @return {*} The first element in the array that satisfies the testing function, or `undefined` if no such element is found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */
if (!Array.prototype.find) {
    Array.prototype.find = function (callback /*, thisArg*/) {
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = arguments[1] || undefined;

        for (var i = 0; i < this.length; i++) {
            if (callback.call(thisArg, this[i], i, this)) return this[i];
        }
        return undefined;
    };
};

/**
 * Finds the index of the first element in the array that satisfies the provided testing function.
 *
 * @param {function} callback - A function that is called for each element in the array.
 * @param {any} thisArg - An optional object to which the this keyword can refer in the callback function.
 * @return {number} The index of the first element in the array that satisfies the provided testing function. If no element satisfies the function, -1 is returned.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
 */
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (callback /*, thisArg*/) {
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = arguments[1] || undefined;

        for (var i = 0; i < this.length; i++) {
            if (callback.call(thisArg, this[i], i, this)) return i;
        }
        return -1;
    };
};

/**
 * Finds the last element that satisfies the provided testing function.
 *
 * @param {Function} callback - The testing function.
 * @param {*} [thisArg] - An optional object to use as the `this` value when executing the callback.
 * @return {*} - The value of the last element that satisfies the testing function, or `undefined` if no such element is found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast
 */
if (!Array.prototype.findLast) {
    Array.prototype.findLast = function (callback /*, thisArg*/) {
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = arguments[1] || undefined;

        for (var i = this.length - 1; i >= 0; i--) {
            if (callback.call(thisArg, this[i], i, this)) return this[i];
        }
        return undefined;
    };
};

/**
 * Find the last index in the array that satisfies the provided testing function.
 *
 * @param {function} callback - The testing function to execute on each element.
 * @param {any} [thisArg] - The value to use as `this` when executing the callback.
 * @return {number} The index of the last element in the array that satisfies the testing function; otherwise, -1.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex
 */
if (!Array.prototype.findLastIndex) {
    Array.prototype.findLastIndex = function (callback /*, thisArg*/) {
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = arguments[1] || undefined;

        for (var i = this.length - 1; i >= 0; i--) {
            if (callback.call(thisArg, this[i], i, this)) return i;
        }
        return -1;
    };
};

/**
 *  Returns a new array with all sub-array elements concatenated up to the specified depth.
 * @param {number} depth - Optional. The depth level specifying how deep a nested array structure should be flattened.
 * @returns {Array} A new array with the sub-array elements concatenated up to the specified depth.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 */
if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth) {
        depth = typeof depth === "undefined" ? 1 : depth;

        function flatten(arr, currentDepth) {
            var result = [];
            for (var i = 0; i < arr.length; i++) {
                if (i in arr) {
                    if (arr[i] instanceof Array && currentDepth > 0) {
                        result = result.concat(flatten(arr[i], currentDepth - 1));
                    } else {
                        result.push(arr[i]);
                    }
                }
            }
            return result;
        }

        return flatten(this, depth);
    };
};

/**
 * Maps each element to an array using a callback function and then flattens the resulting array.
 *
 * @param {function} callback - The function used to map each element of the array
 * @return {Array} A new array with the mapped and flattened elements
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
 * ! Dependency: flat()
 */
if (!Array.prototype.flatMap) {
    #include ".\\flat.js"
    Array.prototype.flatMap = function (callback) {
        callback = callback || function (x) {
            return x;
        };
        return Array.prototype.map.call(this, callback).flat();
    };
};

/**
 * @desc Executes a provided function once per array element.
 * @param {Function} callback
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback /*, thisArg*/) {
        var len = this.length;
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = arguments[1] || undefined;

        for (var i = 0; i < len; i++) {
            if (i in this) callback.call(thisArg, this[i], i, this);
        };
    };
};

/**
 * @desc Implements the Array.from() method, which creates a new, shallow-copied Array instance
 *       from an array-like or iterable object.
 * @param {ArrayLike} arrayLike - An array-like or iterable object to convert to an array.
 * @param {Function}  [mapFn] - A map function to call on every element of the array.
 * @param {*} [thisArg] - Value to use as `this` when executing `mapFn`.
 * @return {Array} A new Array instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 */
if (!Array.from) {
    Array.from = function (arrayLike /*, mapFunction, thisArg*/) {
        if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        var result = [];
        var length = arrayLike.length;
        if (typeof length !== "number") {
            throw new TypeError('Array.from requires an array-like object with a length property');
        }

        var mapFunction = arguments[1];
        var thisArg = arguments[2];
        for (var i = 0; i < length; i++) {
            var element = arrayLike[i];
            if (mapFunction) {
                result.push(mapFunction.call(thisArg, element, i));
            } else {
                result.push(element);
            }
        }
        return result;
    };
};

/**
 * Checks if the array includes a certain element, returning true or false as appropriate.
 *
 * @param {type} element - The element to search for in the array.
 * @param {type} from - The index to start the search from. (optional)
 * @return {type} Returns true if the element is found, otherwise false.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 */
if (!Array.prototype.includes) {
    Array.prototype.includes = function (element /*, from*/) {
        var from = Math.floor(arguments[1]) || 0;
        from = from < 0 ? from + this.length : from;
        from = from < 0 ? 0 : from;
        if (from >= this.length) return false;

        // Handle NaN separately
        if (typeof element === "number" && isNaN(element)) {
            for (var i = from; i < this.length; i++) {
                if (isNaN(this[i])) {
                    return true;
                }
            }
            return false;
        }
        // Any other tan NaN
        return this.indexOf(element, from) !== -1;
    };
};

/**
 * Finds the index of the first occurrence of a specified element in an array.
 *
 * @param {any} elem - The element to locate in the array.
 * @param {number} [from] - The index at which to start the search. If not provided, the search starts from index 0.
 * @return {number} - The index of the first occurrence of the specified element in the array, or -1 if not found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elem /*, from*/) {
        var from = Math.floor(arguments[1]) || 0;
        if (Math.abs(from) > this.length) return -1;
        from = from < 0 ? (from += this.length) : from;
        for (var i = from; i < this.length; i++) {
            if (this[i] === elem) return i;
        }
        return -1;
    };
};

/**
 * Checks if the given argument is an array.
 *
 * @param {any} arg - The argument to be checked.
 * @return {boolean} Returns true if the argument is an array, false otherwise.
 */
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return arg instanceof Array;
    };
};

/**
 * Returns an iterator object that contains the keys for each index in the array.
 *
 * @return {object} An iterator object with a `next` method that returns an object with a `done` property (a boolean indicating if the iterator is done) and a `value` property (the current index value).
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys
 */
if (!Array.prototype.keys) {
    Array.prototype.keys = function () {
        var index = 0;
        var length = this.length;
        var arr = this;

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
                        value: index++,
                    };
            },
        };
        return iterator;
    };
};

/**
 * Find the last index of a given element in the array.
 *
 * @param {any} element - The element to search for.
 * @param {number} [from] - The index to start searching from. If not provided, the search starts from the last element.
 * @return {number} The index of the last occurrence of the element in the array, or -1 if the element is not found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
 */
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (element /*, from*/) {
        var from = arguments[1];
        from = from === null ? (from = this.length - 1) : (from = Math.floor(from));
        from =
            from < 0
                ? Math.max(0, from + this.length)
                : Math.min(this.length - 1, from);

        for (var i = from; i >= 0; i--) {
            if (this[i] === element) {
                return i;
            }
        }
        return -1;
    };
};

/**
 * Implements the map function for the Array prototype.
 *
 * @param {function} callback - The function to execute on each element of the array.
 * @param {Object} [thisArg] - Object to use as `this` when executing the callback.
 * @return {Array} - A new array with the results of calling the callback function on each element.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        var len = this.length;
        if (typeof callback !== "function") throw new TypeError();
        var thisArg = thisArg || undefined;

        var res = new Array(len);
        for (var i = 0; i < len; i++) {
            if (i in this) res[i] = callback.call(thisArg, this[i], i, this);
        }
        return res;
    };
};

/**
 * Creates a new array instance with a variable number of elements.
 *
 * @param {any} arguments - The elements to include in the array.
 * @return {Array} The newly created array instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
 */
if (!Array.of) {
    Array.of = function () {
        var constructor = this;
        var items = [].slice.call(arguments);
        var arrayLike =
            typeof constructor === "function"
                ? Object(new constructor(items.length))
                : new Array(items.length);
        for (var index = 0; index < items.length; index++) {
            arrayLike[index] = items[index];
        }
        arrayLike.length = items.length;
        return arrayLike;
    };
};

/**
 * Reduces the array to a single value by applying a callback function to each element.
 *
 * @param {function} callback - The function to execute on each element of the array.
 * @param {*} initialValue - The initial value for the accumulator.
 * @return {*} The final value of the accumulator.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 */
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback, initialValue) {
        if (typeof callback !== "function")
            throw new TypeError("Callback must be a function");
        var array = this;
        var len = array.length;
        if (len === 0 && initialValue === undefined)
            throw new TypeError("Empty array without an initial value");

        var accumulator = initialValue !== undefined ? initialValue : array[0];
        var startIndex = initialValue !== undefined ? 0 : 1;

        for (var i = startIndex; i < len; i++) {
            if (i in array) {
                accumulator = callback.call(undefined, accumulator, array[i], i, array);
            }
        }

        if (accumulator === undefined)
            throw new TypeError("Reducer function returns an invalid value");

        return accumulator;
    };
};

/**
 * Reduce the array from right to left using a callback function.
 *
 * @param {function} callback - The function to execute on each element in the array.
 *                             It takes four arguments: accumulator, current element, current index, and the array itself.
 * @param {*} initialValue - The initial value of the accumulator. Optional.
 * @return {*} - The final value of the accumulator.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
 */
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function (callback, initialValue) {
        if (typeof callback !== "function")
            throw new TypeError("Callback must be a function");
        var array = this;
        var len = array.length;
        if (len === 0 && initialValue === undefined)
            throw new TypeError("Empty array without an initial value");

        var accumulator =
            initialValue !== undefined ? initialValue : array[len - 1];
        var endIndex = initialValue !== undefined ? len - 1 : len - 2;

        for (var i = endIndex; i >= 0; i--) {
            if (i in array) {
                accumulator = callback.call(undefined, accumulator, array[i], i, array);
            }
        }

        if (accumulator === undefined)
            throw new TypeError("Reducer function returns an invalid value");

        return accumulator;
    };
};

/**
 * Implements the `some` method for the Array prototype.
 *
 * @param {function} callback - A function to test each element of the array.
 * @param {object} thisArg - An object to use as `this` when executing the callback.
 * @return {boolean} Returns `true` if the callback function returns a truthy value for at least one element, otherwise `false`.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
 */
if (!Array.prototype.some) {
    Array.prototype.some = function (callback, thisArg) {
        var len = this.length;
        if (typeof callback !== "function") throw new TypeError();
        thisArg = thisArg || undefined;

        for (var i = 0; i < len; i++) {
            if (i in this && callback.call(thisArg, this[i], i, this)) return true;
        }
        return false;
    };
};

/**
 * Reverses the order of the elements in an array.
 *
 * @return {Array} A new array with the elements in reverse order.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed
 */
if (!Array.prototype.toReversed) {
    #include "..\\..\\Object\\Lib\\deepCopy.js"
    Array.prototype.toReversed = function () {
        var copy = Object.deepCopy(this);
        return Array.prototype.reverse.call(copy);
    };
};

/**
 * Sorts the array in ascending order using the provided compare function, if any.
 *
 * @param {function} compareFunc - Optional. A function that defines the sort order.
 * @return {Array} A new array with the elements sorted in ascending order.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
 */
if (!Array.prototype.toSorted) {
    #include "..\\..\\Object\\Lib\\deepCopy.js"
    Array.prototype.toSorted = function (compareFunc) {
        var copy = Object.deepCopy(this);
        if (compareFunc) {
            return Array.prototype.sort.call(copy, compareFunc);
        } else {
            return Array.prototype.sort.call(copy);
        };
    };
};

/**
 * Splices elements from the array at the specified index.
 *
 * @param {number} index - The index at which to start splicing.
 * @param {number} deleteCount - The number of elements to remove.
 * @param {any} item1, item2, itemN - The items to insert at the specified index.
 * @return {Array} - A new array with the spliced elements.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced
 */
if (!Array.prototype.toSpliced) {
    #include "..\\..\\Object\\Lib\\deepCopy.js"
    Array.prototype.toSpliced = function (index /*, deleteCount, item1, item2, itemN*/) {
        var copy = Object.deepCopy(this);
        var args = Array.prototype.slice.call(arguments);
        Array.prototype.splice.apply(copy, args);
        return copy;
    };
};

/**
 * Converts an array to a string representation.
 *
 * @return {string} The string representation of the array.
 */
Array.prototype.toString = function () {
    var arr = this;
    var result = "";
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (result !== "") {
                result += ", ";
            };
            result += (typeof arr[i] === 'string') ? '"' + arr[i] + '"' : arr[i];
        };
    };
    return "[" + result + "]";
};

/**
 * Returns an iterator object that contains the values of the array.
 *
 * @return {object} An iterator object with a `next` method that returns the next value in the array.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values
 */
if (!Array.prototype.values) {
    Array.prototype.values = function () {
        var index = 0;
        var length = this.length;
        var arr = this;

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
};

/**
 * Updates an element at the specified index in the array with a new value.
 *
 * @param {number} index - The index of the element to be updated.
 * @param {any} value - The new value to be assigned to the element.
 * @return {Array} - A new array with the updated element.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with
 */
if (!Array.prototype.with) {
    #include "..\\..\\Object\\Lib\\deepCopy.js"
    Array.prototype.with = function (index, value) {
        var copy = Object.deepCopy(this);
        copy[index] = value;
        return copy;
    };
};


