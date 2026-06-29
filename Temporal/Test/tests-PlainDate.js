//@include "../../Tools/Console/console.js"
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
    var results = {
        passed: 0,
        failed: 0,
        skipped: 0
    };

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
        if (!condition) {
            fail(message || "Assertion failed");
        }
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

    writeLine("Temporal PlainDate ExtendScript polyfill tests");
    writeLine("----------------------------------------------");

    test("PlainDate constructor and from parse ISO values like Node", function () {
        var date = new Temporal.PlainDate(2024, 2, 29);

        assert(date instanceof Temporal.PlainDate, "constructor should return a PlainDate");
        assertNodeEquals(date.toString(), "2024-02-29", "new Temporal.PlainDate(2024, 2, 29).toString()");
        assertNodeEquals(date.year, 2024, "new Temporal.PlainDate(2024, 2, 29).year");
        assertNodeEquals(date.month, 2, "new Temporal.PlainDate(2024, 2, 29).month");
        assertNodeEquals(date.day, 29, "new Temporal.PlainDate(2024, 2, 29).day");
        assertNodeEquals(date.dayOfWeek, 4, "new Temporal.PlainDate(2024, 2, 29).dayOfWeek");
        assertNodeEquals(date.dayOfYear, 60, "new Temporal.PlainDate(2024, 2, 29).dayOfYear");
        assertNodeEquals(date.inLeapYear, true, "new Temporal.PlainDate(2024, 2, 29).inLeapYear");
        assertNodeEquals(date.daysInMonth, 29, "new Temporal.PlainDate(2024, 2, 29).daysInMonth");
        assertNodeEquals(date.daysInYear, 366, "new Temporal.PlainDate(2024, 2, 29).daysInYear");

        assertNodeEquals(Temporal.PlainDate.from("2024-02-29T10:20:30.123").toString(), "2024-02-29", "Temporal.PlainDate.from(date-time string).toString()");
        assertNodeEquals(Temporal.PlainDate.from("+010000-01-01").toString(), "+010000-01-01", "Temporal.PlainDate.from('+010000-01-01').toString()");
        assertNodeEquals(Temporal.PlainDate.from("+002024-01-01").toString(), "2024-01-01", "Temporal.PlainDate.from('+002024-01-01').toString()");
        assertNodeEquals(Temporal.PlainDate.from("-271821-04-19").toString(), "-271821-04-19", "Temporal.PlainDate.from('-271821-04-19').toString()");
        assertNodeEquals(Temporal.PlainDate.from("+275760-09-13").toString(), "+275760-09-13", "Temporal.PlainDate.from('+275760-09-13').toString()");
        assertNodeEquals(Temporal.PlainDate.from("-271821-04-19").weekOfYear, 16, "Temporal.PlainDate.from('-271821-04-19').weekOfYear");
        assertNodeEquals(Temporal.PlainDate.from("+275760-09-13").weekOfYear, 37, "Temporal.PlainDate.from('+275760-09-13').weekOfYear");
        assertNodeEquals(Temporal.PlainDate.from({ year: 2023, month: 2, day: 29 }).toString(), "2023-02-28", "Temporal.PlainDate.from({ year: 2023, month: 2, day: 29 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from({ year: "2024", month: "02", day: "29" }).toString(), "2024-02-29", "Temporal.PlainDate.from(string property bag).toString()");
        assertNodeEquals(new Temporal.PlainDate(2024.9, 2.9, 1.9).toString(), "2024-02-01", "new Temporal.PlainDate(2024.9, 2.9, 1.9).toString()");
        assertNodeEquals(Temporal.PlainDate.from({ year: 2024.9, month: 2.9, day: 1.9 }).toString(), "2024-02-01", "Temporal.PlainDate.from(fractional property bag).toString()");

        assertThrowsWith(function () {
            Temporal.PlainDate.from({ year: 2023, month: 2, day: 29 }, { overflow: "reject" });
        }, "RangeError", "Node reference: Temporal.PlainDate.from(invalid leap day, { overflow: 'reject' })");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("not-a-date");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('not-a-date')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("2023-02-29");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('2023-02-29')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("2024-13-01");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('2024-13-01')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("2024-04-31", { overflow: "constrain" });
        }, "RangeError", "Node reference: Temporal.PlainDate.from('2024-04-31', { overflow: 'constrain' })");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("2024-02-29T25:00");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('2024-02-29T25:00')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("10000-01-01");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('10000-01-01')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("+2024-01-01");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('+2024-01-01')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("-000000-01-01");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('-000000-01-01')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("-271821-04-18");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('-271821-04-18')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("+275760-09-14");
        }, "RangeError", "Node reference: Temporal.PlainDate.from('+275760-09-14')");

        assertThrowsWith(function () {
            Temporal.PlainDate.from({ year: 999999, month: 1, day: 1 }, { overflow: "constrain" });
        }, "RangeError", "Node reference: Temporal.PlainDate.from(out-of-range year, { overflow: 'constrain' })");

        assertThrowsWith(function () {
            new Temporal.PlainDate(NaN, 1, 1);
        }, "RangeError", "Node reference: new Temporal.PlainDate(NaN, 1, 1)");

        assertThrowsWith(function () {
            Temporal.PlainDate.from({ year: 2024, month: Infinity, day: 1 });
        }, "RangeError", "Node reference: Temporal.PlainDate.from({ year: 2024, month: Infinity, day: 1 })");

        assertThrowsWith(function () {
            Temporal.PlainDate.from({ year: 2024, month: 0, day: 1 }, { overflow: "constrain" });
        }, "RangeError", "Node reference: Temporal.PlainDate.from({ year: 2024, month: 0, day: 1 }, { overflow: 'constrain' })");

        assertThrowsWith(function () {
            Temporal.PlainDate("2024-02-29");
        }, "TypeError", "Node reference: Temporal.PlainDate('2024-02-29')");

        assertThrowsWith(function () {
            Temporal.PlainDate({ year: 2024, month: 2, day: 29 });
        }, "TypeError", "Node reference: Temporal.PlainDate({ year: 2024, month: 2, day: 29 })");

    });

	test("PlainDate exposes and accepts ISO monthCode and calendarId like Node", function () {
		var date = new Temporal.PlainDate(2024, 5, 17);

		assertNodeEquals(date.monthCode, "M05", "new Temporal.PlainDate(2024, 5, 17).monthCode");
		assertNodeEquals(date.calendarId, "iso8601", "new Temporal.PlainDate(2024, 5, 17).calendarId");
		assertNodeEquals(Temporal.PlainDate.from({ year: 2024, monthCode: "M05", day: 17 }).toString(), "2024-05-17", "PlainDate.from(monthCode-only bag)");
		assertNodeEquals(Temporal.PlainDate.from({ year: 2024, month: 5, monthCode: "M05", day: 17 }).toString(), "2024-05-17", "PlainDate.from(matching month fields)");
		assertNodeEquals(date.with({ monthCode: "M06" }).toString(), "2024-06-17", "PlainDate.with(monthCode-only bag)");
		assertNodeEquals(date.with({ month: 6, monthCode: "M06" }).toString(), "2024-06-17", "PlainDate.with(matching month fields)");

		assertThrowsWith(function () {
			Temporal.PlainDate.from({ year: 2024, month: 6, monthCode: "M05", day: 17 });
		}, "RangeError", "Node reference: PlainDate.from(mismatching month fields)");

		assertThrowsWith(function () {
			date.with({ month: 6, monthCode: "M05" });
		}, "RangeError", "Node reference: PlainDate.with(mismatching month fields)");

		assertThrowsWith(function () {
			Temporal.PlainDate.from({ year: 2024, monthCode: "M05L", day: 17 });
		}, "RangeError", "Node reference: PlainDate.from(non-ISO leap monthCode)");
	});

    test("PlainDate toString, toJSON, valueOf, compare and equals match Node basics", function () {
        var date = Temporal.PlainDate.from("2024-02-29");

        assertNodeEquals(date.toString(), "2024-02-29", "Temporal.PlainDate.from(input).toString()");
        assertNodeEquals(new Temporal.PlainDate(10000, 1, 1).toString(), "+010000-01-01", "new Temporal.PlainDate(10000, 1, 1).toString()");
        assertNodeEquals(new Temporal.PlainDate(-1, 1, 1).toString(), "-000001-01-01", "new Temporal.PlainDate(-1, 1, 1).toString()");
        assertNodeEquals(new Temporal.PlainDate(0, 1, 1).dayOfWeek, 6, "new Temporal.PlainDate(0, 1, 1).dayOfWeek");
        assertNodeEquals(new Temporal.PlainDate(-1, 1, 1).dayOfWeek, 5, "new Temporal.PlainDate(-1, 1, 1).dayOfWeek");
        assertNodeEquals(date.toJSON(), "2024-02-29", "Temporal.PlainDate.from(input).toJSON()");
        assertNodeEquals(Temporal.PlainDate.compare("2024-02-29", { year: 2024, month: 3, day: 1 }), -1, "Temporal.PlainDate.compare('2024-02-29', { year: 2024, month: 3, day: 1 })");
        assertNodeEquals(Temporal.PlainDate.compare("2024-02-29", "2024-02-29"), 0, "Temporal.PlainDate.compare('2024-02-29', '2024-02-29')");
        assertNodeEquals(date.equals({ year: 2024, month: 2, day: 29 }), true, "Temporal.PlainDate.from(input).equals(property bag)");
        assertNodeEquals(date.equals("2024-03-01"), false, "Temporal.PlainDate.from(input).equals(different date)");
        assertNodeEquals(typeof Temporal.PlainDate.prototype.round, "undefined", "typeof Temporal.PlainDate.prototype.round");

        assertThrowsWith(function () {
            date.valueOf();
        }, "TypeError", "Node reference: Temporal.PlainDate.from(input).valueOf()");
    });

    test("PlainDate.with applies date fields and overflow like Node", function () {
        var date = Temporal.PlainDate.from("2024-02-29");

        assertNodeEquals(date.with({ year: 2023 }).toString(), "2023-02-28", "Temporal.PlainDate.from(input).with({ year: 2023 }).toString()");
        assertNodeEquals(date.with({ month: 3, day: 31 }).toString(), "2024-03-31", "Temporal.PlainDate.from(input).with({ month: 3, day: 31 }).toString()");
        assertNodeEquals(date.with({ year: 2023.9, month: 3.9, day: 1.9 }).toString(), "2023-03-01", "Temporal.PlainDate.from(input).with(fractional fields).toString()");

        assertThrowsWith(function () {
            date.with({});
        }, "TypeError", "Node reference: Temporal.PlainDate.from(input).with({})");

        assertThrowsWith(function () {
            date.with({ year: 2023 }, { overflow: "reject" });
        }, "RangeError", "Node reference: Temporal.PlainDate.from(input).with({ year: 2023 }, { overflow: 'reject' })");
    });

    test("PlainDate.add and subtract use date-only Duration fields like Node", function () {
        assertNodeEquals(Temporal.PlainDate.from("2024-01-31").add({ months: 1 }).toString(), "2024-02-29", "Temporal.PlainDate.from('2024-01-31').add({ months: 1 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add({ years: 1 }).toString(), "2025-02-28", "Temporal.PlainDate.from('2024-02-29').add({ years: 1 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-01").add({ weeks: 1 }).toString(), "2024-02-08", "Temporal.PlainDate.from('2024-02-01').add({ weeks: 1 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add({ hours: 1 }).toString(), "2024-02-29", "Temporal.PlainDate.from('2024-02-29').add({ hours: 1 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add({ hours: 23 }).toString(), "2024-02-29", "Temporal.PlainDate.from('2024-02-29').add({ hours: 23 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add({ hours: 24 }).toString(), "2024-03-01", "Temporal.PlainDate.from('2024-02-29').add({ hours: 24 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add({ hours: 25 }).toString(), "2024-03-01", "Temporal.PlainDate.from('2024-02-29').add({ hours: 25 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add({ hours: 48 }).toString(), "2024-03-02", "Temporal.PlainDate.from('2024-02-29').add({ hours: 48 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add({ hours: -24 }).toString(), "2024-02-28", "Temporal.PlainDate.from('2024-02-29').add({ hours: -24 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add({ minutes: 1440 }).toString(), "2024-03-01", "Temporal.PlainDate.from('2024-02-29').add({ minutes: 1440 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").add("PT25H").toString(), "2024-03-01", "Temporal.PlainDate.from('2024-02-29').add('PT25H').toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-03-01").subtract("P1D").toString(), "2024-02-29", "Temporal.PlainDate.from('2024-03-01').subtract('P1D').toString()");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("2023-01-31").add({ months: 1 }, { overflow: "reject" });
        }, "RangeError", "Node reference: Temporal.PlainDate.from('2023-01-31').add({ months: 1 }, { overflow: 'reject' })");
    });

    test("PlainDate.until and since match Node Temporal date-unit basics", function () {
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").until("2024-03-02").toString(), "P2D", "Temporal.PlainDate.from('2024-02-29').until('2024-03-02').toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").until("2024-03-01", { largestUnit: "auto" }).toString(), "P46D", "Temporal.PlainDate.from('2024-01-15').until('2024-03-01', { largestUnit: 'auto' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").until("2025-03-01", { largestUnit: "year" }).toString(), "P1Y1D", "Temporal.PlainDate.from('2024-02-29').until('2025-03-01', { largestUnit: 'year' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-31").until("2024-03-01", { largestUnit: "month" }).toString(), "P1M1D", "Temporal.PlainDate.from('2024-01-31').until('2024-03-01', { largestUnit: 'month' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2020-02-29").until("2024-02-29", { largestUnit: "year" }).toString(), "P4Y", "Temporal.PlainDate.from('2020-02-29').until('2024-02-29', { largestUnit: 'year' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2020-02-29").until("2022-02-28", { largestUnit: "year" }).toString(), "P1Y11M30D", "Temporal.PlainDate.from('2020-02-29').until('2022-02-28', { largestUnit: 'year' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-31").until("2024-03-31", { largestUnit: "month" }).toString(), "P2M", "Temporal.PlainDate.from('2024-01-31').until('2024-03-31', { largestUnit: 'month' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-31").until("2024-04-30", { largestUnit: "month" }).toString(), "P2M30D", "Temporal.PlainDate.from('2024-01-31').until('2024-04-30', { largestUnit: 'month' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-03-30").until("2024-01-31", { largestUnit: "month" }).toString(), "-P1M29D", "Temporal.PlainDate.from('2024-03-30').until('2024-01-31', { largestUnit: 'month' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-01").until("2024-02-15", { largestUnit: "week" }).toString(), "P2W", "Temporal.PlainDate.from('2024-02-01').until('2024-02-15', { largestUnit: 'week' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-01").until("2024-02-15", { smallestUnit: "week" }).toString(), "P2W", "Temporal.PlainDate.from('2024-02-01').until('2024-02-15', { smallestUnit: 'week' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-01").until("2024-02-11", { smallestUnit: "week", roundingMode: "halfExpand" }).toString(), "P1W", "Temporal.PlainDate.from('2024-02-01').until('2024-02-11', { smallestUnit: 'week', roundingMode: 'halfExpand' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2000-01-01").until("2030-01-01", { largestUnit: "day", smallestUnit: "day", roundingIncrement: 999 }).toString(), "P9990D", "Temporal.PlainDate.from('2000-01-01').until('2030-01-01', { largestUnit: 'day', smallestUnit: 'day', roundingIncrement: 999 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2000-01-01").until("2030-01-01", { largestUnit: "day", smallestUnit: "day", roundingIncrement: 1000 }).toString(), "P10000D", "Temporal.PlainDate.from('2000-01-01').until('2030-01-01', { largestUnit: 'day', smallestUnit: 'day', roundingIncrement: 1000 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2000-01-01").until("2030-01-01", { largestUnit: "week", smallestUnit: "week", roundingIncrement: 1000 }).toString(), "P1000W", "Temporal.PlainDate.from('2000-01-01').until('2030-01-01', { largestUnit: 'week', smallestUnit: 'week', roundingIncrement: 1000 }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").until("2024-03-01", { largestUnit: "year", smallestUnit: "month", roundingMode: "halfExpand" }).toString(), "P2M", "Temporal.PlainDate.from('2024-01-15').until('2024-03-01', { largestUnit: 'year', smallestUnit: 'month', roundingMode: 'halfExpand' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").until("2024-03-01", { largestUnit: "month", smallestUnit: "day", roundingIncrement: 10, roundingMode: "trunc" }).toString(), "P1M10D", "Temporal.PlainDate.from('2024-01-15').until('2024-03-01', { largestUnit: 'month', smallestUnit: 'day', roundingIncrement: 10, roundingMode: 'trunc' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").until("2024-03-14", { largestUnit: "month", smallestUnit: "day", roundingIncrement: 30, roundingMode: "halfExpand" }).toString(), "P2M", "Temporal.PlainDate.from('2024-01-15').until('2024-03-14', { largestUnit: 'month', smallestUnit: 'day', roundingIncrement: 30, roundingMode: 'halfExpand' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-03-14").until("2024-01-15", { largestUnit: "month", smallestUnit: "day", roundingIncrement: 30, roundingMode: "halfExpand" }).toString(), "-P1M30D", "Temporal.PlainDate.from('2024-03-14').until('2024-01-15', { largestUnit: 'month', smallestUnit: 'day', roundingIncrement: 30, roundingMode: 'halfExpand' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").until("2024-03-14", { largestUnit: "month", smallestUnit: "day", roundingIncrement: 1000, roundingMode: "ceil" }).toString(), "P2M", "Temporal.PlainDate.from('2024-01-15').until('2024-03-14', { largestUnit: 'month', smallestUnit: 'day', roundingIncrement: 1000, roundingMode: 'ceil' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2023-01-31").until("2023-12-31", { largestUnit: "year", smallestUnit: "day", roundingIncrement: 2, roundingMode: "halfExpand" }).toString(), "P11M", "Temporal.PlainDate.from('2023-01-31').until('2023-12-31', { largestUnit: 'year', smallestUnit: 'day', roundingIncrement: 2, roundingMode: 'halfExpand' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").until("2024-02-01", { largestUnit: "year", smallestUnit: "month", roundingMode: "trunc" }).toString(), "PT0S", "Temporal.PlainDate.from('2024-01-15').until('2024-02-01', { largestUnit: 'year', smallestUnit: 'month', roundingMode: 'trunc' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-03-01").until("2024-01-15", { largestUnit: "year", smallestUnit: "month", roundingMode: "floor" }).toString(), "-P2M", "Temporal.PlainDate.from('2024-03-01').until('2024-01-15', { largestUnit: 'year', smallestUnit: 'month', roundingMode: 'floor' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").until("2024-04-20", { largestUnit: "year", smallestUnit: "month", roundingIncrement: 2, roundingMode: "halfExpand" }).toString(), "P4M", "Temporal.PlainDate.from('2024-01-15').until('2024-04-20', { largestUnit: 'year', smallestUnit: 'month', roundingIncrement: 2, roundingMode: 'halfExpand' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").until("2024-07-16", { largestUnit: "year", smallestUnit: "year", roundingMode: "halfExpand" }).toString(), "P1Y", "Temporal.PlainDate.from('2024-01-15').until('2024-07-16', { largestUnit: 'year', smallestUnit: 'year', roundingMode: 'halfExpand' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-03-01").since("2024-01-31", { largestUnit: "month" }).toString(), "P1M1D", "Temporal.PlainDate.from('2024-03-01').since('2024-01-31', { largestUnit: 'month' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2000-06-29").since("2057-03-15", { largestUnit: "month" }).toString(), "-P680M15D", "Temporal.PlainDate.from('2000-06-29').since('2057-03-15', { largestUnit: 'month' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("1979-10-18").since("1974-03-29", { largestUnit: "year" }).toString(), "P5Y6M20D", "Temporal.PlainDate.from('1979-10-18').since('1974-03-29', { largestUnit: 'year' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").since("2024-03-01", { largestUnit: "month", smallestUnit: "day", roundingIncrement: 10, roundingMode: "ceil" }).toString(), "-P1M10D", "Temporal.PlainDate.from('2024-01-15').since('2024-03-01', { largestUnit: 'month', smallestUnit: 'day', roundingIncrement: 10, roundingMode: 'ceil' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-01-15").since("2024-03-01", { largestUnit: "month", smallestUnit: "day", roundingIncrement: 10, roundingMode: "floor" }).toString(), "-P1M20D", "Temporal.PlainDate.from('2024-01-15').since('2024-03-01', { largestUnit: 'month', smallestUnit: 'day', roundingIncrement: 10, roundingMode: 'floor' }).toString()");
        assertNodeEquals(Temporal.PlainDate.from("2024-03-01").until("2024-02-29").toString(), "-P1D", "Temporal.PlainDate.from('2024-03-01').until('2024-02-29').toString()");

        assertThrowsWith(function () {
            Temporal.PlainDate.from("2024-02-29").until("2024-03-01", { smallestUnit: "hour" });
        }, "RangeError", "Node reference: Temporal.PlainDate.from(input).until(other, { smallestUnit: 'hour' })");
    });

    test("PlainDate.toPlainDateTime combines date and time like Node", function () {
        var date = Temporal.PlainDate.from("2024-02-29");
        var withPlainTime = date.toPlainDateTime(Temporal.PlainTime.from("23:59:58.987"));

        assert(date.toPlainDateTime() instanceof Temporal.PlainDateTime, "toPlainDateTime should return a PlainDateTime");
        assertNodeEquals(date.toPlainDateTime().toString(), "2024-02-29T00:00:00", "Temporal.PlainDate.from(input).toPlainDateTime().toString()");
        assertNodeEquals(date.toPlainDateTime(undefined).toString(), "2024-02-29T00:00:00", "Temporal.PlainDate.from(input).toPlainDateTime(undefined).toString()");
        assertNodeEquals(date.toPlainDateTime("10:20:30.123").toString(), "2024-02-29T10:20:30.123", "Temporal.PlainDate.from(input).toPlainDateTime('10:20:30.123').toString()");
        assertNodeEquals(date.toPlainDateTime({ hour: 8, minute: 5 }).toString(), "2024-02-29T08:05:00", "Temporal.PlainDate.from(input).toPlainDateTime({ hour: 8, minute: 5 }).toString()");
        assertNodeEquals(withPlainTime.toString(), "2024-02-29T23:59:58.987", "Temporal.PlainDate.from(input).toPlainDateTime(Temporal.PlainTime.from(input)).toString()");
        assertNodeEquals(date.toPlainDateTime({ year: 2000, hour: 1 }).toString(), "2024-02-29T01:00:00", "Temporal.PlainDate.from(input).toPlainDateTime({ year: 2000, hour: 1 }).toString()");
        assertNodeEquals(date.toPlainDateTime({ hour: 24 }).toString(), "2024-02-29T23:00:00", "Temporal.PlainDate.from(input).toPlainDateTime({ hour: 24 }).toString()");

        assertThrowsWith(function () {
            date.toPlainDateTime(null);
        }, "TypeError", "Node reference: Temporal.PlainDate.from(input).toPlainDateTime(null)");

        assertThrowsWith(function () {
            date.toPlainDateTime("10:20Z");
        }, "RangeError", "Node reference: Temporal.PlainDate.from(input).toPlainDateTime('10:20Z')");
    });

    test("PlainDate.toPlainYearMonth returns the matching separate Temporal type", function () {
        var leapDay = Temporal.PlainDate.from("2024-02-29");
        var yearMonth = leapDay.toPlainYearMonth();

        assert(yearMonth instanceof Temporal.PlainYearMonth, "toPlainYearMonth should return a PlainYearMonth");
        assertNodeEquals(yearMonth.toString(), "2024-02", "Temporal.PlainDate.from('2024-02-29').toPlainYearMonth().toString()");
        assertNodeEquals(Temporal.PlainDate.from("-271821-04-19").toPlainYearMonth().toString(), "-271821-04", "minimum PlainDate toPlainYearMonth");
        assertNodeEquals(Temporal.PlainDate.from("+275760-09-13").toPlainYearMonth().toString(), "+275760-09", "maximum PlainDate toPlainYearMonth");
    });

    test("PlainDate.toPlainMonthDay returns the matching separate Temporal type", function () {
        var leapDay = Temporal.PlainDate.from("2024-02-29");
        var monthDay = leapDay.toPlainMonthDay();

        assert(monthDay instanceof Temporal.PlainMonthDay, "toPlainMonthDay should return a PlainMonthDay");
        assertNodeEquals(monthDay.toString(), "02-29", "Temporal.PlainDate.from('2024-02-29').toPlainMonthDay().toString()");
        assertNodeEquals(monthDay.monthCode, "M02", "Temporal.PlainDate.from('2024-02-29').toPlainMonthDay().monthCode");
        assertNodeEquals(monthDay.day, 29, "Temporal.PlainDate.from('2024-02-29').toPlainMonthDay().day");
        assertNodeEquals(Temporal.PlainDate.from("2023-12-31").toPlainMonthDay().toString(), "12-31", "Temporal.PlainDate.from('2023-12-31').toPlainMonthDay().toString()");
    });

    test("PlainDate exposes ISO-derived fields like Node", function () {
        var leapDay = Temporal.PlainDate.from("2024-02-29");
        var previousWeekYear = Temporal.PlainDate.from("2021-01-01");
        var nextWeekYear = Temporal.PlainDate.from("2024-12-30");

        assertNodeEquals(leapDay.daysInWeek, 7, "Temporal.PlainDate.from('2024-02-29').daysInWeek");
        assertNodeEquals(leapDay.monthsInYear, 12, "Temporal.PlainDate.from('2024-02-29').monthsInYear");
        assertNodeEquals(leapDay.weekOfYear, 9, "Temporal.PlainDate.from('2024-02-29').weekOfYear");
        assertNodeEquals(leapDay.yearOfWeek, 2024, "Temporal.PlainDate.from('2024-02-29').yearOfWeek");
        assertNodeEquals(previousWeekYear.weekOfYear, 53, "Temporal.PlainDate.from('2021-01-01').weekOfYear");
        assertNodeEquals(previousWeekYear.yearOfWeek, 2020, "Temporal.PlainDate.from('2021-01-01').yearOfWeek");
        assertNodeEquals(nextWeekYear.weekOfYear, 1, "Temporal.PlainDate.from('2024-12-30').weekOfYear");
        assertNodeEquals(nextWeekYear.yearOfWeek, 2025, "Temporal.PlainDate.from('2024-12-30').yearOfWeek");
    });

    writeLine("Passed: " + results.passed + ", \nFailed: " + results.failed + ", \nSkipped: " + results.skipped);

    if (results.failed > 0) {
        throw new Error("Temporal PlainDate tests failed: " + results.failed);
    }
})();
