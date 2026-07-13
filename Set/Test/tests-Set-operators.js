/*
 * ESTK-only Set operator overload tests.
 */
//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;

if (isNodeRuntime) {
    console.log("SKIP: Set operator overload tests require ESTK.");
} else {
    //@include "../Set_operators.js"

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

        function assertArrayEqual(actual, expected, message) {
            var i;

            assertEqual(actual.length, expected.length, message + " length");
            for (i = 0; i < expected.length; i++) {
                assertEqual(actual[i], expected[i], message + " row " + i);
            }
        }

        function setValues(set) {
            var values = [];
            var iterator = set.values();
            var item = iterator.next();

            while (!item.done) {
                values.push(item.value);
                item = iterator.next();
            }
            return values;
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

        test("Set binary operators return expected Sets", function () {
            var a = new Set([1, 2, 3, 4]);
            var b = new Set([4, 5, 6]);

            assertArrayEqual(setValues(a | b), [1, 2, 3, 4, 5, 6], "union");
            assertArrayEqual(setValues(a & b), [4], "intersection");
            assertArrayEqual(setValues(a - b), [1, 2, 3], "difference");
            assertArrayEqual(setValues(a ^ b), [1, 2, 3, 5, 6],
                "symmetric difference");
        });

        test("Set relational operators return expected booleans", function () {
            var a = new Set([1, 2]);
            var b = new Set([1, 2, 3]);
            var c = new Set([1, 2]);
            var d = new Set([4, 5]);

            assertEqual(a == c, true, "equality");
            assertEqual(a == b, false, "inequality");
            assertEqual(a << b, true, "subset");
            assertEqual(b >> a, true, "superset");
            assertEqual(a % d, true, "disjoint");
            assertEqual(a % b, false, "not disjoint");
        });

        console.log("\nPassed: " + passed);
        console.log("Failed: " + failed);

        if (failed > 0) {
            throw new Error(failed + " Set operator test(s) failed");
        }
    }());
}
