/*
 * TypeTest compatibility tests.
 *
 * ExtendScript processes the include directives. Node.js ignores them and
 * loads the same public bundle explicitly.
 */
//@debug 0

//@include "../../Tools/Console/console.js"
//@include "../TypeTest.js"

if (typeof require === "function" && typeof process !== "undefined") {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filename = path.join(__dirname, "../TypeTest.js");

        (0, eval)(fs.readFileSync(filename, "utf8"));
    }());
}

(function () {
    var passed = 0;
    var failed = 0;

    function fail(message) {
        throw new Error(message);
    }

    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            fail((message ? message + ": " : "") +
                "expected " + String(expected) + ", got " + String(actual));
        }
    }

    function test(name, callback) {
        try {
            callback();
            passed++;
            console.log("PASS: " + name);
        } catch (error) {
            failed++;
            console.error("FAIL: " + name + "\n  " +
                (error.message || String(error)));
        }
    }

    test("TypeTest functions are installed", function () {
        var names = [
            "isArrayLike", "isBoolean", "isCallable", "isDate", "isDefined",
            "isDigit", "isFalsy", "isFunction", "isIterable", "isLetter",
            "isNull", "isNullish", "isNumber", "isPrimitive", "isRegExp",
            "isString", "sameValueZero"
        ];
        var i;

        for (i = 0; i < names.length; i++) {
            assertEqual(typeof this[names[i]], "function", names[i]);
        }
    });

    test("isBoolean recognizes primitive booleans", function () {
        assertEqual(isBoolean(true), true, "true");
        assertEqual(isBoolean(false), true, "false");
        assertEqual(isBoolean(0), false, "zero");
        assertEqual(isBoolean("false"), false, "string");
        assertEqual(isBoolean(new Boolean(false)), false, "boxed boolean");
    });

    test("isNumber recognizes primitive numbers", function () {
        assertEqual(isNumber(42), true, "integer");
        assertEqual(isNumber(NaN), true, "NaN");
        assertEqual(isNumber(Infinity), true, "Infinity");
        assertEqual(isNumber("42"), false, "numeric string");
        assertEqual(isNumber(new Number(42)), false, "boxed number");
    });

    test("isString recognizes primitive strings", function () {
        assertEqual(isString("Hello"), true, "string");
        assertEqual(isString(""), true, "empty string");
        assertEqual(isString(42), false, "number");
        assertEqual(isString(new String("Hello")), false, "boxed string");
    });

    test("isNull recognizes only null", function () {
        assertEqual(isNull(null), true, "null");
        assertEqual(isNull(undefined), false, "undefined");
        assertEqual(isNull(0), false, "zero");
        assertEqual(isNull(""), false, "empty string");
    });

    test("isNullish recognizes null and undefined", function () {
        assertEqual(isNullish(null), true, "null");
        assertEqual(isNullish(undefined), true, "undefined");
        assertEqual(isNullish(0), false, "zero");
        assertEqual(isNullish(""), false, "empty string");
    });

    test("isFalsy follows JavaScript truthiness", function () {
        assertEqual(isFalsy(false), true, "false");
        assertEqual(isFalsy(null), true, "null");
        assertEqual(isFalsy(undefined), true, "undefined");
        assertEqual(isFalsy(0), true, "zero");
        assertEqual(isFalsy(NaN), true, "NaN");
        assertEqual(isFalsy(""), true, "empty string");
        assertEqual(isFalsy("text"), false, "text");
        assertEqual(isFalsy({}), false, "object");
    });

    test("isDefined distinguishes undefined", function () {
        assertEqual(isDefined(undefined), false, "undefined");
        assertEqual(isDefined(null), true, "null");
        assertEqual(isDefined(0), true, "zero");
        assertEqual(isDefined(""), true, "empty string");
    });

    test("isFunction recognizes functions", function () {
        assertEqual(isFunction(function () {}), true, "function");
        assertEqual(isFunction({}), false, "object");
        assertEqual(isFunction("function"), false, "string");
        assertEqual(isFunction(123), false, "number");
    });

    test("isCallable recognizes callable values", function () {
        assertEqual(isCallable(function () {}), true, "function");
        assertEqual(isCallable({}), false, "object");
        assertEqual(isCallable("function"), false, "string");
        assertEqual(isCallable(null), false, "null");
    });

    test("isDate recognizes valid Date objects", function () {
        assertEqual(isDate(new Date()), true, "valid Date");
        assertEqual(isDate(new Date(NaN)), false, "invalid Date");
        assertEqual(isDate("2021-01-01"), false, "date string");
        assertEqual(isDate(null), false, "null");
        assertEqual(isDate({ getTime: function () { return 0; } }), false, "Date-like object");
    });

    test("sameValueZero follows SameValueZero equality", function () {
        var object = {};

        assertEqual(sameValueZero(0, -0), true, "signed zero");
        assertEqual(sameValueZero(NaN, NaN), true, "NaN");
        assertEqual(sameValueZero("text", "text"), true, "strings");
        assertEqual(sameValueZero(1, "1"), false, "different types");
        assertEqual(sameValueZero(object, object), true, "same object");
        assertEqual(sameValueZero({}, {}), false, "different objects");
    });

    test("isPrimitive excludes objects and functions", function () {
        assertEqual(isPrimitive(42), true, "number");
        assertEqual(isPrimitive("Hello"), true, "string");
        assertEqual(isPrimitive(true), true, "boolean");
        assertEqual(isPrimitive(null), true, "null");
        assertEqual(isPrimitive(undefined), true, "undefined");
        assertEqual(isPrimitive({}), false, "object");
        assertEqual(isPrimitive([]), false, "array");
        assertEqual(isPrimitive(function () {}), false, "function");
    });

    test("isRegExp recognizes regular expressions", function () {
        assertEqual(isRegExp(/abc/), true, "literal RegExp");
        assertEqual(isRegExp(new RegExp("abc")), true, "constructed RegExp");
        assertEqual(isRegExp("abc"), false, "string");
        assertEqual(isRegExp({ test: function () {} }), false, "RegExp-like object");
    });

    test("isIterable recognizes length-like and size-like values", function () {
        assertEqual(isIterable([]), true, "array");
        assertEqual(isIterable("string"), true, "string");
        assertEqual(isIterable({ length: 0 }), true, "length-like object");
        assertEqual(isIterable({ size: 0 }), true, "size-like object");
        assertEqual(isIterable({}), false, "plain object");
        assertEqual(isIterable(123), false, "number");
        assertEqual(isIterable(null), false, "null");
    });

    test("isLetter accepts exactly one supported letter", function () {
        assertEqual(isLetter("a"), true, "lowercase ASCII");
        assertEqual(isLetter("Z"), true, "uppercase ASCII");
        assertEqual(isLetter("é"), true, "extended Latin");
        assertEqual(isLetter("1"), false, "digit");
        assertEqual(isLetter("#"), false, "symbol");
        assertEqual(isLetter(""), false, "empty string");
        assertEqual(isLetter("ab"), false, "multiple letters");
        assertEqual(isLetter("1a"), false, "letter inside longer string");
    });

    test("isDigit accepts exactly one digit character", function () {
        assertEqual(isDigit("0"), true, "zero digit");
        assertEqual(isDigit("9"), true, "nine digit");
        assertEqual(isDigit("a"), false, "letter");
        assertEqual(isDigit("#"), false, "symbol");
        assertEqual(isDigit(""), false, "empty string");
        assertEqual(isDigit("12"), false, "multiple digits");
        assertEqual(isDigit("a1"), false, "digit inside longer string");
        assertEqual(isDigit(1), false, "non-string number");
    });

    test("isArrayLike recognizes indexed values with a length", function () {
        function checkArguments() {
            return isArrayLike(arguments);
        }

        assertEqual(isArrayLike([1, 2, 3]), true, "array");
        assertEqual(isArrayLike("Hello"), true, "string");
        assertEqual(isArrayLike({ 0: "a", 1: "b", length: 2 }), true, "array-like object");
        assertEqual(isArrayLike({ length: 0 }), true, "empty array-like object");
        assertEqual(checkArguments(1, 2), true, "arguments object");
        assertEqual(isArrayLike({ length: -1 }), false, "negative length");
        assertEqual(isArrayLike({ length: "2", 0: "a", 1: "b" }), false, "string length");
        assertEqual(isArrayLike({ length: 2 }), false, "missing indexed values");
        assertEqual(isArrayLike(function (a, b) {}), false, "function");
        assertEqual(isArrayLike(null), false, "null");
        assertEqual(isArrayLike(12345), false, "number");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " TypeTest test(s) failed");
    }
}());
