//@include "D:/OneDrive/Extendscript/Github Public/ExtendScript-Extended/Tools/Console/console.js"
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
    var types = ["PlainDateTime", "PlainDate", "PlainTime", "PlainYearMonth", "PlainMonthDay"];

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

    function assertProjection(source, expected) {
        var i;
        for (i = 0; i < types.length; i++) {
            assertEquals(
                Temporal[types[i]].from(source).toString(),
                expected[i],
                types[i] + " projection for " + source
            );
        }
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

    test("Z projects the same UTC fields to every Plain type", function () {
        assertProjection("2024-01-01T00:30:00.123Z", [
            "2024-01-01T00:30:00.123", "2024-01-01", "00:30:00.123", "2024-01", "01-01"
        ]);
    });

    test("positive offset projects across a leap-day month boundary", function () {
        assertProjection("2024-03-01T00:30:00.123+02:00", [
            "2024-02-29T22:30:00.123", "2024-02-29", "22:30:00.123", "2024-02", "02-29"
        ]);
    });

    test("negative offset projects across a year boundary", function () {
        assertProjection("2023-12-31T23:30:00-02:00", [
            "2024-01-01T01:30:00", "2024-01-01", "01:30:00", "2024-01", "01-01"
        ]);
    });

    test("compact and hour-only offsets use the shared Instant grammar", function () {
        assertProjection("2024-01-01T00:30:00+0100", [
            "2023-12-31T23:30:00", "2023-12-31", "23:30:00", "2023-12", "12-31"
        ]);
        assertProjection("2024-01-01T00:30:00+01", [
            "2023-12-31T23:30:00", "2023-12-31", "23:30:00", "2023-12", "12-31"
        ]);
    });

    test("numeric offset is authoritative beside a bracketed zone", function () {
        assertProjection("2024-07-01T00:30:00+01:00[Europe/Budapest]", [
            "2024-06-30T23:30:00", "2024-06-30", "23:30:00", "2024-06", "06-30"
        ]);
    });

    test("offset-free bracketed zone is rejected by every Plain type", function () {
        var i;
        for (i = 0; i < types.length; i++) {
            (function (type) {
                assertThrows(function () {
                    Temporal[type].from("2024-01-01T00:30:00[Europe/Budapest]");
                }, type + " should reject an offset-free zone");
            }(types[i]));
        }
    });

    test("time-only offset remains rejected because it is not an instant", function () {
        assertThrows(function () {
            Temporal.PlainTime.from("00:30:00+01:00");
        });
    });

    test("unsupported offset seconds are rejected instead of being ignored", function () {
        var i;
        for (i = 0; i < types.length; i++) {
            (function (type) {
                assertThrows(function () {
                    Temporal[type].from("2024-01-01T00:30:00+01:00:30");
                }, type + " should reject offset seconds");
            }(types[i]));
        }
    });

    test("pre-epoch projection uses arithmetic UTC conversion", function () {
        assertProjection("1969-12-31T23:30:00-01:00", [
            "1970-01-01T00:30:00", "1970-01-01", "00:30:00", "1970-01", "01-01"
        ]);
    });

    test("extended year projects through the shared Instant path", function () {
        assertProjection("+010000-01-01T00:30:00+01:00", [
            "9999-12-31T23:30:00", "9999-12-31", "23:30:00", "9999-12", "12-31"
        ]);
    });

    test("offset-free local ISO behavior remains unchanged", function () {
        assertProjection("2024-01-01T00:30:00.123", [
            "2024-01-01T00:30:00.123", "2024-01-01", "00:30:00.123", "2024-01", "01-01"
        ]);
        assertEquals(Temporal.PlainYearMonth.from("2024-01").toString(), "2024-01");
        assertEquals(Temporal.PlainMonthDay.from("01-01").toString(), "01-01");
    });

    test("Instant keeps its existing shared-parser behavior", function () {
        assertEquals(
            Temporal.Instant.from("2024-01-01T00:30:00.123+01:00[Europe/Budapest]").toString(),
            "2023-12-31T23:30:00.123Z"
        );
        assertEquals(
            Temporal.Instant.fromEpochMilliseconds(-1).toString(),
            "1969-12-31T23:59:59.999Z"
        );
    });

    test("from-based compare and equals consumers inherit UTC projection", function () {
        assertEquals(
            Temporal.PlainDateTime.compare(
                "2024-01-01T00:30:00+01:00",
                "2023-12-31T23:30:00"
            ),
            0
        );
        assertEquals(
            new Temporal.PlainDateTime(2023, 12, 31, 23, 30).equals(
                "2024-01-01T00:30:00+01:00"
            ),
            true
        );
        assertEquals(
            Temporal.PlainDate.compare(
                "2024-01-01T00:30:00+01:00",
                "2023-12-31"
            ),
            0
        );
        assertEquals(
            Temporal.PlainTime.compare(
                "2024-01-01T00:30:00+01:00",
                "23:30:00"
            ),
            0
        );
        assertEquals(
            Temporal.PlainYearMonth.compare(
                "2024-01-01T00:30:00+01:00",
                "2023-12"
            ),
            0
        );
    });

    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);

    if (results.failed > 0 && typeof process !== "undefined") {
        process.exitCode = 1;
    }
}());
