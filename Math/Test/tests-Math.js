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
        clz32: Math.clz32,
        expm1: Math.expm1,
        hypot: Math.hypot,
        imul: Math.imul,
        log1p: Math.log1p,
        log10: Math.log10,
        log2: Math.log2,
        sign: Math.sign,
        trunc: Math.trunc
    };
}

Math.cbrt = undefined;
Math.clz32 = undefined;
Math.expm1 = undefined;
Math.hypot = undefined;
Math.imul = undefined;
Math.log1p = undefined;
Math.log10 = undefined;
Math.log2 = undefined;
Math.mean = undefined;
Math.median = undefined;
Math.sign = undefined;
Math.sum = undefined;
Math.trunc = undefined;

//@include "../math.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");

        function load(relativePath) {
            var filename = path.join(__dirname, relativePath);
            var source = fs.readFileSync(filename, "utf8");

            (0, eval)(source);
        }

        function loadBundle(relativePath) {
            var filename = path.join(__dirname, relativePath);
            var source = fs.readFileSync(filename, "utf8");
            var includePattern = /^\/\/@include\s+"([^"]+)"/gm;
            var match;

            while ((match = includePattern.exec(source)) !== null) {
                load(path.join(path.dirname(relativePath), match[1]));
            }
        }

        loadBundle("../math.js");
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
        var scale;

        if (actual === expected) return;
        if (actual !== actual && expected !== expected) return;
        scale = Math.max(1, Math.abs(actual), Math.abs(expected));
        if (Math.abs(actual - expected) > tolerance &&
                Math.abs(actual - expected) / scale > tolerance) {
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
        var names = [
            "cbrt",
            "clz32",
            "expm1",
            "hypot",
            "imul",
            "log1p",
            "log10",
            "log2",
            "mean",
            "median",
            "sign",
            "sum",
            "trunc"
        ];
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

    test("Math.cbrt returns exact integer cube roots", function () {
        checkStandardMethod("cbrt", [
            { value: -64, expected: -4 },
            { value: -27, expected: -3 },
            { value: -8, expected: -2 },
            { value: -1, expected: -1 },
            { value: 1, expected: 1 },
            { value: 8, expected: 2 },
            { value: 27, expected: 3 },
            { value: 64, expected: 4 },
            { value: "27", expected: 3 }
        ]);
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

    test("Math.log2 preserves special values and coercion", function () {
        checkStandardMethod("log2", [
            { value: -1, expected: NaN },
            { value: -0, expected: -Infinity },
            { value: 0, expected: -Infinity },
            { value: 1, expected: 0 },
            { value: 2, expected: 1 },
            { value: 1024, expected: 10 },
            { value: Infinity, expected: Infinity },
            { value: NaN, expected: NaN },
            { value: null, expected: -Infinity }
        ]);
    });

    test("Math.log1p preserves special values and improves small values", function () {
        var rows = [
            { value: -2, expected: NaN },
            { value: -1, expected: -Infinity },
            { value: -0, expected: -0 },
            { value: 0, expected: 0 },
            { value: 1, expected: 0.6931471805599453 },
            { value: 1e-8, expected: 9.999999950000001e-9 },
            { value: Infinity, expected: Infinity },
            { value: NaN, expected: NaN },
            { value: null, expected: 0 }
        ];
        var i;

        for (i = 0; i < rows.length; i++) {
            if (nativeMath && nativeMath.log1p) {
                assertApprox(nativeMath.log1p(rows[i].value), rows[i].expected, 1e-20, "Node reference row " + i);
            }
            assertApprox(Math.log1p(rows[i].value), rows[i].expected, 1e-20, "polyfill row " + i);
        }
    });

    test("Math.expm1 preserves special values and improves small values", function () {
        var rows = [
            { value: -Infinity, expected: -1 },
            { value: -1, expected: -0.6321205588285577 },
            { value: -0, expected: -0 },
            { value: 0, expected: 0 },
            { value: 1, expected: 1.718281828459045 },
            { value: 1e-8, expected: 1.0000000050000001e-8 },
            { value: Infinity, expected: Infinity },
            { value: NaN, expected: NaN },
            { value: null, expected: 0 }
        ];
        var i;

        for (i = 0; i < rows.length; i++) {
            if (nativeMath && nativeMath.expm1) {
                assertApprox(nativeMath.expm1(rows[i].value), rows[i].expected, 1e-20, "Node reference row " + i);
            }
            assertApprox(Math.expm1(rows[i].value), rows[i].expected, 1e-20, "polyfill row " + i);
        }
    });

    test("Math.hypot handles scale, coercion, Infinity, and NaN", function () {
        var rows = [
            { values: [3, 4], expected: 5 },
            { values: [], expected: 0 },
            { values: [Infinity, 1], expected: Infinity },
            { values: [NaN, 1], expected: NaN },
            { values: [NaN, Infinity], expected: Infinity },
            { values: [1e200, 1e200], expected: 1.414213562373095e200 },
            { values: [3, "4"], expected: 5 }
        ];
        var i;

        for (i = 0; i < rows.length; i++) {
            if (nativeMath && nativeMath.hypot) {
                assertApprox(nativeMath.hypot.apply(Math, rows[i].values), rows[i].expected, 1e-12, "Node reference row " + i);
            }
            assertApprox(Math.hypot.apply(Math, rows[i].values), rows[i].expected, 1e-12, "polyfill row " + i);
        }
    });

    test("Math.clz32 converts to uint32 and counts leading zeros", function () {
        checkStandardMethod("clz32", [
            { value: undefined, expected: 32 },
            { value: 0, expected: 32 },
            { value: 1, expected: 31 },
            { value: 1000, expected: 22 },
            { value: 0xffffffff, expected: 0 },
            { value: 0x80000000, expected: 0 },
            { value: 3.5, expected: 30 },
            { value: "16", expected: 27 },
            { value: NaN, expected: 32 },
            { value: Infinity, expected: 32 }
        ]);
    });

    test("Math.imul performs signed 32-bit multiplication", function () {
        var rows = [
            { values: [2, 4], expected: 8 },
            { values: [-1, 8], expected: -8 },
            { values: [-2, -2], expected: 4 },
            { values: [0xffffffff, 5], expected: -5 },
            { values: [0x7fffffff, 2], expected: -2 },
            { values: [0x80000000, 2], expected: 0 },
            { values: [123456, 789012], expected: -1375982336 }
        ];
        var i;

        for (i = 0; i < rows.length; i++) {
            if (nativeMath && nativeMath.imul) {
                assertNumberSame(nativeMath.imul.apply(Math, rows[i].values), rows[i].expected, "Node reference row " + i);
            }
            assertNumberSame(Math.imul.apply(Math, rows[i].values), rows[i].expected, "polyfill row " + i);
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
