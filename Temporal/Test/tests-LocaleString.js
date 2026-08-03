//@include "../../Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
//@include "../Lib/Temporal.Instant.js"
//@include "../Lib/Temporal.PlainTime.js"
//@include "../Lib/Temporal.PlainDate.js"
//@include "../Lib/Temporal.PlainDateTime.js"
//@include "../Lib/Temporal.PlainYearMonth.js"
//@include "../Lib/Temporal.PlainMonthDay.js"

if (typeof require === "function" && typeof process !== "undefined") {
    (function () {
        var fs = require("fs");
        var path = require("path");

        function load(relativePath) {
            (0, eval)(fs.readFileSync(path.join(__dirname, relativePath), "utf8"));
        }

        load("../Lib/Temporal-core.js");
        load("../Lib/Temporal.Duration.js");
        load("../Lib/Temporal.Instant.js");
        load("../Lib/Temporal.PlainTime.js");
        load("../Lib/Temporal.PlainDate.js");
        load("../Lib/Temporal.PlainDateTime.js");
        load("../Lib/Temporal.PlainYearMonth.js");
        load("../Lib/Temporal.PlainMonthDay.js");
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

    function assertThrows(callback, message) {
        var threw = false;
        try {
            callback();
        } catch (error) {
            threw = true;
        }
        if (!threw) fail(message || "Expected function to throw");
    }

    function test(name, callback) {
        try {
            callback();
            results.passed += 1;
            writeLine("PASS: " + name);
        } catch (error) {
            results.failed += 1;
            writeLine("FAIL: " + name + "\n" + error.message);
        }
    }

    test("all seven supported specification objects expose own toLocaleString", function () {
        assertEquals(typeof Temporal.Duration.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.Instant.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainDate.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainDateTime.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainMonthDay.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainTime.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainYearMonth.prototype.toLocaleString, "function");
    });

    test("without the local Intl subset every toLocaleString falls back to toString", function () {
        var values = [
            Temporal.Duration.from("P1DT2H"),
            Temporal.Instant.from("2026-01-15T12:00:00.123Z"),
            Temporal.PlainDate.from("2026-01-15"),
            Temporal.PlainDateTime.from("2026-01-15T12:34:56.123"),
            Temporal.PlainMonthDay.from("01-15"),
            Temporal.PlainTime.from("12:34:56.123"),
            Temporal.PlainYearMonth.from("2026-01")
        ];
        var i;

        for (i = 0; i < values.length; i++) {
            assertEquals(values[i].toLocaleString(), values[i].toString());
            assertEquals(values[i].toLocaleString("hu-HU", { dateStyle: "full" }), values[i].toString());
        }
    });

    test("PlainDateTime fallback is the object ISO string, not host-local projection", function () {
        assertEquals(
            Temporal.PlainDateTime.from("2026-07-15T12:34:56.123").toLocaleString(),
            "2026-07-15T12:34:56.123"
        );
    });

    test("partial Plain outputs do not invent missing fields", function () {
        assertEquals(Temporal.PlainDate.from("2026-07-15").toLocaleString(), "2026-07-15");
        assertEquals(Temporal.PlainTime.from("12:34:56.123").toLocaleString(), "12:34:56.123");
        assertEquals(Temporal.PlainYearMonth.from("2026-07").toLocaleString(), "2026-07");
        assertEquals(Temporal.PlainMonthDay.from("07-15").toLocaleString(), "07-15");
    });

    test("toLocaleString methods reject incompatible receivers", function () {
        assertThrows(function () { Temporal.Duration.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.Instant.prototype.toLocaleString.call({ epochMilliseconds: 0 }); });
        assertThrows(function () { Temporal.PlainDateTime.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.PlainDate.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.PlainTime.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.PlainYearMonth.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.PlainMonthDay.prototype.toLocaleString.call({}); });
    });

    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);

    if (results.failed > 0 && typeof process !== "undefined") {
        process.exitCode = 1;
    }
}());
