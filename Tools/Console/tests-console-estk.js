/*
 * Cross-environment console smoke tests.
 *
 * Node.js treats the include directive as a comment and uses its native
 * console. ExtendScript processes the directive and loads the polyfill.
 */

//@include "console.js"

(function () {
    var passed = 0;
    var failed = 0;

    function test(name, callback) {
        try {
            callback();
            passed++;
            console.log("PASS: " + name);
        } catch (error) {
            failed++;
            console.error("FAIL: " + name + "\n  " + (error.message || String(error)));
        }
    }

    test("basic output methods execute", function () {
        console.log("TEST OUTPUT: log", 1);
        console.warn("TEST OUTPUT: warn", 2);
        console.error("TEST OUTPUT: error", 3);
        console.assert(true, "must not be printed");
        console.assert(false, "TEST OUTPUT: assert", 4);
    });

    test("hasOwnProperty is a valid timer label", function () {
        console.time("hasOwnProperty");
        console.timeLog("hasOwnProperty", "checkpoint");
        console.timeEnd("hasOwnProperty");
    });

    test("falsy timer labels remain usable", function () {
        console.time("");
        console.time(0);
        console.time(false);
        console.time(null);
        console.timeEnd("");
        console.timeEnd(0);
        console.timeEnd(false);
        console.timeEnd(null);
    });

    test("duplicate and missing timers do not throw", function () {
        console.time("duplicate");
        console.time("duplicate");
        console.timeEnd("duplicate");
        console.timeEnd("duplicate");
        console.timeLog("missing");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " console test(s) failed");
    }
}());
