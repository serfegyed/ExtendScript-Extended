/*
 * Math polyfill reference and compatibility tests.
 *
 * ExtendScript processes the include directives. Node.js ignores them,
 * preserves its native standard methods as references, disables them, and
 * then loads the project polyfills.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeMath = null;

if (isNodeRuntime) {
    nativeMath = {
        cbrt: Math.cbrt,
        log10: Math.log10,
        sign: Math.sign,
        trunc: Math.trunc
    };
}

Math.cbrt = undefined;
Math.log10 = undefined;
Math.mean = undefined;
Math.median = undefined;
Math.sign = undefined;
Math.sum = undefined;
Math.trunc = undefined;

//@include "../Math.cbrt.js"
//@include "../Math.log10.js"
//@include "../Math.mean.js"
//@include "../Math.median.js"
//@include "../Math.sign.js"
//@include "../Math.sum.js"
//@include "../Math.trunc.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");

        function load(relativePath) {
            var filename = path.join(__dirname, relativePath);
            var source = fs.readFileSync(filename, "utf8");

            (0, eval)(source);
        }

        load("../../Array/Lib/info.js");
        load("../Math.cbrt.js");
        load("../Math.log10.js");
        load("../Math.mean.js");
        load("../Math.median.js");
        load("../Math.sign.js");
        load("../Math.sum.js");
        load("../Math.trunc.js");
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

    function numberLabel(value) {
        if (value !== value) return "NaN";
        if (value === 0 && 1 / value === -Infinity) return "-0";
        return String(value);
    }

    function assertNumberSame(actual, expected, message) {
        var bothNaN = actual !== actual && expected !== expected;

        if (bothNaN) return;
        if (actual === 0 && expected === 0) {
            if (1 / actual === 1 / expected) return;
        } else if (actual === expected) {
            return;
        }

        fail((message ? message + ": " : "") +
            "expected " + numberLabel(expected) +
            ", got " + numberLabel(actual));
    }

    function assertApprox(actual, expected, tolerance, message) {
        if (actual === expected) return;
        if (actual !== actual && expected !== expected) return;
        if (Math.abs(actual - expected) > tolerance) {
            fail((message ? message + ": " : "") +
                "expected approximately " + expected + ", got " + actual);
        }
    }

    function assertArrayEqual(actual, expected, message) {
        var i;

        assert(actual instanceof Array, (message || "value") + " must be an array");
        assertNumberSame(actual.length, expected.length, (message || "array") + " length");
        for (i = 0; i < expected.length; i++) {
            assertNumberSame(actual[i], expected[i], (message || "array") + " item " + i);
        }
    }

    function assertThrowsMessage(callback, expectedMessage, message) {
        try {
            callback();
        } catch (error) {
            if (error.message !== expectedMessage) {
                fail((message ? message + ": " : "") +
                    "expected message " + expectedMessage + ", got " + error.message);
            }
            return;
        }

        fail((message ? message + ": " : "") + "expected an exception");
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

    function checkStandardMethod(methodName, rows) {
        var nativeMethod = nativeMath && nativeMath[methodName];
        var row;
        var i;

        for (i = 0; i < rows.length; i++) {
            row = rows[i];
            if (nativeMethod) {
                assertNumberSame(
                    nativeMethod(row.value),
                    row.expected,
                    "Node reference row " + i
                );
            }
            assertNumberSame(
                Math[methodName](row.value),
                row.expected,
                "polyfill row " + i
            );
        }
    }

    test("Math methods are installed", function () {
        var names = ["cbrt", "log10", "mean", "median", "sign", "sum", "trunc"];
        var i;

        for (i = 0; i < names.length; i++) {
            assert(typeof Math[names[i]] === "function", "Math." + names[i]);
        }
    });

    test("Math.cbrt preserves special values and coercion", function () {
        checkStandardMethod("cbrt", [
            { value: -Infinity, expected: -Infinity },
            { value: -0, expected: -0 },
            { value: 0, expected: 0 },
            { value: Infinity, expected: Infinity },
            { value: NaN, expected: NaN },
            { value: "-0", expected: -0 },
            { value: null, expected: 0 }
        ]);
    });

    test("Math.cbrt approximates finite cube roots", function () {
        var rows = [
            { value: -27, expected: -3 },
            { value: -1, expected: -1 },
            { value: 1, expected: 1 },
            { value: 2, expected: 1.2599210498948732 },
            { value: 27, expected: 3 },
            { value: "27", expected: 3 }
        ];
        var i;

        for (i = 0; i < rows.length; i++) {
            if (nativeMath && nativeMath.cbrt) {
                assertApprox(nativeMath.cbrt(rows[i].value), rows[i].expected, 1e-15, "Node reference row " + i);
            }
            assertApprox(Math.cbrt(rows[i].value), rows[i].expected, 1e-15, "polyfill row " + i);
        }
    });

    test("Math.log10 preserves special values and coercion", function () {
        checkStandardMethod("log10", [
            { value: -2, expected: NaN },
            { value: -0, expected: -Infinity },
            { value: 0, expected: -Infinity },
            { value: Infinity, expected: Infinity },
            { value: null, expected: -Infinity }
        ]);
    });

    test("Math.log10 approximates finite logarithms", function () {
        var rows = [
            { value: 1, expected: 0 },
            { value: 2, expected: 0.3010299956639812 },
            { value: 10, expected: 1 },
            { value: 1000, expected: 3 },
            { value: "100", expected: 2 }
        ];
        var i;

        for (i = 0; i < rows.length; i++) {
            if (nativeMath && nativeMath.log10) {
                assertApprox(nativeMath.log10(rows[i].value), rows[i].expected, 1e-15, "Node reference row " + i);
            }
            assertApprox(Math.log10(rows[i].value), rows[i].expected, 1e-15, "polyfill row " + i);
        }
    });

    test("Math.sign matches standard coercion and signed zero", function () {
        checkStandardMethod("sign", [
            { value: -3, expected: -1 },
            { value: -0, expected: -0 },
            { value: 0, expected: 0 },
            { value: 3, expected: 1 },
            { value: NaN, expected: NaN },
            { value: "-3", expected: -1 },
            { value: "0", expected: 0 },
            { value: null, expected: 0 },
            { value: false, expected: 0 },
            { value: true, expected: 1 }
        ]);
    });

    test("Math.trunc matches standard coercion and signed zero", function () {
        checkStandardMethod("trunc", [
            { value: -Infinity, expected: -Infinity },
            { value: -1.9, expected: -1 },
            { value: -0.1, expected: -0 },
            { value: -0, expected: -0 },
            { value: 0, expected: 0 },
            { value: 1.9, expected: 1 },
            { value: Infinity, expected: Infinity },
            { value: NaN, expected: NaN },
            { value: "-1.9", expected: -1 },
            { value: null, expected: 0 },
            { value: false, expected: 0 }
        ]);
    });

    test("Math.sum follows the documented recursive rules", function () {
        assertNumberSame(Math.sum(1, 2, 3, 4, 5, 3, 2, 1), 21, "value list");
        assertNumberSame(Math.sum([1, 2, 3, 4, 5, 3, 2, 1]), 21, "array");
        assertNumberSame(Math.sum([1, [2, 3], [4, [5, [[3, 2, 1]]]]]), 21, "nested array");
        assertNumberSame(Math.sum([1, , 3]), 4, "sparse array");
        assertNumberSame(Math.sum([1, "two", 3, null, 5, undefined, "6", true]), 9, "non-numbers ignored");
        assertNumberSame(Math.sum([]), 0, "empty array");
        assertNumberSame(Math.sum(), 0, "no arguments");
    });

    test("Math.median follows the documented ordering rules", function () {
        assertNumberSame(Math.median(1, 3, 3, 6, 7, 8, 9), 6, "odd value list");
        assertNumberSame(Math.median([1, 3, 3, 6, 7, 8]), 4.5, "even array");
        assertNumberSame(Math.median([0]), 0, "single zero");
        assertNumberSame(Math.median([]), NaN, "empty array");
        assertNumberSame(Math.median(), NaN, "no arguments");
        assertNumberSame(Math.median("1", "3", "3", "6", "7", "8"), 18, "documented string behavior");
    });

    test("Math.mean handles lists, arrays, and flattening", function () {
        assertNumberSame(Math.mean(2, 5, 6, 3, 1, 7), 4, "value list");
        assertNumberSame(Math.mean([2, 5, 6, 3, 1, 7]), 4, "array");
        assertNumberSame(Math.mean([[2, 5], [6, 3], [1, [7]]]), 4, "nested array");
        assertNumberSame(Math.mean([2, "five", 6, "three", 1, 7]), NaN, "mixed array");
    });

    test("Math.mean handles matrix dimensions", function () {
        var matrix = [[2, 5], [6, 3], [1, 7]];

        assertArrayEqual(Math.mean(matrix, 0), [3, 5], "dimension 0");
        assertArrayEqual(Math.mean(matrix, 1), [3.5, 4.5, 4], "dimension 1");
    });

    test("Math.mean rejects invalid matrix requests", function () {
        assertThrowsMessage(function () {
            Math.mean([[2, 5], [6, 3], [1, 7, 9]], 1);
        }, "Array is not uniform.", "ragged matrix");

        assertThrowsMessage(function () {
            Math.mean([[[2, 5], [6, 3], [1, 7]]], 0);
        }, "Array has too many dimensions.", "three-dimensional matrix");

        assertThrowsMessage(function () {
            Math.mean([[2, 5], [6, 3]], 2);
        }, "Invalid dimension. Should be 0 or 1.", "invalid dimension");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " Math test(s) failed");
    }
}());
