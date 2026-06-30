/*
 * Date polyfill reference and compatibility tests.
 *
 * ExtendScript processes the include directives. Node.js ignores them,
 * preserves its native method as the reference, disables it, and then loads
 * the project polyfill.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeDateToISOString = isNodeRuntime ? Date.prototype.toISOString : null;
var nativeDateToJSON = isNodeRuntime ? Date.prototype.toJSON : null;
var nativeDateToTemporalInstant = isNodeRuntime ? Date.prototype.toTemporalInstant : null;

Date.prototype.toISOString = undefined;
Date.prototype.toJSON = undefined;
Date.prototype.toTemporalInstant = undefined;

//@include "../Lib/Date.toISOString.js"
//@include "../Lib/Date.toJSON.js"
//@include "../Lib/Date.toTemporalInstant.js"
//@include "../../Temporal/Lib/Temporal-core.js"
//@include "../../Temporal/Lib/Temporal.Instant.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        function load(relativePath) {
            var filename = path.join(__dirname, relativePath);
            var source = fs.readFileSync(filename, "utf8");

            (0, eval)(source);
        }

        load("../Lib/Date.toISOString.js");
        load("../Lib/Date.toJSON.js");
        load("../Lib/Date.toTemporalInstant.js");
        load("../../Temporal/Lib/Temporal-core.js");
        load("../../Temporal/Lib/Temporal.Instant.js");
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

    function assertThrowsWith(callback, expectedName, message) {
        try {
            callback();
        } catch (error) {
            assertEqual(error.name, expectedName, message || "Unexpected error name");
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

    function createUTCDate(year, month, day, hour, minute, second, millisecond) {
        var date = new Date(0);

        date.setUTCFullYear(year, month, day);
        date.setUTCHours(hour, minute, second, millisecond);
        return date;
    }

    test("Date.prototype.toISOString is installed", function () {
        assertEqual(typeof Date.prototype.toISOString, "function", "polyfill method");
    });

    test("toISOString formats UTC fields and milliseconds", function () {
        var rows = [
            { value: new Date(Date.UTC(1955, 11, 30, 1, 2, 3, 456)), expected: "1955-12-30T01:02:03.456Z" },
            { value: new Date(0), expected: "1970-01-01T00:00:00.000Z" },
            { value: new Date(1), expected: "1970-01-01T00:00:00.001Z" },
            { value: new Date(12), expected: "1970-01-01T00:00:00.012Z" }
        ];
        var row;
        var i;

        for (i = 0; i < rows.length; i++) {
            row = rows[i];
            if (nativeDateToISOString) {
                assertEqual(
                    nativeDateToISOString.call(row.value),
                    row.expected,
                    "Node reference row " + i
                );
            }
            assertEqual(row.value.toISOString(), row.expected, "polyfill row " + i);
        }
    });

    test("toISOString formats regular and extended years", function () {
        var rows = [
            { value: createUTCDate(0, 0, 1, 0, 0, 0, 0), expected: "0000-01-01T00:00:00.000Z" },
            { value: createUTCDate(-1, 0, 1, 0, 0, 0, 0), expected: "-000001-01-01T00:00:00.000Z" },
            { value: createUTCDate(10000, 0, 1, 0, 0, 0, 0), expected: "+010000-01-01T00:00:00.000Z" }
        ];
        var row;
        var i;

        for (i = 0; i < rows.length; i++) {
            row = rows[i];
            if (nativeDateToISOString) {
                assertEqual(
                    nativeDateToISOString.call(row.value),
                    row.expected,
                    "Node reference row " + i
                );
            }
            assertEqual(row.value.toISOString(), row.expected, "polyfill row " + i);
        }
    });

    test("toISOString rejects invalid dates", function () {
        if (nativeDateToISOString) {
            assertThrowsWith(function () {
                nativeDateToISOString.call(new Date(NaN));
            }, "RangeError", "Node reference");
        }

        assertThrowsWith(function () {
            new Date(NaN).toISOString();
        }, "RangeError", "polyfill");
    });

    test("toISOString is not generic", function () {
        var receiver = {
            getTime: function () { return 0; },
            getUTCFullYear: function () { return 1970; },
            getUTCMonth: function () { return 0; },
            getUTCDate: function () { return 1; },
            getUTCHours: function () { return 0; },
            getUTCMinutes: function () { return 0; },
            getUTCSeconds: function () { return 0; },
            getUTCMilliseconds: function () { return 0; }
        };

        if (nativeDateToISOString) {
            assertThrowsWith(function () {
                nativeDateToISOString.call(receiver);
            }, "TypeError", "Node reference");
        }

        assertThrowsWith(function () {
            Date.prototype.toISOString.call(receiver);
        }, "TypeError", "polyfill");
    });

    test("toISOString ignores overridden instance getters", function () {
        var date = new Date(0);

        date.getUTCFullYear = function () { return 2000; };

        if (nativeDateToISOString) {
            assertEqual(
                nativeDateToISOString.call(date),
                "1970-01-01T00:00:00.000Z",
                "Node reference"
            );
        }

        assertEqual(
            date.toISOString(),
            "1970-01-01T00:00:00.000Z",
            "polyfill"
        );
    });

    test("toJSON returns the ISO string and ignores its argument", function () {
        var date = new Date(Date.UTC(1955, 11, 30, 1, 2, 3, 456));

        assertEqual(date.toJSON(), "1955-12-30T01:02:03.456Z", "Node reference: Date.toJSON()");
        assertEqual(date.toJSON("ignored"), "1955-12-30T01:02:03.456Z", "Node reference: ignored key");
    });

    test("toJSON returns null for an invalid Date", function () {
        assertEqual(new Date(NaN).toJSON(), null, "Node reference: invalid Date.toJSON()");
    });

    test("toJSON is generic and invokes the receiver toISOString method", function () {
        var receiver = {
            valueOf: function () { return 0; },
            toISOString: function () { return "generic ISO"; }
        };

        assertEqual(
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

        assertEqual(Date.prototype.toJSON.call(infiniteReceiver), null, "Node reference: numeric Infinity");
        assertEqual(called, false, "toISOString must not run for numeric Infinity");
        assertEqual(
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

        assertEqual(positive instanceof Temporal.Instant, true, "toTemporalInstant result type");
        assertEqual(positive.epochMilliseconds, -442018676544, "Node reference: epoch milliseconds");
        assertEqual(positive.toString(), "1955-12-30T01:02:03.456Z", "Node reference: Instant string");
        assertEqual(negative.epochMilliseconds, -1, "Node reference: pre-epoch millisecond");
        assertEqual(negative.toString(), "1969-12-31T23:59:59.999Z", "Node reference: pre-epoch Instant");
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

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (nativeDateToISOString) {
        Date.prototype.toISOString = nativeDateToISOString;
    }
    if (nativeDateToJSON) {
        Date.prototype.toJSON = nativeDateToJSON;
    }
    if (nativeDateToTemporalInstant) {
        Date.prototype.toTemporalInstant = nativeDateToTemporalInstant;
    }

    if (failed > 0) {
        throw new Error(failed + " Date test(s) failed");
    }
}());
