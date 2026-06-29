//@include "D:/OneDrive/Extendscript/Github Public/ExtendScript-Extended/Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Instant.js"
//@include "../Lib/Temporal.Now.js"

if (typeof require === "function" && typeof process !== "undefined") {
    (function () {
        var fs = require("fs");
        var path = require("path");

        function load(relativePath) {
            (0, eval)(fs.readFileSync(path.join(__dirname, relativePath), "utf8"));
        }

        load("../Lib/Temporal-core.js");
        load("../Lib/Temporal.Instant.js");
        load("../Lib/Temporal.Now.js");
    }());
}

(function () {
    var results = { passed: 0, failed: 0, skipped: 0 };

    function writeLine(message) {
        if (typeof console !== "undefined" && console.log) console.log(message);
        else if (typeof $ !== "undefined" && $.writeln) $.writeln(message);
    }

    function fail(message) {
        throw new Error(message);
    }

    function assert(condition, message) {
        if (!condition) fail(message || "Assertion failed");
    }

    function assertEquals(actual, expected, message) {
        if (actual !== expected) {
            fail((message || "Values are not equal") +
                "\n  expected: " + expected + "\n  actual:   " + actual);
        }
    }

    function test(name, fn) {
        try {
            fn();
            results.passed++;
            writeLine("[PASS] " + name);
        } catch (error) {
            results.failed++;
            writeLine("[FAIL] " + name);
            writeLine("       " + error);
        }
    }

    writeLine("Temporal Now ExtendScript polyfill tests");
    writeLine("---------------------------------------");

    test("Temporal.Now is the selected namespace object", function () {
        assertEquals(typeof Temporal.Now, "object", "Node reference: typeof Temporal.Now");
        assert(Temporal.Now !== null, "Temporal.Now should not be null");
        assertEquals(typeof Temporal.Now.instant, "function", "Node reference: typeof Temporal.Now.instant");
    });

    test("timezone-dependent Node Now methods stay outside the subset", function () {
        assertEquals(typeof Temporal.Now.timeZoneId, "undefined", "timeZoneId is intentionally unsupported");
        assertEquals(typeof Temporal.Now.plainDateTimeISO, "undefined", "plainDateTimeISO is intentionally unsupported");
        assertEquals(typeof Temporal.Now.zonedDateTimeISO, "undefined", "zonedDateTimeISO is intentionally unsupported");
        assertEquals(typeof Temporal.Now.plainDateISO, "undefined", "plainDateISO is intentionally unsupported");
        assertEquals(typeof Temporal.Now.plainTimeISO, "undefined", "plainTimeISO is intentionally unsupported");
    });

    test("Now.instant returns a millisecond Instant like the Node clock", function () {
        var instant = Temporal.Now.instant();

        assert(instant instanceof Temporal.Instant, "Node reference: Temporal.Now.instant() instanceof Temporal.Instant");
        assertEquals(
            instant.epochMilliseconds,
            Math.floor(instant.epochMilliseconds),
            "project precision requires integer epoch milliseconds"
        );
        assert(
            instant.epochMilliseconds >= Temporal.__MIN_INSTANT_EPOCH_MILLISECONDS__ &&
                instant.epochMilliseconds <= Temporal.__MAX_INSTANT_EPOCH_MILLISECONDS__,
            "Now.instant should remain within the shared Instant range"
        );
    });

    test("Now.instant reads the native system clock", function () {
        var before = new Date().getTime();
        var instant = Temporal.Now.instant();
        var after = new Date().getTime();
        var tolerance = Temporal.__MILLISECONDS_PER_SECOND__;

        assert(
            instant.epochMilliseconds >= before - tolerance &&
                instant.epochMilliseconds <= after + tolerance,
            "Node reference invariant: Now.instant epoch is within the surrounding native clock window"
        );
    });

    test("Now.instant returns fresh objects and ignores extra arguments", function () {
        var first = Temporal.Now.instant();
        var second = Temporal.Now.instant("ignored", { ignored: true });

        assert(first !== second, "Node reference: each Temporal.Now.instant() call returns a fresh Instant");
        assert(second instanceof Temporal.Instant, "extra arguments do not change the return type");
    });

    writeLine("");
    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);
    writeLine("Skipped: " + results.skipped);

    if (results.failed > 0 && typeof process !== "undefined") process.exitCode = 1;
}());
