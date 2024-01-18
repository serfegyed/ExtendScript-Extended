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
 * Checks if the given argument is an array.
 *
 * @param {any} arg - The argument to be checked.
 * @return {boolean} Returns true if the argument is an array, false otherwise.
 */
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return arg === undefined || arg === null ? false : arg.__class__ === "Array";
    };
};

/**
 * Checks if an object is empty.
 *
 * @param {Object} obj - The object to check.
 * @return {boolean} Returns true if the object is empty, false otherwise.
 */
if (!Object.isEmpty) {
    Object.isEmpty = function (obj) {
        if (obj.__class__ !== "Object") throw new TypeError(obj.toString() + " is not an Object");
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    };
};

/**
 * Determines if two values are equal using the SameValueZero algorithm.
 *
 * @param {any} x - The first value to compare.
 * @param {any} y - The second value to compare.
 * @return {boolean} Returns true if the values are equal, false otherwise.
 */
if (typeof sameValueZero === "undefined") {
    function sameValueZero(x, y) {
        if (typeof x === "number" && typeof y === "number") {
            // x and y are equal (may be -0 and 0) or they are both NaN
            return x === y || (x !== x && y !== y);
        }
        return x === y;
    };
};

/**
 * Check if the given value is a primitive data type or null/undefined.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a primitive or null/undefined, otherwise returns false.
 */
if (typeof isPrimitive === "undefined") {
    function isPrimitive(value) {
        // Check if the value is null or undefined
        if (value === null || value === undefined) {
            return true;
        }

        // Check if the value is a primitive data type (string, number, or boolean)
        return typeof value !== "object";
    };
};