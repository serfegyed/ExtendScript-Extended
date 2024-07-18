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

/**
 * Checks if a given object is array-like.
 * An object is considered array-like if it has a numeric 'length' property
 * and indexed elements.
 *
 * @param {any} obj - The object to check.
 * @return {boolean} Returns true if the object is array-like, otherwise false.
 */
if (typeof isArrayLike === "undefined") {
    function isArrayLike(obj) {
        if (!obj && typeof obj !== 'string') return false; // Checks for null or undefined, but allows strings
        return typeof obj === 'string' || (
            typeof obj.length === 'number' &&
            obj.length >= 0 &&
            (obj.length === 0 || (obj.length - 1) in obj)
        );
    };
};
