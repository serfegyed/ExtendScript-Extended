/******************************************************************************
 *	Data testing methods 	- a possible implementation some of Extendscript's
 *							            missing functions
 *	Egyed Serf, 2023
 *
 *	Implemented functions:
 *	isBoolean()     - Tests if a passed data is Boolean
 *	isNumber()      - Tests if a passed data is Number
 *	isString()      - Tests if a passed data is String
 *  isNull()      	- Tests if a passed data is `null`
 *  isNullish()   	- Tests if a passed data is `null` or `undefined`
 *  isFalsy()     	- Checks if a value is false, null, undefined, 0, NaN, or an empty string ("")
 *  isDefined()   	- Tests if a passed data is !undefined
 *  isFunction()  	- Tests if a passed data is Function
 *  isDate()      	- Tests if a passed data is Date
 *  sameValueZero() - Determines if two values are equal using the SameValueZero algorithm
 *	isPrimitive()  	- Check if the given value is a primitive data type or null/undefined
 *  isRegExp()    	- Tests if a passed data is RegExp
 *  isIterable()    - Checks if an object is iterable.
 *  isCallable()    - Determines if a given value is callable.
 *  isLetter()      - Tests if a passed data is a letter
 *  isDigit()     	- Tests if a passed data is a digit 
 *  isArrayLike     - Checks if a given object is array-like.
 *
 *******************************************************************************/

/**
 * Checks if a given value is a boolean.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a boolean, false otherwise.
 */
if (typeof isBoolean === "undefined") {
    function isBoolean(value) {
        return typeof value === "boolean";
    };
};

/**
 * Checks if the given value is a number.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a number, otherwise false.
 */
if (typeof isNumber === "undefined") {
    function isNumber(value) {
        return typeof value === "number";
    };
};

/**
 * Checks if a value is a string.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a string, otherwise false.
 */
if (typeof isString === "undefined") {
    function isString(value) {
        return typeof value === "string";
    };
};

/**
 * Checks if the given value is null.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is null, otherwise returns false.
 */
if (typeof isNull === "undefined") {
    function isNull(value) {
        return value === null;
    };
};

/**
 * Checks if a value is null or undefined.
 *
 * @param {any} value - The value to check.
 * @return {boolean} True if the value is null or undefined, false otherwise.
 */
if (typeof isNullish === "undefined") {
    function isNullish(value) {
        return value === null || value === undefined;
    };
};

/**
 * Checks if a value is defined.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns true if the value is defined, false otherwise.
 */
if (typeof isDefined === "undefined") {
    function isDefined(value) {
        return value !== undefined;
    };
};

/**
 * Checks if a given value is a function.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns true if the value is a function, otherwise false.
 */
if (typeof isFunction === "undefined") {
    function isFunction(value) {
        return value instanceof Function;
    };
};

/**
 * Checks if a value is a Date object.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a Date object, otherwise returns false.
 */
if (typeof isDate === "undefined") {
    function isDate(date) {
        return (
            typeof date === 'object' &&
            date instanceof Date &&
            !isNaN(date.getTime())
        );
    }
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
 * Checks if a value is falsy: false, null, undefined, 0, NaN, and an empty string ("")
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns `true` if the value is falsy, `false` otherwise.
 */
if (typeof isFalsy === "undefined") {
    function isFalsy(value) {
        return !value;
    };
};


/**
 * Determines if a value is a regular expression.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns `true` if the value is a regular expression, else `false`.
 */
if (typeof isRegExp === "undefined") {
    function isRegExp(value) {
        return value instanceof RegExp;
    };
};

/**
 * Checks if an object is iterable.
 *
 * @param {any} obj - The object to check for iterability.
 * @return {boolean} Returns true if the object is iterable, false otherwise.
 */
if (typeof isIterable === "undefined") {
    function isIterable(obj) {
        if (obj === null || obj === undefined) {
            return false;
        }

        return typeof obj.length === 'number' || typeof obj.size === 'number';
    };
};

/**
 * Determines if a given value is callable.
 *
 * @param {Object} func - The function to check if callable.
 * @return {boolean} - Returns true if the function is callable, false otherwise.
 */
if (typeof isCallable === "undefined") {
    function isCallable(func) {
        return typeof func === 'function';
    };
};

/**
 * Checks if a character is a letter.
 *
 * @param {string} chr - The character to check.
 * @return {boolean} Returns true if the character is a letter, otherwise returns false.
 */
if (typeof isLetter === "undefined") {
    function isLetter(chr) {
        return /[a-zA-ZÀ-ÖØ-öø-ž]/.test(chr);
    };
};

/**
 * Checks whether the given character is a digit.
 *
 * @param {string} chr - The character to be checked.
 * @return {boolean} True if the character is a digit, false otherwise.
 */
if (typeof isDigit === "undefined") {
    function isDigit(chr) {
        return /[0-9]/.test(chr);
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
