//@include "../../Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"

if (typeof require === "function" && typeof process !== "undefined") {
    (function () {
        var fs = require("fs");
        var path = require("path");

        function load(relativePath) {
            (0, eval)(fs.readFileSync(path.join(__dirname, relativePath), "utf8"));
        }

        load("../Lib/Temporal-core.js");
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
			if (typeof process !== "undefined" && process.versions && process.versions.node) {
				assertEquals(error.name, expectedName, message || "Unexpected error name");
			} else if (expectedName === "TypeError") {
				assert(error instanceof TypeError, message || "Unexpected error type");
			} else if (expectedName === "RangeError") {
				assert(error instanceof RangeError, message || "Unexpected error type");
			} else {
				assertEquals(error.name, expectedName, message || "Unexpected error name");
			}
			return;
		}

		fail(message || "Expected function to throw");
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

    writeLine("Temporal core ExtendScript polyfill tests");
    writeLine("------------------------------------------");

    test("Temporal namespace and shared helpers are loaded", function () {
        assert(typeof Temporal === "object", "Temporal namespace should exist");
        assert(typeof Temporal.__pad__ === "function", "Temporal.__pad__ should exist");
        assert(typeof Temporal.__singularUnit__ === "function", "Temporal.__singularUnit__ should exist");
        assert(typeof Temporal.__toInteger__ === "function", "Temporal.__toInteger__ should exist");
        assert(typeof Temporal.__normalizeOptions__ === "function", "Temporal.__normalizeOptions__ should exist");
        assert(typeof Temporal.__timeToMilliseconds__ === "function", "Temporal.__timeToMilliseconds__ should exist");
        assert(typeof Temporal.__timeUnitToMilliseconds__ === "function", "Temporal.__timeUnitToMilliseconds__ should exist");
        assert(typeof Temporal.__isValidRoundingMode__ === "function", "Temporal.__isValidRoundingMode__ should exist");
		assert(typeof Temporal.__formatISOMonthCode__ === "function", "Temporal.__formatISOMonthCode__ should exist");
		assert(typeof Temporal.__parseISOMonthCode__ === "function", "Temporal.__parseISOMonthCode__ should exist");
		assert(typeof Temporal.__resolveISOMonth__ === "function", "Temporal.__resolveISOMonth__ should exist");
        assert(typeof Temporal.__formatISO__ === "function", "Temporal.__formatISO__ should exist");
        assert(typeof Temporal.__roundField__ === "function", "Temporal.__roundField__ should exist");
        assert(typeof Temporal.__daySerialToDate__ === "function", "Temporal.__daySerialToDate__ should exist");
        assert(typeof Temporal.__millisecondsToTimeDurationFields__ === "function", "Temporal.__millisecondsToTimeDurationFields__ should exist");
        assert(typeof Temporal.__validateTimeRoundingIncrement__ === "function", "Temporal.__validateTimeRoundingIncrement__ should exist");
        assert(typeof Temporal.__isLeapYear__ === "function", "Temporal.__isLeapYear__ should exist");
        assert(typeof Temporal.__validateDate__ === "function", "Temporal.__validateDate__ should exist");
        assert(typeof Temporal.__computeDayOfWeek__ === "function", "Temporal.__computeDayOfWeek__ should exist");
        assert(typeof Temporal.__computeDayOfYear__ === "function", "Temporal.__computeDayOfYear__ should exist");
        assert(typeof Temporal.__computeDaysInMonth__ === "function", "Temporal.__computeDaysInMonth__ should exist");
        assert(typeof Temporal.__parseISOString__ === "function", "Temporal.__parseISOString__ should exist");
        assert(typeof Temporal.__compareISODate__ === "function", "Temporal.__compareISODate__ should exist");
        assert(typeof Temporal.__compareTimeRecord__ === "function", "Temporal.__compareTimeRecord__ should exist");
        assert(typeof Temporal.__balanceDateUnits__ === "function", "Temporal.__balanceDateUnits__ should exist");
        assert(typeof Temporal.__balanceTimeUnits__ === "function", "Temporal.__balanceTimeUnits__ should exist");
        assert(typeof Temporal.__isBetween__ === "function", "Temporal.__isBetween__ should exist");
        assertEquals(Temporal.__MILLISECONDS_PER_SECOND__, 1000, "milliseconds per second");
        assertEquals(Temporal.__MILLISECONDS_PER_MINUTE__, 60000, "milliseconds per minute");
        assertEquals(Temporal.__MILLISECONDS_PER_HOUR__, 3600000, "milliseconds per hour");
        assertEquals(Temporal.__MILLISECONDS_PER_DAY__, 86400000, "milliseconds per day");
        assertEquals(Temporal.__MILLISECONDS_PER_WEEK__, 604800000, "milliseconds per week");
        assertEquals(Temporal.__MIN_INSTANT_EPOCH_MILLISECONDS__, -8640000000000000, "minimum Instant epoch milliseconds");
        assertEquals(Temporal.__MAX_INSTANT_EPOCH_MILLISECONDS__, 8640000000000000, "maximum Instant epoch milliseconds");
    });

	test("ISO monthCode helpers format, parse, and resolve property bags", function () {
		assertEquals(Temporal.__formatISOMonthCode__(1), "M01", "January monthCode");
		assertEquals(Temporal.__formatISOMonthCode__(12), "M12", "December monthCode");
		assertEquals(Temporal.__parseISOMonthCode__("M05"), 5, "parse ISO monthCode");
		assertEquals(Temporal.__resolveISOMonth__({ monthCode: "M05" }), 5, "resolve monthCode-only bag");
		assertEquals(Temporal.__resolveISOMonth__({ month: 5, monthCode: "M05" }), 5, "resolve matching month fields");

		assertThrowsWith(function () {
			Temporal.__resolveISOMonth__({ month: 6, monthCode: "M05" });
		}, "RangeError", "mismatching month fields should throw");

		assertThrowsWith(function () {
			Temporal.__parseISOMonthCode__("M05L");
		}, "RangeError", "non-ISO leap monthCode should throw");

		var invalidCodes = ["M00", "M13", "M5", "m05"];
		for (var i = 0; i < invalidCodes.length; i++) {
			(function (invalidCode) {
				assertThrowsWith(function () {
					Temporal.__parseISOMonthCode__(invalidCode);
				}, "RangeError", "invalid ISO monthCode should throw: " + invalidCode);
			}(invalidCodes[i]));
		}
	});

    test("Date and ISO formatting helpers match expected ISO output", function () {
        assertEquals(Temporal.__pad__(5, 2), "05", "pad two digits");
        assertEquals(Temporal.__singularUnit__("days"), "day", "singular date unit");
        assertEquals(Temporal.__singularUnit__("milliseconds"), "millisecond", "singular time unit");
        assertEquals(Temporal.__singularUnit__("auto"), "auto", "unknown unit passthrough");
        assertEquals(Temporal.__toInteger__(2024.9), 2024, "positive integer truncation");
        assertEquals(Temporal.__timeToMilliseconds__({ hour: 1, minute: 2, second: 3, millisecond: 4 }), 3723004, "time fields to milliseconds");
        assertEquals(Temporal.__timeUnitToMilliseconds__("minute"), 60000, "minute to milliseconds");
        assertEquals(Temporal.__timeUnitToMilliseconds__("day"), 86400000, "day to milliseconds");
        assertEquals(Temporal.__timeUnitToMilliseconds__("year"), 0, "non-fixed unit has no millisecond value");
        assertEquals(Temporal.__isValidRoundingMode__("halfEven"), true, "known rounding mode");
        assertEquals(Temporal.__isValidRoundingMode__("banana"), false, "unknown rounding mode");
        assert(typeof Temporal.__normalizeOptions__(undefined) === "object", "undefined options normalize to object");
        assertEquals(Temporal.__toInteger__(-2.9), -2, "negative integer truncation");
        assertEquals(
            Temporal.__formatISO__({ year: 2024, month: 2, day: 29, hour: 10, minute: 20, second: 30, millisecond: 123 }, "PlainDateTime"),
            "2024-02-29T10:20:30.123",
            "PlainDateTime format"
        );
        assertEquals(
            Temporal.__formatISO__({ year: 2024, month: 2, day: 29 }, "PlainDate"),
            "2024-02-29",
            "PlainDate format"
        );
        assertEquals(
            Temporal.__formatISO__({ year: 10000, month: 1, day: 1 }, "PlainDate"),
            "+010000-01-01",
            "positive extended year format"
        );
        assertEquals(
            Temporal.__formatISO__({ year: -1, month: 1, day: 1 }, "PlainDate"),
            "-000001-01-01",
            "negative extended year format"
        );
        assertEquals(
            Temporal.__formatISO__({ hour: 10, minute: 20, second: 30, millisecond: 123 }, "PlainTime"),
            "10:20:30.123",
            "PlainTime format"
        );
        assertEquals(
            Temporal.__formatISO__({ month: 2, day: 29 }, "PlainMonthDay"),
            "02-29",
            "PlainMonthDay format"
        );
    });

    test("Core-only ISO parsers are not exposed on Temporal", function () {
        var parsed = Temporal.__parseISOString__("2024-02-29T12:34:56.789");

        assertEquals(typeof Temporal.parseISODateString, "undefined", "date parser stays private");
        assertEquals(typeof Temporal.parseISOTimeString, "undefined", "time parser stays private");
        assertEquals(typeof Temporal.parseISOString, "undefined", "public-looking combined parser is absent");
        assertEquals(parsed.year, 2024, "combined parser year");
        assertEquals(parsed.month, 2, "combined parser month");
        assertEquals(parsed.day, 29, "combined parser day");
        assertEquals(parsed.hour, 12, "combined parser hour");
        assertEquals(parsed.millisecond, 789, "combined parser millisecond");
    });

    test("Calendar math helpers cover leap-day basics", function () {
        assertEquals(typeof Temporal.isLeapYear, "undefined", "public-looking isLeapYear is absent");
        assertEquals(typeof Temporal.validateDate, "undefined", "public-looking validateDate is absent");
        assertEquals(typeof Temporal.computeDayOfWeek, "undefined", "public-looking computeDayOfWeek is absent");
        assertEquals(typeof Temporal.computeDayOfYear, "undefined", "public-looking computeDayOfYear is absent");
        assertEquals(typeof Temporal.computeDaysInMonth, "undefined", "public-looking computeDaysInMonth is absent");
        assertEquals(Temporal.__isLeapYear__(2024), true, "2024 is leap year");
        assertEquals(Temporal.__computeDaysInMonth__(2024, 2), 29, "February 2024 days");
        assertEquals(Temporal.__computeDayOfWeek__(0, 1, 1), 6, "year zero starts on Saturday");
        assertEquals(Temporal.__computeDayOfWeek__(-1, 1, 1), 5, "year minus one starts on Friday");
        assertEquals(Temporal.__validateDate__(-271821, 4, 19, "reject").day, 19, "minimum ISO date");
        assertEquals(Temporal.__validateDate__(275760, 9, 13, "reject").day, 13, "maximum ISO date");
        assertEquals(
            Temporal.__daysBetweenDates__({ year: 2024, month: 2, day: 28 }, { year: 2024, month: 3, day: 1 }),
            2,
            "days between leap day boundary"
        );
    });

    test("Comparison helpers stay internal", function () {
        assertEquals(typeof Temporal.compareISODate, "undefined", "public-looking date comparator is absent");
        assertEquals(typeof Temporal.compareTimeRecord, "undefined", "public-looking time comparator is absent");
        assertEquals(
            Temporal.__compareISODate__(
                { year: 2024, month: 2, day: 28 },
                { year: 2024, month: 2, day: 29 }
            ),
            -1,
            "internal date comparator"
        );
        assertEquals(
            Temporal.__compareTimeRecord__(
                { hour: 12, minute: 0, second: 0, millisecond: 0 },
                { hour: 11, minute: 59, second: 59, millisecond: 999 }
            ),
            1,
            "internal time comparator"
        );
    });

    test("Balancing helpers stay internal", function () {
        var date = Temporal.__balanceDateUnits__(2024, 13, 0);
        var time = Temporal.__balanceTimeUnits__(25, 61, 61, 1001);

        assertEquals(typeof Temporal.balanceDateUnits, "undefined", "public-looking date balancer is absent");
        assertEquals(typeof Temporal.balanceTimeUnits, "undefined", "public-looking time balancer is absent");
        assertEquals(date.year, 2024, "balanced date year");
        assertEquals(date.month, 12, "balanced date month");
        assertEquals(date.day, 31, "balanced date day");
        assertEquals(time.extraDays, 1, "balanced time extra days");
        assertEquals(time.hour, 2, "balanced time hour");
        assertEquals(time.minute, 2, "balanced time minute");
        assertEquals(time.second, 2, "balanced time second");
        assertEquals(time.millisecond, 1, "balanced time millisecond");
    });

    test("Range helper stays internal", function () {
        assertEquals(typeof Temporal.isBetween, "undefined", "public-looking range helper is absent");
        assertEquals(Temporal.__isBetween__(15, 1, 12, "constrain"), 12, "range helper constrains high value");
        assertEquals(Temporal.__isBetween__(-1, 0, 23, "constrain"), 0, "range helper constrains low value");
        assertThrowsWith(function () {
            Temporal.__isBetween__(13, 1, 12, "reject");
        }, "RangeError", "range helper rejects high value");
    });

    test("Shared fixed-time helpers support Instant without duplicate implementations", function () {
        var epochDate = Temporal.__daySerialToDate__(0);
        var positive = Temporal.__millisecondsToTimeDurationFields__(90061001, "hour");
        var negative = Temporal.__millisecondsToTimeDurationFields__(-90061001, "minute");

        assertEquals(epochDate.year, 1970, "epoch year");
        assertEquals(epochDate.month, 1, "epoch month");
        assertEquals(epochDate.day, 1, "epoch day");
        assertEquals(
            Temporal.__dateToDaySerial__(epochDate.year, epochDate.month, epochDate.day),
            0,
            "day serial round trip"
        );
        assertEquals(positive.hours, 25, "positive fixed-time hours");
        assertEquals(positive.minutes, 1, "positive fixed-time minutes");
        assertEquals(positive.seconds, 1, "positive fixed-time seconds");
        assertEquals(positive.milliseconds, 1, "positive fixed-time milliseconds");
        assertEquals(negative.minutes, -1501, "negative fixed-time minutes");
        assertEquals(negative.seconds, -1, "negative fixed-time seconds");
        assertEquals(negative.milliseconds, -1, "negative fixed-time milliseconds");
        assertEquals(Temporal.__validateTimeRoundingIncrement__(30, "second", false), 30, "valid difference increment");
        assertEquals(Temporal.__validateTimeRoundingIncrement__(24, "hour", true), 24, "valid round maximum");

        assertThrowsWith(function () {
            Temporal.__validateTimeRoundingIncrement__(60, "second", false);
        }, "RangeError", "difference increment cannot equal radix");
    });

    writeLine("------------------------------------------");
    writeLine("Passed:  " + results.passed);
    writeLine("Failed:  " + results.failed);
    writeLine("Skipped: " + results.skipped);

    if (results.failed > 0) {
        throw new Error("Temporal core tests failed: " + results.failed);
    }
}());
