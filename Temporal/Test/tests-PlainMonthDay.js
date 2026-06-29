//@include "D:/OneDrive/Extendscript/Github Public/ExtendScript-Extended/Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
//@include "../Lib/Temporal.PlainYearMonth.js"
//@include "../Lib/Temporal.PlainMonthDay.js"
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
        load("../Lib/Temporal.PlainMonthDay.js");
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

    writeLine("Temporal PlainMonthDay ExtendScript polyfill tests");
    writeLine("--------------------------------------------------");

    test("constructor supports leap day, coercion, and the selected ISO properties", function () {
        var monthDay = new Temporal.PlainMonthDay(2, 29);

        assert(monthDay instanceof Temporal.PlainMonthDay, "constructor should return a PlainMonthDay");
        assertNodeEquals(monthDay.toString(), "02-29", "new Temporal.PlainMonthDay(2, 29).toString()");
        assertNodeEquals(new Temporal.PlainMonthDay("2.9", "29.9").toString(), "02-29", "constructor string/fraction coercion");
        assertEquals(monthDay.month, 2, "numeric month is an intentional ISO-only project property");
        assertNodeEquals(monthDay.monthCode, "M02", "new Temporal.PlainMonthDay(2, 29).monthCode");
        assertNodeEquals(monthDay.day, 29, "new Temporal.PlainMonthDay(2, 29).day");
        assertEquals(typeof monthDay.calendarId, "undefined", "calendarId stays outside the ISO-only subset");
    });

    test("constructor rejects invalid fields without using a non-leap reference year", function () {
        assertNodeEquals(new Temporal.PlainMonthDay(12, 31).toString(), "12-31", "new Temporal.PlainMonthDay(12, 31)");

        assertThrowsWith(function () { new Temporal.PlainMonthDay(0, 1); }, "RangeError", "Node reference: month zero");
        assertThrowsWith(function () { new Temporal.PlainMonthDay(13, 1); }, "RangeError", "Node reference: month thirteen");
        assertThrowsWith(function () { new Temporal.PlainMonthDay(4, 31); }, "RangeError", "Node reference: April 31");
        assertThrowsWith(function () { new Temporal.PlainMonthDay(undefined, undefined); }, "RangeError", "Node reference: undefined fields");
        assertThrowsWith(function () { new Temporal.PlainMonthDay(NaN, 1); }, "RangeError", "Node reference: NaN month");
        assertThrowsWith(function () { Temporal.PlainMonthDay(2, 29); }, "TypeError", "Node reference: constructor without new");
    });

    test("from parses supported month-day, date, and date-time strings", function () {
        assertNodeEquals(Temporal.PlainMonthDay.from("02-29").toString(), "02-29", "PlainMonthDay.from('02-29')");
        assertNodeEquals(Temporal.PlainMonthDay.from("--02-29").toString(), "02-29", "PlainMonthDay.from('--02-29')");
        assertNodeEquals(Temporal.PlainMonthDay.from("0229").toString(), "02-29", "PlainMonthDay.from('0229')");
        assertNodeEquals(Temporal.PlainMonthDay.from("2024-02-29").toString(), "02-29", "PlainMonthDay.from('2024-02-29')");
        assertNodeEquals(Temporal.PlainMonthDay.from("+002024-02-29").toString(), "02-29", "PlainMonthDay.from extended date");
        assertNodeEquals(Temporal.PlainMonthDay.from("2024-02-29T12:34:56").toString(), "02-29", "PlainMonthDay.from date-time");
        assertNodeEquals(Temporal.PlainMonthDay.from("2024-02-29T12:34:56+01:00[Europe/Budapest]").toString(), "02-29", "PlainMonthDay.from offset date-time");
        assertNodeEquals(Temporal.PlainMonthDay.from("2024-02-29T12:34:56+01:00[Europe/Zurich]").toString(), "02-29", "PlainMonthDay.from time-zone name containing Z");

        assertThrowsWith(function () { Temporal.PlainMonthDay.from("02-30"); }, "RangeError", "Node reference: invalid month-day string");
        assertThrowsWith(function () { Temporal.PlainMonthDay.from("2023-02-29"); }, "RangeError", "Node reference: invalid full date string");
        assertThrowsWith(function () { Temporal.PlainMonthDay.from("2024-02-29Z"); }, "RangeError", "Node reference: Z designator rejection");
    });

    test("from resolves month and monthCode bags with overflow and optional year", function () {
        assertNodeEquals(Temporal.PlainMonthDay.from({ monthCode: "M02", day: 29 }).toString(), "02-29", "from monthCode bag");
        assertNodeEquals(Temporal.PlainMonthDay.from({ month: 2, day: 29 }).toString(), "02-29", "from numeric month bag");
        assertNodeEquals(Temporal.PlainMonthDay.from({ year: 2024, month: 2, day: 29 }).toString(), "02-29", "from leap-year bag");
        assertNodeEquals(Temporal.PlainMonthDay.from({ year: 2023, month: 2, day: 29 }).toString(), "02-28", "from non-leap-year bag constrains");
        assertNodeEquals(Temporal.PlainMonthDay.from({ month: 13, day: 40 }).toString(), "12-31", "from constrain overflow");
        assertNodeEquals(Temporal.PlainMonthDay.from({ month: "2.9", day: "29.9" }).toString(), "02-29", "from fractional bag");
        assertNodeEquals(Temporal.PlainMonthDay.from({ month: 2, monthCode: "M02", day: 29 }).toString(), "02-29", "from matching month fields");

        assertThrowsWith(function () { Temporal.PlainMonthDay.from({ month: 13, day: 40 }, { overflow: "reject" }); }, "RangeError", "Node reference: reject overflow");
        assertThrowsWith(function () { Temporal.PlainMonthDay.from({ month: 3, monthCode: "M02", day: 29 }); }, "RangeError", "Node reference: conflicting month fields");
        assertThrowsWith(function () { Temporal.PlainMonthDay.from({}); }, "TypeError", "Node reference: missing fields");
        assertThrowsWith(function () { Temporal.PlainMonthDay.from({ monthCode: "M02L", day: 1 }); }, "RangeError", "Node reference: non-ISO leap month code");
    });

    test("from clones supported Temporal objects and stays ISO-only", function () {
        var source = Temporal.PlainMonthDay.from("02-29");
        var clone = Temporal.PlainMonthDay.from(source);

        assertNodeEquals(clone.toString(), "02-29", "PlainMonthDay.from(existing PlainMonthDay)");
        assert(clone !== source, "from should return a distinct object");
        assertNodeEquals(Temporal.PlainMonthDay.from(Temporal.PlainDate.from("2024-05-17")).toString(), "05-17", "from PlainDate");
        assertNodeEquals(Temporal.PlainMonthDay.from(Temporal.PlainDateTime.from("2024-05-17T10:20:30")).toString(), "05-17", "from PlainDateTime");
        assertNodeEquals(Temporal.PlainMonthDay.from({ month: 2, day: 29, calendar: "iso8601" }).toString(), "02-29", "from explicit ISO calendar");

        assertThrowsWith(function () {
            Temporal.PlainMonthDay.from({ monthCode: "M02", day: 29, calendar: "gregory" });
        }, "RangeError", "non-ISO calendars are intentionally outside the project subset");
    });

    test("with replaces partial fields and applies reference-year overflow", function () {
        var leapDay = Temporal.PlainMonthDay.from("02-29");

        assertNodeEquals(Temporal.PlainMonthDay.from("11-15").with({ day: 31 }).toString(), "11-30", "with constrained day");
        assertNodeEquals(Temporal.PlainMonthDay.from("02-01").with({ day: 31 }).toString(), "02-29", "with February day using leap reference");
        assertNodeEquals(leapDay.with({ month: 4 }).toString(), "04-29", "with numeric month");
        assertNodeEquals(leapDay.with({ monthCode: "M04" }).toString(), "04-29", "with monthCode");
        assertNodeEquals(leapDay.with({ year: 2023 }).toString(), "02-28", "with non-leap reference year");
        assertNodeEquals(leapDay.with({ month: 3.9, day: 1.9 }).toString(), "03-01", "with fractional fields");

        assertThrowsWith(function () { leapDay.with({}); }, "TypeError", "Node reference: empty with bag");
        assertThrowsWith(function () { leapDay.with({ month: 3, monthCode: "M02" }); }, "RangeError", "Node reference: conflicting with fields");
        assertThrowsWith(function () { leapDay.with({ day: 30 }, { overflow: "reject" }); }, "RangeError", "Node reference: with reject overflow");
        assertThrowsWith(function () { leapDay.with({ calendar: "iso8601", day: 1 }); }, "TypeError", "Node reference: with calendar rejection");
    });

    test("equals, toString, toJSON, and valueOf match Node basics", function () {
        var leapDay = Temporal.PlainMonthDay.from("02-29");

        assertNodeEquals(leapDay.equals("02-29"), true, "equals matching string");
        assertNodeEquals(leapDay.equals({ monthCode: "M02", day: 29 }), true, "equals monthCode bag");
        assertNodeEquals(leapDay.equals({ month: 2, day: 28 }), false, "equals different bag");
        assertNodeEquals(leapDay.toString(), "02-29", "toString()");
        assertNodeEquals(leapDay.toJSON(), "02-29", "toJSON()");

        assertThrowsWith(function () { leapDay.equals("02-30"); }, "RangeError", "Node reference: equals invalid input");
        assertThrowsWith(function () { leapDay.valueOf(); }, "TypeError", "Node reference: valueOf always throws");
    });

    test("toPlainDate combines the month-day with a supplied year and constrains", function () {
        var leapDay = Temporal.PlainMonthDay.from("02-29");

        assertNodeEquals(leapDay.toPlainDate({ year: 2020 }).toString(), "2020-02-29", "toPlainDate leap year");
        assertNodeEquals(leapDay.toPlainDate({ year: 2017 }).toString(), "2017-02-28", "toPlainDate non-leap year constrains");
        assertNodeEquals(leapDay.toPlainDate({ year: 2020.9 }).toString(), "2020-02-29", "toPlainDate fractional year");

        assertThrowsWith(function () { leapDay.toPlainDate({}); }, "TypeError", "Node reference: toPlainDate missing year");
        assertThrowsWith(function () { leapDay.toPlainDate(null); }, "TypeError", "Node reference: toPlainDate null");
        assertThrowsWith(function () { leapDay.toPlainDate({ year: NaN }); }, "RangeError", "Node reference: toPlainDate NaN year");
        assertThrowsWith(function () { leapDay.toPlainDate({ year: Infinity }); }, "RangeError", "Node reference: toPlainDate infinite year");
    });

    test("options are validated before conversion", function () {
        assertThrowsWith(function () {
            Temporal.PlainMonthDay.from({ month: 2, day: 29 }, null);
        }, "TypeError", "Node reference: null from options");
        assertThrowsWith(function () {
            Temporal.PlainMonthDay.from("02-29", { overflow: "balance" });
        }, "RangeError", "Node reference: invalid overflow is not ignored for strings");
        assertThrowsWith(function () {
            Temporal.PlainMonthDay.from("02-29").with({ day: 1 }, null);
        }, "TypeError", "Node reference: null with options");
    });

    test("unsupported APIs and compatibility-only fields stay outside the subset", function () {
        var monthDay = Temporal.PlainMonthDay.from("02-29");

        assertEquals(typeof Temporal.PlainMonthDay.compare, "undefined", "PlainMonthDay.compare is not part of the native surface");
        assertEquals(typeof monthDay.add, "undefined", "PlainMonthDay.add stays unsupported");
        assertEquals(typeof monthDay.subtract, "undefined", "PlainMonthDay.subtract stays unsupported");
        assertEquals(typeof monthDay.until, "undefined", "PlainMonthDay.until stays unsupported");
        assertEquals(typeof monthDay.since, "undefined", "PlainMonthDay.since stays unsupported");
        assertEquals(monthDay.toLocaleString, Object.prototype.toLocaleString, "Intl-dependent toLocaleString stays unsupported");
        assertEquals(typeof monthDay.withCalendar, "undefined", "multi-calendar API stays unsupported");
    });

    writeLine("--------------------------------------------------");
    writeLine("Passed: " + results.passed + ", ");
    writeLine("Failed: " + results.failed + ", ");
    writeLine("Skipped: " + results.skipped);

    if (results.failed > 0) {
        throw new Error("Temporal PlainMonthDay tests failed: " + results.failed);
    }
}());
