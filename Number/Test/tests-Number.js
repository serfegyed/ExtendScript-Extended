/*
 * Number polyfill reference and compatibility tests.
 *
 * ExtendScript processes the include directives. Node.js ignores them,
 * preserves its native Number methods as the reference, disables those
 * methods, and then loads the project polyfill.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeNumber = null;

if (isNodeRuntime) {
    nativeNumber = {
        isFinite: Number.isFinite,
        isInteger: Number.isInteger,
        isNaN: Number.isNaN,
        isSafeInteger: Number.isSafeInteger,
        MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
        MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
        EPSILON: Number.EPSILON
    };
}

Number.isFinite = undefined;
Number.isInteger = undefined;
Number.isNaN = undefined;
Number.isSafeInteger = undefined;

//@include "../Number.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filename = path.join(__dirname, "../Number.js");
        var source = fs.readFileSync(filename, "utf8");

        (0, eval)(source);
    }());
}

(function () {
    var passed = 0;
    var failed = 0;

    function fail(message) {
        throw new Error(message);
    }

    function assert(condition, message) {
        if (!condition) {
            fail(message || "Assertion failed");
        }
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

    function checkMethod(methodName, rows) {
        test("Number." + methodName, function () {
            var nativeMethod = nativeNumber && nativeNumber[methodName];
            var row;
            var i;

            for (i = 0; i < rows.length; i++) {
                row = rows[i];

                if (nativeMethod) {
                    assertEqual(
                        nativeMethod(row.value),
                        row.expected,
                        "Node reference row " + i
                    );
                }

                assertEqual(
                    Number[methodName](row.value),
                    row.expected,
                    "polyfill row " + i
                );
            }
        });
    }

    test("Number methods are installed", function () {
        assert(typeof Number.isFinite === "function", "Number.isFinite");
        assert(typeof Number.isInteger === "function", "Number.isInteger");
        assert(typeof Number.isNaN === "function", "Number.isNaN");
        assert(typeof Number.isSafeInteger === "function", "Number.isSafeInteger");
    });

    test("Number constants match the standard values", function () {
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var minSafeInteger = -Math.pow(2, 53) + 1;
        var epsilon = Math.pow(2, -52);

        if (nativeNumber !== null) {
            assertEqual(nativeNumber.MAX_SAFE_INTEGER, maxSafeInteger, "Node MAX_SAFE_INTEGER");
            assertEqual(nativeNumber.MIN_SAFE_INTEGER, minSafeInteger, "Node MIN_SAFE_INTEGER");
            assertEqual(nativeNumber.EPSILON, epsilon, "Node EPSILON");
        }

        assertEqual(Number.MAX_SAFE_INTEGER, maxSafeInteger, "polyfill MAX_SAFE_INTEGER");
        assertEqual(Number.MIN_SAFE_INTEGER, minSafeInteger, "polyfill MIN_SAFE_INTEGER");
        assertEqual(Number.EPSILON, epsilon, "polyfill EPSILON");
    });

    checkMethod("isFinite", [
        { value: 0, expected: true },
        { value: -0, expected: true },
        { value: 123, expected: true },
        { value: -1.5, expected: true },
        { value: Infinity, expected: false },
        { value: -Infinity, expected: false },
        { value: NaN, expected: false },
        { value: "123", expected: false },
        { value: null, expected: false },
        { value: undefined, expected: false },
        { value: new Number(1), expected: false }
    ]);

    checkMethod("isInteger", [
        { value: 0, expected: true },
        { value: -0, expected: true },
        { value: 123, expected: true },
        { value: -123, expected: true },
        { value: 1.5, expected: false },
        { value: -1.5, expected: false },
        { value: NaN, expected: false },
        { value: Infinity, expected: false },
        { value: "123", expected: false },
        { value: null, expected: false },
        { value: new Number(1), expected: false }
    ]);

    checkMethod("isNaN", [
        { value: NaN, expected: true },
        { value: 0, expected: false },
        { value: Infinity, expected: false },
        { value: "NaN", expected: false },
        { value: "123", expected: false },
        { value: undefined, expected: false },
        { value: new Number(NaN), expected: false }
    ]);

    checkMethod("isSafeInteger", [
        { value: 0, expected: true },
        { value: -0, expected: true },
        { value: Math.pow(2, 53) - 1, expected: true },
        { value: -Math.pow(2, 53) + 1, expected: true },
        { value: Math.pow(2, 53), expected: false },
        { value: -Math.pow(2, 53), expected: false },
        { value: 1.5, expected: false },
        { value: NaN, expected: false },
        { value: Infinity, expected: false },
        { value: "1", expected: false },
        { value: new Number(1), expected: false }
    ]);

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " Number test(s) failed");
    }
}());
