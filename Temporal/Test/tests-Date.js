//@include "D:/OneDrive/Extendscript/Github Public/ExtendScript-Extended/Tools/Console/console.js"

var nativeDateToISOString = Date.prototype.toISOString;
var nativeDateToJSON = Date.prototype.toJSON;
var nativeDateToTemporalInstant = Date.prototype.toTemporalInstant;
Date.prototype.toISOString = undefined;
Date.prototype.toJSON = undefined;
Date.prototype.toTemporalInstant = undefined;

//@include "../Lib/Date.toISOString.js"
//@include "../Lib/Date.toJSON.js"
//@include "../Lib/Date.toTemporalInstant.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Instant.js"

if (typeof require === "function" && typeof process !== "undefined") {
    (function () {
        var fs = require("fs");
        var path = require("path");

        function load(relativePath) {
            (0, eval)(fs.readFileSync(path.join(__dirname, relativePath), "utf8"));
        }

        load("../Lib/Date.toISOString.js");
        load("../Lib/Date.toJSON.js");
        load("../Lib/Date.toTemporalInstant.js");
        load("../Lib/Temporal-core.js");
        load("../Lib/Temporal.Instant.js");
    }());
}

(function () {
    var results = { passed: 0, failed: 0 };

    function writeLine(message) {
        if (typeof console !== "undefined" && console.log) console.log(message);
        else if (typeof $ !== "undefined" && $.writeln) $.writeln(message);
    }

    function fail(message) {
        throw new Error(message);
    }

    function assertEquals(actual, expected, message) {
        if (actual !== expected) {
            fail((message || "Values are not equal") +
                "\n  expected: " + expected + "\n  actual:   " + actual);
        }
    }

    function assertThrowsWith(fn, expectedName, message) {
        try {
            fn();
        } catch (error) {
            assertEquals(error.name, expectedName, message || "Unexpected error name");
            return;
        }
        fail("Expected " + expectedName + ". " + (message || ""));
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

    function createUTCDate(year, month, day, hour, minute, second, millisecond) {
        var date = new Date(0);

        date.setUTCFullYear(year, month, day);
        date.setUTCHours(hour, minute, second, millisecond);
        return date;
    }

    writeLine("Date ExtendScript polyfill tests");
    writeLine("-------------------------------");

    test("toISOString formats UTC fields and milliseconds", function () {
        assertEquals(
            new Date(Date.UTC(1955, 11, 30, 1, 2, 3, 456)).toISOString(),
            "1955-12-30T01:02:03.456Z",
            "Node reference: UTC sample"
        );
        assertEquals(new Date(0).toISOString(), "1970-01-01T00:00:00.000Z", "Node reference: epoch");
        assertEquals(new Date(1).toISOString(), "1970-01-01T00:00:00.001Z", "Node reference: millisecond padding");
        assertEquals(new Date(12).toISOString(), "1970-01-01T00:00:00.012Z", "Node reference: millisecond padding");
    });

    test("toISOString formats regular and extended years", function () {
        assertEquals(
            createUTCDate(0, 0, 1, 0, 0, 0, 0).toISOString(),
            "0000-01-01T00:00:00.000Z",
            "Node reference: year 0"
        );
        assertEquals(
            createUTCDate(-1, 0, 1, 0, 0, 0, 0).toISOString(),
            "-000001-01-01T00:00:00.000Z",
            "Node reference: year -1"
        );
        assertEquals(
            createUTCDate(10000, 0, 1, 0, 0, 0, 0).toISOString(),
            "+010000-01-01T00:00:00.000Z",
            "Node reference: year 10000"
        );
    });

    test("toISOString rejects invalid dates", function () {
        assertThrowsWith(
            function () { new Date(NaN).toISOString(); },
            "RangeError",
            "Node reference: invalid Date"
        );
    });

    test("toISOString is not generic", function () {
        assertThrowsWith(
            function () {
                Date.prototype.toISOString.call({
                    getTime: function () { return 0; },
                    getUTCFullYear: function () { return 1970; }
                });
            },
            "TypeError",
            "Node reference: non-Date receiver"
        );
    });

    test("toISOString reads the Date value rather than overridden instance getters", function () {
        var date = new Date(0);

        date.getUTCFullYear = function () { return 2000; };
        assertEquals(
            date.toISOString(),
            "1970-01-01T00:00:00.000Z",
            "Node reference: overridden instance getter"
        );
    });

    test("toJSON returns the ISO string and ignores its argument", function () {
        var date = new Date(Date.UTC(1955, 11, 30, 1, 2, 3, 456));

        assertEquals(date.toJSON(), "1955-12-30T01:02:03.456Z", "Node reference: Date.toJSON()");
        assertEquals(date.toJSON("ignored"), "1955-12-30T01:02:03.456Z", "Node reference: ignored key");
    });

    test("toJSON returns null for an invalid Date", function () {
        assertEquals(new Date(NaN).toJSON(), null, "Node reference: invalid Date.toJSON()");
    });

    test("toJSON is generic and invokes the receiver toISOString method", function () {
        var receiver = {
            valueOf: function () { return 0; },
            toISOString: function () { return "generic ISO"; }
        };

        assertEquals(
            Date.prototype.toJSON.call(receiver),
            "generic ISO",
            "Node reference: generic Date.prototype.toJSON"
        );
    });

    test("toJSON returns null only for non-finite numeric primitives", function () {
        var called = false;
        var infiniteReceiver = {
            valueOf: function () { return Infinity; },
            toISOString: function () {
                called = true;
                return "not reached";
            }
        };
        var stringReceiver = {
            valueOf: function () { return "Infinity"; },
            toISOString: function () { return "string primitive"; }
        };

        assertEquals(Date.prototype.toJSON.call(infiniteReceiver), null, "Node reference: numeric Infinity");
        assertEquals(called, false, "toISOString must not run for numeric Infinity");
        assertEquals(
            Date.prototype.toJSON.call(stringReceiver),
            "string primitive",
            "Node reference: non-numeric primitive"
        );
    });

    test("toJSON rejects receivers without a callable toISOString", function () {
        assertThrowsWith(
            function () {
                Date.prototype.toJSON.call({ valueOf: function () { return 0; } });
            },
            "TypeError",
            "Node reference: missing toISOString"
        );
    });

    test("toTemporalInstant converts the exact epoch millisecond value", function () {
        var positive = new Date(Date.UTC(1955, 11, 30, 1, 2, 3, 456)).toTemporalInstant();
        var negative = new Date(-1).toTemporalInstant();

        assertEquals(positive instanceof Temporal.Instant, true, "toTemporalInstant result type");
        assertEquals(positive.epochMilliseconds, -442018676544, "Node reference: epoch milliseconds");
        assertEquals(positive.toString(), "1955-12-30T01:02:03.456Z", "Node reference: Instant string");
        assertEquals(negative.epochMilliseconds, -1, "Node reference: pre-epoch millisecond");
        assertEquals(negative.toString(), "1969-12-31T23:59:59.999Z", "Node reference: pre-epoch Instant");
    });

    test("toTemporalInstant rejects invalid dates and non-Date receivers", function () {
        assertThrowsWith(
            function () { new Date(NaN).toTemporalInstant(); },
            "RangeError",
            "Temporal reference: invalid Date"
        );
        assertThrowsWith(
            function () { Date.prototype.toTemporalInstant.call({ getTime: function () { return 0; } }); },
            "TypeError",
            "Temporal reference: non-Date receiver"
        );
    });

    test("toTemporalInstant validates the Temporal namespace at call time", function () {
        var savedTemporal = Temporal;

        try {
            Temporal = undefined;
            assertThrowsWith(
                function () { new Date(0).toTemporalInstant(); },
                "TypeError",
                "missing Temporal namespace"
            );

            Temporal = {};
            assertThrowsWith(
                function () { new Date(0).toTemporalInstant(); },
                "TypeError",
                "missing Temporal.Instant"
            );

            Temporal.Instant = function () {};
            assertThrowsWith(
                function () { new Date(0).toTemporalInstant(); },
                "TypeError",
                "missing Temporal.Instant.fromEpochMilliseconds"
            );
        } finally {
            Temporal = savedTemporal;
        }
    });

    writeLine("-------------------------------");
    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);

    if (nativeDateToISOString) {
        Date.prototype.toISOString = nativeDateToISOString;
    }
    if (nativeDateToJSON) {
        Date.prototype.toJSON = nativeDateToJSON;
    }
    if (nativeDateToTemporalInstant) {
        Date.prototype.toTemporalInstant = nativeDateToTemporalInstant;
    }

    if (results.failed > 0) {
        throw new Error(results.failed + " Date test(s) failed.");
    }
}());
