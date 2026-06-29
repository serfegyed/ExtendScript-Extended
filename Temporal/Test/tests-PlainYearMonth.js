//@include "D:/OneDrive/Extendscript/Github Public/ExtendScript-Extended/Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
//@include "../Lib/Temporal.PlainYearMonth.js"
//@include "../Lib/Temporal.PlainTime.js"
//@include "../Lib/Temporal.PlainDate.js"
//@include "../Lib/Temporal.PlainDateTime.js"

if (typeof require === "function" && typeof process !== "undefined") {
    (function () {
        var fs = require("fs");
        var path = require("path");

        function load(relativePath) {
            (0, eval)(fs.readFileSync(path.join(__dirname, relativePath), "utf8"));
        }

        load("../Lib/Temporal-core.js");
        load("../Lib/Temporal.Duration.js");
        load("../Lib/Temporal.PlainYearMonth.js");
        load("../Lib/Temporal.PlainTime.js");
        load("../Lib/Temporal.PlainDate.js");
        load("../Lib/Temporal.PlainDateTime.js");
    }());
}

(function () {
    var results = { passed: 0, failed: 0, skipped: 0 };

    function writeLine(message) {
        if (typeof console !== "undefined" && console.log) {
            console.log(message);
        } else if (typeof $ !== "undefined" && $.writeln) {
            $.writeln(message);
        }
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
                "\n  expected: " + expected +
                "\n  actual:   " + actual);
        }
    }

    function assertThrowsWith(fn, expectedName, message) {
        try {
            fn();
        } catch (error) {
            assertEquals(error.name, expectedName, message || "Unexpected error name");
            return;
        }
        fail(message || "Expected function to throw");
    }

    function assertNodeEquals(actual, expected, nodeReference) {
        assertEquals(actual, expected, "Node reference: " + nodeReference);
    }

    function test(name, fn) {
        try {
            fn();
            results.passed++;
            writeLine("[PASS] " + name);
        } catch (error) {
            results.failed++;
            writeLine("[FAIL] " + name);
            writeLine("       " + (error && error.message ? error.message : error));
        }
    }

    writeLine("Temporal PlainYearMonth ExtendScript polyfill tests");
    writeLine("---------------------------------------------------");

    test("constructor coerces fields and exposes the selected ISO properties", function () {
        var yearMonth = new Temporal.PlainYearMonth(2024, 2);

        assert(yearMonth instanceof Temporal.PlainYearMonth, "constructor should return a PlainYearMonth");
        assertNodeEquals(yearMonth.toString(), "2024-02", "new Temporal.PlainYearMonth(2024, 2).toString()");
        assertNodeEquals(new Temporal.PlainYearMonth("2024.9", "2.9").toString(), "2024-02", "constructor string/fraction coercion");
        assertNodeEquals(yearMonth.year, 2024, "new Temporal.PlainYearMonth(2024, 2).year");
        assertNodeEquals(yearMonth.month, 2, "new Temporal.PlainYearMonth(2024, 2).month");
        assertNodeEquals(yearMonth.daysInMonth, 29, "new Temporal.PlainYearMonth(2024, 2).daysInMonth");
        assertNodeEquals(yearMonth.daysInYear, 366, "new Temporal.PlainYearMonth(2024, 2).daysInYear");
        assertNodeEquals(yearMonth.monthsInYear, 12, "new Temporal.PlainYearMonth(2024, 2).monthsInYear");
        assertNodeEquals(yearMonth.inLeapYear, true, "new Temporal.PlainYearMonth(2024, 2).inLeapYear");

        assertThrowsWith(function () {
            new Temporal.PlainYearMonth(undefined, undefined);
        }, "RangeError", "Node reference: constructor undefined fields");

        assertThrowsWith(function () {
            new Temporal.PlainYearMonth(Infinity, 1);
        }, "RangeError", "Node reference: constructor non-finite year");

        assertThrowsWith(function () {
            Temporal.PlainYearMonth(2024, 2);
        }, "TypeError", "Node reference: constructor without new");
    });

    test("from parses strings and property bags with overflow", function () {
        assertNodeEquals(Temporal.PlainYearMonth.from("2024-02").toString(), "2024-02", "PlainYearMonth.from('2024-02')");
        assertNodeEquals(Temporal.PlainYearMonth.from("2024-02-29T10:20:30.123").toString(), "2024-02", "PlainYearMonth.from(date-time string)");
        assertNodeEquals(Temporal.PlainYearMonth.from("+010000-01").toString(), "+010000-01", "PlainYearMonth.from extended year");
        assertNodeEquals(Temporal.PlainYearMonth.from({ year: 2024.9, month: 2.9 }).toString(), "2024-02", "PlainYearMonth.from fractional bag");
        assertNodeEquals(Temporal.PlainYearMonth.from({ year: 2024, month: 13 }).toString(), "2024-12", "PlainYearMonth.from constrain overflow");

        assertThrowsWith(function () {
            Temporal.PlainYearMonth.from("2023-02-29");
        }, "RangeError", "Node reference: invalid reference ISO date in string");
        assertThrowsWith(function () {
            Temporal.PlainYearMonth.from({ year: 2024 });
        }, "TypeError", "Node reference: missing month field");
        assertThrowsWith(function () {
            Temporal.PlainYearMonth.from({ year: 2024, month: 13 }, { overflow: "reject" });
        }, "RangeError", "Node reference: reject overflow");
        assertThrowsWith(function () {
            Temporal.PlainYearMonth.from({ year: 2024, month: 2 }, null);
        }, "TypeError", "Node reference: null options");
    });

    test("YearMonth boundaries do not assume the first day is a valid PlainDate", function () {
        assertNodeEquals(new Temporal.PlainYearMonth(-271821, 4).toString(), "-271821-04", "minimum PlainYearMonth");
        assertNodeEquals(new Temporal.PlainYearMonth(275760, 9).toString(), "+275760-09", "maximum PlainYearMonth");

        assertThrowsWith(function () {
            new Temporal.PlainYearMonth(-271821, 3);
        }, "RangeError", "Node reference: month below minimum YearMonth");
        assertThrowsWith(function () {
            new Temporal.PlainYearMonth(275760, 10);
        }, "RangeError", "Node reference: month above maximum YearMonth");
    });

    test("compare, equals, toString, toJSON, and valueOf match Node basics", function () {
        var yearMonth = Temporal.PlainYearMonth.from("2024-02");

        assertNodeEquals(Temporal.PlainYearMonth.compare("2024-02", { year: 2024, month: 3 }), -1, "PlainYearMonth.compare earlier month");
        assertNodeEquals(Temporal.PlainYearMonth.compare("2024-02", "2024-02"), 0, "PlainYearMonth.compare equal months");
        assertNodeEquals(yearMonth.equals({ year: 2024, month: 2 }), true, "PlainYearMonth.equals property bag");
        assertNodeEquals(yearMonth.equals("2024-03"), false, "PlainYearMonth.equals different month");
        assertNodeEquals(yearMonth.toJSON(), "2024-02", "PlainYearMonth.toJSON()");

        assertThrowsWith(function () {
            yearMonth.valueOf();
        }, "TypeError", "Node reference: PlainYearMonth.valueOf()");
    });

    test("with replaces year or month and applies overflow", function () {
        var yearMonth = Temporal.PlainYearMonth.from("2024-02");

        assertNodeEquals(yearMonth.with({ year: 2023 }).toString(), "2023-02", "PlainYearMonth.with({ year: 2023 })");
        assertNodeEquals(yearMonth.with({ month: 13 }).toString(), "2024-12", "PlainYearMonth.with constrain overflow");
        assertNodeEquals(yearMonth.with({ year: 2023.9, month: 3.9 }).toString(), "2023-03", "PlainYearMonth.with fractional fields");

        assertThrowsWith(function () {
            yearMonth.with({});
        }, "TypeError", "Node reference: PlainYearMonth.with({})");
        assertThrowsWith(function () {
            yearMonth.with({ month: 13 }, { overflow: "reject" });
        }, "RangeError", "Node reference: PlainYearMonth.with reject overflow");
    });

    test("add and subtract use only Duration year and month fields", function () {
        var yearMonth = Temporal.PlainYearMonth.from("2024-02");

        assertNodeEquals(yearMonth.add({ years: 1 }).toString(), "2025-02", "PlainYearMonth.add years");
        assertNodeEquals(yearMonth.add({ years: 1, months: 11 }).toString(), "2026-01", "PlainYearMonth.add years and months");
        assertNodeEquals(yearMonth.add({ days: 1, hours: 24 }).toString(), "2024-02", "PlainYearMonth.add ignores non-year/month fields");
        assertNodeEquals(yearMonth.subtract({ months: 2 }).toString(), "2023-12", "PlainYearMonth.subtract months");

        assertThrowsWith(function () {
            yearMonth.add({ months: 1 }, { overflow: "invalid" });
        }, "RangeError", "Node reference: PlainYearMonth.add invalid overflow");
        assertThrowsWith(function () {
            Temporal.PlainYearMonth.from("-271821-04").subtract({ months: 1 });
        }, "RangeError", "Node reference: subtract below YearMonth range");
        assertThrowsWith(function () {
            Temporal.PlainYearMonth.from("+275760-09").add({ months: 1 });
        }, "RangeError", "Node reference: add above YearMonth range");
    });

    test("until and since return year/month Durations", function () {
        var start = Temporal.PlainYearMonth.from("2024-02");

        assertNodeEquals(start.until("2025-08").toString(), "P1Y6M", "PlainYearMonth.until default units");
        assertNodeEquals(start.until("2025-08", { largestUnit: "month" }).toString(), "P18M", "PlainYearMonth.until largestUnit month");
        assertNodeEquals(start.until("2025-08", { smallestUnit: "year" }).toString(), "P1Y", "PlainYearMonth.until smallestUnit year");
        assertNodeEquals(Temporal.PlainYearMonth.from("2025-08").since(start, { largestUnit: "year" }).toString(), "P1Y6M", "PlainYearMonth.since year units");
        assertNodeEquals(Temporal.PlainYearMonth.from("2025-08").until(start, { largestUnit: "month" }).toString(), "-P18M", "PlainYearMonth.until negative months");

        assertThrowsWith(function () {
            start.until("2025-08", { smallestUnit: "day" });
        }, "RangeError", "Node reference: PlainYearMonth.until rejects day unit");
        assertThrowsWith(function () {
            start.until("2025-08", { largestUnit: "month", smallestUnit: "year" });
        }, "RangeError", "Node reference: smallestUnit larger than largestUnit");
    });

    test("until and since round signed month differences", function () {
        var january = Temporal.PlainYearMonth.from("2024-01");
        var april = Temporal.PlainYearMonth.from("2024-04");

        assertNodeEquals(january.until(april, { largestUnit: "month", roundingIncrement: 2, roundingMode: "ceil" }).toString(), "P4M", "positive ceil to two months");
        assertNodeEquals(january.until(april, { largestUnit: "month", roundingIncrement: 2, roundingMode: "floor" }).toString(), "P2M", "positive floor to two months");
        assertNodeEquals(april.until(january, { largestUnit: "month", roundingIncrement: 2, roundingMode: "ceil" }).toString(), "-P2M", "negative ceil to two months");
        assertNodeEquals(april.until(january, { largestUnit: "month", roundingIncrement: 2, roundingMode: "floor" }).toString(), "-P4M", "negative floor to two months");
        assertNodeEquals(april.since(january, { largestUnit: "month", roundingIncrement: 2, roundingMode: "halfFloor" }).toString(), "P2M", "since halfFloor to two months");
        assertNodeEquals(january.until("2030-08", { smallestUnit: "year", roundingIncrement: 3 }).toString(), "P6Y", "year rounding increment");
        assertNodeEquals(january.until(april, { largestUnit: "month", roundingIncrement: 2, roundingMode: "halfFloor" }).toString(), "P4M", "calendar-length positive halfFloor");
        assertNodeEquals(january.until("2023-10", { largestUnit: "month", roundingIncrement: 2, roundingMode: "halfCeil" }).toString(), "-P4M", "calendar-length negative halfCeil across a year boundary");
        assertNodeEquals(Temporal.PlainYearMonth.from("2017-01").until("2018-04", { largestUnit: "year", smallestUnit: "month", roundingIncrement: 5, roundingMode: "ceil" }).toString(), "P1Y5M", "month remainder rounds within largestUnit year");
        assertNodeEquals(Temporal.PlainYearMonth.from("2017-01").until("2018-12", { largestUnit: "year", smallestUnit: "month", roundingIncrement: 7, roundingMode: "ceil" }).toString(), "P2Y", "month remainder caps at the next year boundary");
        assertNodeEquals(january.until("2024-07", { smallestUnit: "year", roundingMode: "halfExpand" }).toString(), "PT0S", "leap-year first half rounds by calendar length");
        assertNodeEquals(january.until("2024-08", { smallestUnit: "year", roundingMode: "halfExpand" }).toString(), "P1Y", "leap-year second half rounds by calendar length");

        assertThrowsWith(function () {
            january.until(april, { roundingIncrement: 1.5 });
        }, "RangeError", "project rule: fractional roundingIncrement is rejected");
        assertThrowsWith(function () {
            january.until(april, { roundingMode: "invalid" });
        }, "RangeError", "Node reference: invalid rounding mode");
        assertThrowsWith(function () {
            Temporal.PlainYearMonth.from("-271821-05").until("-271821-04", {
                largestUnit: "month",
                roundingIncrement: 5,
                roundingMode: "ceil"
            });
        }, "RangeError", "Node reference: rounded boundary candidate outside ISO range");
    });

    test("toPlainDate constrains the supplied day and respects ISO boundaries", function () {
        var february = Temporal.PlainYearMonth.from("2024-02");
        var minimum = Temporal.PlainYearMonth.from("-271821-04");
        var maximum = Temporal.PlainYearMonth.from("+275760-09");

        assert(february.toPlainDate({ day: 29 }) instanceof Temporal.PlainDate, "toPlainDate should return PlainDate");
        assertNodeEquals(february.toPlainDate({ day: 29 }).toString(), "2024-02-29", "PlainYearMonth.toPlainDate leap day");
        assertNodeEquals(february.toPlainDate({ day: 30 }).toString(), "2024-02-29", "PlainYearMonth.toPlainDate constrains day");
        assertNodeEquals(february.toPlainDate({ day: 2.9 }).toString(), "2024-02-02", "PlainYearMonth.toPlainDate truncates day");
        assertNodeEquals(minimum.toPlainDate({ day: 19 }).toString(), "-271821-04-19", "minimum YearMonth valid reference day");
        assertNodeEquals(maximum.toPlainDate({ day: 13 }).toString(), "+275760-09-13", "maximum YearMonth valid reference day");

        assertThrowsWith(function () {
            february.toPlainDate({});
        }, "TypeError", "Node reference: toPlainDate missing day");
        assertThrowsWith(function () {
            minimum.toPlainDate({ day: 18 });
        }, "RangeError", "Node reference: minimum YearMonth invalid reference day");
        assertThrowsWith(function () {
            maximum.toPlainDate({ day: 14 });
        }, "RangeError", "Node reference: maximum YearMonth invalid reference day");
    });

    test("compatibility-only calendar fields and APIs stay outside the subset", function () {
        var yearMonth = Temporal.PlainYearMonth.from("2024-02");

        assertEquals(yearMonth.monthCode, undefined, "monthCode is intentionally unsupported");
        assertEquals(yearMonth.calendarId, undefined, "calendarId is intentionally unsupported");
        assertEquals(yearMonth.era, undefined, "era is intentionally unsupported");
        assertEquals(yearMonth.eraYear, undefined, "eraYear is intentionally unsupported");
        assertEquals(yearMonth.withCalendar, undefined, "withCalendar is intentionally unsupported");
        assertEquals(Temporal.PlainYearMonth.prototype.hasOwnProperty("toLocaleString"), false, "toLocaleString is not implemented by this subset");
    });

    writeLine("---------------------------------------------------");
    writeLine("Passed: " + results.passed + ", \nFailed: " + results.failed + ", \nSkipped: " + results.skipped);

    if (results.failed > 0) {
        throw new Error("Temporal PlainYearMonth tests failed: " + results.failed);
    }
}());
