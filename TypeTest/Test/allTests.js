/***************************************************************************/

/**
 * Simple assertion function for testing
 * @param {boolean} condition - The condition to test.
 * @param {string} message - Message to display on test failure.
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
};

// Function to run a test block and catch errors
function runTest(testFunc, testName) {
    try {
        testFunc();
        $.writeln(testName + " tests passed.");
    } catch (e) {
        $.writeln("Error in " + testName + " tests: " + e.message);
    }
}

// Test isBoolean function
runTest (function () {
    assert(isBoolean(true) === true, "True should be recognized as a boolean");
    assert(isBoolean(false) === true, "False should be recognized as a boolean");
    assert(isBoolean(0) === false, "Number 0 should not be recognized as a boolean");
},"isBoolean");

// Test isNumber function
runTest (function () {
    assert(isNumber(42) === true, "42 should be recognized as a number");
    assert(isNumber(NaN) === true, "NaN should be recognized as a number");
    assert(isNumber("42") === false, "String '42' should not be recognized as a number");
},"isNumber");

// Test isString function
runTest (function () {
    assert(isString("Hello") === true, "'Hello' should be recognized as a string");
    assert(isString(42) === false, "Number 42 should not be recognized as a string");
    assert(isString(true) === false, "Boolean true should not be recognized as a string");
},"isString");

// Test isNull function
runTest(function() {
    assert(isNull(null) === true, "null should be recognized as null");
    assert(isNull(undefined) === false, "undefined should not be recognized as null");
    assert(isNull(0) === false, "0 should not be recognized as null");
    assert(isNull('') === false, "Empty string should not be recognized as null");
}, "isNull");

// Test isNullish function
runTest(function() {
    assert(isNullish(null) === true, "null should be recognized as nullish");
    assert(isNullish(undefined) === true, "undefined should be recognized as nullish");
    assert(isNullish(0) === false, "0 should not be recognized as nullish");
    assert(isNullish('') === false, "Empty string should not be recognized as nullish");
}, "isNullish");

// Test isFalsy function
runTest(function() {
    assert(isFalsy(false) === true, "false should be recognized as falsy");
    assert(isFalsy(null) === true, "null should be recognized as falsy");
    assert(isFalsy(undefined) === true, "undefined should be recognized as falsy");
    assert(isFalsy(0) === true, "0 should be recognized as falsy");
    assert(isFalsy(NaN) === true, "NaN should be recognized as falsy");
    assert(isFalsy('') === true, "Empty string should be recognized as falsy");
    assert(isFalsy('text') === false, "Non-empty string should not be recognized as falsy");
}, "isFalsy");

// Test isDefined function
runTest(function() {
    assert(isDefined(undefined) === false, "undefined should not be recognized as defined");
    assert(isDefined(null) === true, "null should be recognized as defined");
    assert(isDefined(0) === true, "0 should be recognized as defined");
    assert(isDefined('') === true, "Empty string should be recognized as defined");
}, "isDefined");

// Test isFunction function
runTest(function() {
    assert(isFunction(function() {}), "Function should be recognized as a function");
    assert(!isFunction({}), "Object should not be recognized as a function");
    assert(!isFunction("function"), "String 'function' should not be recognized as a function");
    assert(!isFunction(123), "Number should not be recognized as a function");
}, "isFunction");

// Test isDate function
runTest(function() {
    assert(isDate(new Date()) === true, "Valid Date object should be recognized as Date");
    assert(isDate(new Date('invalid')) === false, "Invalid Date object should not be recognized as Date");
    assert(isDate('2021-01-01') === false, "String should not be recognized as Date");
    assert(isDate(null) === false, "null should not be recognized as Date");
}, "isDate");

// Test sameValueZero function
runTest(function() {
    assert(sameValueZero(0, 0) === true, "0 and 0 should be equal (SameValueZero)");
    assert(sameValueZero(NaN, NaN) === true, "NaN and NaN should be equal (SameValueZero)");
    assert(sameValueZero(0, -0) === true, "0 and -0 should be equal (SameValueZero)");
    assert(sameValueZero('text', 'text') === true, "Identical strings should be equal (SameValueZero)");
    assert(sameValueZero(1, '1') === false, "Number and string should not be equal (SameValueZero)");
}, "sameValueZero");

// Test isPrimitive function
runTest(function() {
    assert(isPrimitive(42) === true, "Number should be recognized as a primitive");
    assert(isPrimitive("Hello") === true, "String should be recognized as a primitive");
    assert(isPrimitive(true) === true, "Boolean should be recognized as a primitive");
    assert(isPrimitive(null) === true, "null should be recognized as a primitive");
    assert(isPrimitive(undefined) === true, "undefined should be recognized as a primitive");
    assert(isPrimitive({}) === false, "Object should not be recognized as a primitive");
}, "isPrimitive");

// Test isRegExp function
runTest(function() {
    assert(isRegExp(/abc/) === true, "Regular expression should be recognized as RegExp");
    assert(isRegExp(new RegExp("abc")) === true, "RegExp object should be recognized as RegExp");
    assert(isRegExp("abc") === false, "String should not be recognized as RegExp");
    assert(isRegExp(123) === false, "Number should not be recognized as RegExp");
}, "isRegExp");

runTest(function() {
    assert(isIterable([]), "Array should be recognized as iterable");
    assert(isIterable("string"), "String should be recognized as iterable");
    assert(isIterable(new Set()), "Set should be recognized as iterable");
    assert(!isIterable({}), "Object should not be recognized as iterable");
    assert(!isIterable(123), "Number should not be recognized as iterable");
    assert(!isIterable(undefined), "undefined should not be recognized as iterable");
    assert(!isIterable(null), "null should not be recognized as iterable");
}, "isIterable");

// Test isCallable function
runTest(function() {
    assert(isCallable(function() {}) === true, "Function should be recognized as callable");
	var myFunc = function() {};
//~ 	$.writeln(myFunc instanceof Object); $.writeln(myFunc.reflect.find('call'));
	assert(isCallable(myFunc) === true, "Function variable should be recognized as callable");
    assert(isCallable({}) === false, "Object should not be recognized as callable");
    assert(isCallable("function") === false, "String should not be recognized as callable");
}, "isCallable");

// Test isLetter function
runTest(function() {
    assert(isLetter("a") === true, "'a' should be recognized as a letter");
    assert(isLetter("Z") === true, "'Z' should be recognized as a letter");
    assert(isLetter("1") === false, "'1' should not be recognized as a letter");
    assert(isLetter("#") === false, "'#' should not be recognized as a letter");
}, "isLetter");

// Test isDigit function
runTest(function() {
    assert(isDigit("1") === true, "'1' should be recognized as a digit");
    assert(isDigit("9") === true, "'9' should be recognized as a digit");
    assert(isDigit("a") === false, "'a' should not be recognized as a digit");
    assert(isDigit("#") === false, "'#' should not be recognized as a digit");
}, "isDigit");


// Test isArrayLike function
runTest( function() {
    assert(isArrayLike([1, 2, 3]) === true, "An array should be recognized as array-like");
    assert(isArrayLike({'0': 'a', '1': 'b', 'length': 2}) === true, "Object with numeric keys and length property should be recognized as array-like");
    assert(isArrayLike({'length': 0}) === true, "Empty object with length property should be recognized as array-like");
    assert(isArrayLike({'length': -1}) === false, "Object with negative length should not be recognized as array-like");
    assert(isArrayLike({'length': '10'}) === false, "Object with non-numeric length should not be recognized as array-like");
    assert(isArrayLike({'length': 2}) === false, "Object with length but no indexed elements should not be recognized as array-like");
    assert(isArrayLike(function(a, b) {}) === false, "Function object should not be recognized as array-like");
    assert(isArrayLike(null) === false, "null should not be recognized as array-like");
    assert(isArrayLike(undefined) === false, "undefined should not be recognized as array-like");
    assert(isArrayLike("Hello") === true, "String with length should be recognized as array-like");
    assert(isArrayLike(12345) === false, "Number should not be recognized as array-like");
}, "isArrayLike");

$.writeln("All tests completed.");