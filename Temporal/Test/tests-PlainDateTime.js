//@include "../../Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
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

    function assertThrows(fn, message) {
        var thrown = false;

        try {
            fn();
        } catch (error) {
            thrown = true;
        }

        if (!thrown) {
            fail(message || "Expected function to throw");
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
            writeLine("       " + error);
        }
    }

    function skip(name, reason) {
        results.skipped++;
        writeLine("[SKIP] " + name + (reason ? " - " + reason : ""));
    }

    writeLine("Temporal PlainDateTime ExtendScript polyfill tests");
    writeLine("--------------------------------------------------");

    test("Temporal namespace is loaded", function () {
        assert(typeof Temporal === "object", "Temporal namespace should exist");
        assert(typeof Temporal.Duration === "function", "Temporal.Duration should exist");
        assert(typeof Temporal.PlainDateTime === "function", "Temporal.PlainDateTime should exist");
        assert(typeof Temporal.PlainDate === "function", "Temporal.PlainDate should exist");
        assert(typeof Temporal.PlainTime === "function", "Temporal.PlainTime should exist");
        assert(typeof Temporal.__rangeError__ === "function", "Temporal.__rangeError__ should exist");
        assertEquals(Temporal.__rangeError__("test").name, "RangeError", "Temporal.__rangeError__ should preserve error name");
        assert(typeof Temporal.__pad__ === "function", "Temporal.__pad__ should exist");
        assertEquals(Temporal.__pad__(5, 2), "05", "Temporal.__pad__ should left-pad values");
        assert(typeof Temporal.__formatISO__ === "function", "Temporal.__formatISO__ should exist");
        assertEquals(
            Temporal.__formatISO__({ year: 2024, month: 2, day: 29, hour: 10, minute: 20, second: 30, millisecond: 123 }, "PlainDateTime"),
            "2024-02-29T10:20:30.123",
            "Temporal.__formatISO__ should format PlainDateTime fields"
        );
        assertEquals(
            Temporal.__formatISO__({ year: 2024, month: 2, day: 29 }, "PlainDate"),
            "2024-02-29",
            "Temporal.__formatISO__ should format PlainDate fields"
        );
        assertEquals(
            Temporal.__formatISO__({ hour: 10, minute: 20, second: 30, millisecond: 123 }, "PlainTime"),
            "10:20:30.123",
            "Temporal.__formatISO__ should format PlainTime fields"
        );
    });

    test("PlainDateTime.from parses an ISO date-time like Node", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

        assertNodeEquals(dateTime.year, 2024, "Temporal.PlainDateTime.from(input).year");
        assertNodeEquals(dateTime.month, 2, "Temporal.PlainDateTime.from(input).month");
        assertNodeEquals(dateTime.day, 29, "Temporal.PlainDateTime.from(input).day");
        assertNodeEquals(dateTime.hour, 10, "Temporal.PlainDateTime.from(input).hour");
        assertNodeEquals(dateTime.minute, 20, "Temporal.PlainDateTime.from(input).minute");
        assertNodeEquals(dateTime.second, 30, "Temporal.PlainDateTime.from(input).second");
        assertNodeEquals(dateTime.millisecond, 123, "Temporal.PlainDateTime.from(input).millisecond");
        assertNodeEquals(dateTime.toString(), "2024-02-29T10:20:30.123", "Temporal.PlainDateTime.from(input).toString()");
    });

	test("PlainDateTime exposes and accepts ISO monthCode and calendarId like Node", function () {
		var dateTime = new Temporal.PlainDateTime(2024, 5, 17, 10, 20, 30, 123);

		assertNodeEquals(dateTime.monthCode, "M05", "new Temporal.PlainDateTime(2024, 5, 17, 10, 20, 30, 123).monthCode");
		assertNodeEquals(dateTime.calendarId, "iso8601", "new Temporal.PlainDateTime(2024, 5, 17, 10, 20, 30, 123).calendarId");
		assertNodeEquals(Temporal.PlainDateTime.from({ year: 2024, monthCode: "M05", day: 17, hour: 10, minute: 20 }).toString(), "2024-05-17T10:20:00", "PlainDateTime.from(monthCode-only bag)");
		assertNodeEquals(Temporal.PlainDateTime.from({ year: 2024, month: 5, monthCode: "M05", day: 17, hour: 10, minute: 20 }).toString(), "2024-05-17T10:20:00", "PlainDateTime.from(matching month fields)");
		assertNodeEquals(dateTime.with({ monthCode: "M06" }).toString(), "2024-06-17T10:20:30.123", "PlainDateTime.with(monthCode-only bag)");
		assertNodeEquals(dateTime.with({ month: 6, monthCode: "M06" }).toString(), "2024-06-17T10:20:30.123", "PlainDateTime.with(matching month fields)");

		assertThrowsWith(function () {
			Temporal.PlainDateTime.from({ year: 2024, month: 6, monthCode: "M05", day: 17 });
		}, "RangeError", "Node reference: PlainDateTime.from(mismatching month fields)");

		assertThrowsWith(function () {
			dateTime.with({ month: 6, monthCode: "M05" });
		}, "RangeError", "Node reference: PlainDateTime.with(mismatching month fields)");

		assertThrowsWith(function () {
			Temporal.PlainDateTime.from({ year: 2024, monthCode: "M05L", day: 17 });
		}, "RangeError", "Node reference: PlainDateTime.from(non-ISO leap monthCode)");
	});

    test("PlainDateTime.toString options match Node Temporal ISO output", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

        assertNodeEquals(dateTime.toString({}), "2024-02-29T10:20:30.123", "PlainDateTime.toString({})");
        assertNodeEquals(dateTime.toString({ smallestUnit: "second" }), "2024-02-29T10:20:30", "PlainDateTime.toString second");
        assertNodeEquals(dateTime.toString({ smallestUnit: "seconds" }), "2024-02-29T10:20:30", "PlainDateTime.toString plural seconds");
        assertNodeEquals(dateTime.toString({ smallestUnit: "minute" }), "2024-02-29T10:20", "PlainDateTime.toString minute");
        assertNodeEquals(dateTime.toString({ smallestUnit: "minutes" }), "2024-02-29T10:20", "PlainDateTime.toString plural minutes");
        assertNodeEquals(dateTime.toString({ smallestUnit: "millisecond" }), "2024-02-29T10:20:30.123", "PlainDateTime.toString millisecond");
        assertNodeEquals(dateTime.toString({ smallestUnit: "microsecond" }), "2024-02-29T10:20:30.123000", "PlainDateTime.toString microsecond");
        assertNodeEquals(dateTime.toString({ smallestUnit: "nanosecond" }), "2024-02-29T10:20:30.123000000", "PlainDateTime.toString nanosecond");
        assertNodeEquals(dateTime.toString({ fractionalSecondDigits: 0 }), "2024-02-29T10:20:30", "PlainDateTime.toString fractional 0");
        assertNodeEquals(dateTime.toString({ fractionalSecondDigits: 1 }), "2024-02-29T10:20:30.1", "PlainDateTime.toString fractional 1");
        assertNodeEquals(dateTime.toString({ fractionalSecondDigits: 2 }), "2024-02-29T10:20:30.12", "PlainDateTime.toString fractional 2");
        assertNodeEquals(dateTime.toString({ fractionalSecondDigits: 6 }), "2024-02-29T10:20:30.123000", "PlainDateTime.toString fractional 6");
        assertNodeEquals(dateTime.toString({ fractionalSecondDigits: 9 }), "2024-02-29T10:20:30.123000000", "PlainDateTime.toString fractional 9");
        assertNodeEquals(dateTime.toString({ fractionalSecondDigits: 2, roundingMode: "ceil" }), "2024-02-29T10:20:30.13", "PlainDateTime.toString fractional ceil");
        assertNodeEquals(dateTime.toString({ fractionalSecondDigits: 1.5 }), "2024-02-29T10:20:30.1", "PlainDateTime.toString fractional non-integer");
        assertNodeEquals(dateTime.toString({ fractionalSecondDigits: 0, roundingMode: "ceil" }), "2024-02-29T10:20:31", "PlainDateTime.toString second ceil via fractional 0");
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T23:59:59.500").toString({ fractionalSecondDigits: 0, roundingMode: "halfExpand" }),
            "2024-03-01T00:00:00",
            "PlainDateTime.toString fractional halfExpand day rollover"
        );
        assertNodeEquals(dateTime.toString({ smallestUnit: "second", roundingMode: "ceil" }), "2024-02-29T10:20:31", "PlainDateTime.toString second ceil");
        assertNodeEquals(dateTime.toString({ smallestUnit: "minute", roundingMode: "halfExpand" }), "2024-02-29T10:21", "PlainDateTime.toString minute halfExpand");
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T23:59:59.999").toString({ smallestUnit: "second", roundingMode: "ceil" }),
            "2024-03-01T00:00:00",
            "PlainDateTime.toString second ceil day rollover"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T10:20:30").toString({ smallestUnit: "milliseconds" }),
            "2024-02-29T10:20:30.000",
            "PlainDateTime.toString plural milliseconds zero padding"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T10:20:30").toString({ smallestUnit: "microseconds" }),
            "2024-02-29T10:20:30.000000",
            "PlainDateTime.toString plural microseconds zero padding"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T10:20:30").toString({ smallestUnit: "nanoseconds" }),
            "2024-02-29T10:20:30.000000000",
            "PlainDateTime.toString plural nanoseconds zero padding"
        );

        assertThrowsWith(function () {
            dateTime.toString({ smallestUnit: "hour" });
        }, "RangeError", "toString hour smallestUnit should throw like Node");

        assertThrowsWith(function () {
            dateTime.toString({ smallestUnit: "day" });
        }, "RangeError", "toString day smallestUnit should throw like Node");

        assertThrowsWith(function () {
            dateTime.toString({ smallestUnit: "banana" });
        }, "RangeError", "toString invalid smallestUnit should throw like Node");

        assertThrowsWith(function () {
            dateTime.toString({ smallestUnit: "second", roundingMode: "bad" });
        }, "RangeError", "toString invalid roundingMode should throw like Node");

        assertThrowsWith(function () {
            dateTime.toString({ fractionalSecondDigits: 10 });
        }, "RangeError", "toString invalid fractionalSecondDigits should throw like Node");

        assertThrowsWith(function () {
            dateTime.toString(null);
        }, "TypeError", "toString null options should throw like Node");
    });

    test("PlainDateTime.add handles leap-day calendar addition like Node", function () {
        var result = Temporal.PlainDateTime.from("2024-02-28T00:00:00").add(Temporal.Duration.from("P1D"));

        assertNodeEquals(
            result.toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from('2024-02-28T00:00:00').add(Temporal.Duration.from('P1D')).toString()"
        );
    });

    test("PlainDateTime.add and subtract match Node Temporal calendar and time edge cases", function () {
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-01-31T10:20:30").add(Temporal.Duration.from("P1M")).toString(),
            "2024-02-29T10:20:30",
            "Temporal.PlainDateTime.from('2024-01-31T10:20:30').add(Temporal.Duration.from('P1M')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2023-01-31T10:20:30").add(Temporal.Duration.from("P1M")).toString(),
            "2023-02-28T10:20:30",
            "Temporal.PlainDateTime.from('2023-01-31T10:20:30').add(Temporal.Duration.from('P1M')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T10:20:30").add(Temporal.Duration.from("P1Y")).toString(),
            "2025-02-28T10:20:30",
            "Temporal.PlainDateTime.from('2024-02-29T10:20:30').add(Temporal.Duration.from('P1Y')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T23:59:59.999").add(Temporal.Duration.from("PT0.001S")).toString(),
            "2024-03-01T00:00:00",
            "Temporal.PlainDateTime.from('2024-02-29T23:59:59.999').add(Temporal.Duration.from('PT0.001S')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-03-01T00:00:00").subtract(Temporal.Duration.from("PT0.001S")).toString(),
            "2024-02-29T23:59:59.999",
            "Temporal.PlainDateTime.from('2024-03-01T00:00:00').subtract(Temporal.Duration.from('PT0.001S')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-03-01T00:00:00").add(Temporal.Duration.from("-P1D")).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from('2024-03-01T00:00:00').add(Temporal.Duration.from('-P1D')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-03-01T00:00:00").subtract(Temporal.Duration.from("-P1D")).toString(),
            "2024-03-02T00:00:00",
            "Temporal.PlainDateTime.from('2024-03-01T00:00:00').subtract(Temporal.Duration.from('-P1D')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-01-31T10:20:30").add({ months: 1 }).toString(),
            "2024-02-29T10:20:30",
            "Temporal.PlainDateTime.from('2024-01-31T10:20:30').add({ months: 1 }).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-01T00:00:00").add(Temporal.Duration.from("P1W")).toString(),
            "2024-02-08T00:00:00",
            "Temporal.PlainDateTime.from('2024-02-01T00:00:00').add(Temporal.Duration.from('P1W')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-08T00:00:00").subtract(Temporal.Duration.from("P1W")).toString(),
            "2024-02-01T00:00:00",
            "Temporal.PlainDateTime.from('2024-02-08T00:00:00').subtract(Temporal.Duration.from('P1W')).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-01-31T10:20:30").add({ months: 1 }, {}).toString(),
            "2024-02-29T10:20:30",
            "Temporal.PlainDateTime.from('2024-01-31T10:20:30').add({ months: 1 }, {}).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-01-31T10:20:30").add({ months: 1 }, { overflow: undefined }).toString(),
            "2024-02-29T10:20:30",
            "Temporal.PlainDateTime.from('2024-01-31T10:20:30').add({ months: 1 }, { overflow: undefined }).toString()"
        );

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2023-01-31T10:20:30").add(Temporal.Duration.from("P1M"), { overflow: "reject" });
        }, "RangeError", "add month-end with reject should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T10:20:30").add(Temporal.Duration.from("P1Y"), { overflow: "reject" });
        }, "RangeError", "add leap day year with reject should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-01-31T10:20:30").add({ months: 1 }, { overflow: "balance" });
        }, "RangeError", "add invalid overflow should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-01-31T10:20:30").add(null);
        }, "TypeError", "add null duration should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-01-31T10:20:30").subtract(null);
        }, "TypeError", "subtract null duration should throw like Node");
    });

    test("PlainDateTime.from validates month/day combinations like Node", function () {
        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-31T00:00:00", { overflow: "reject" });
        }, "RangeError", "invalid ISO string with reject should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2023-02-29T00:00:00");
        }, "RangeError", "invalid ISO string should throw like Node");

        assertNodeEquals(
            Temporal.PlainDateTime.from({ year: 2023, month: 2, day: 29 }).toString(),
            "2023-02-28T00:00:00",
            "Temporal.PlainDateTime.from({ year: 2023, month: 2, day: 29 }).toString()"
        );

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from({ year: 2023, month: 2, day: 29 }, { overflow: "reject" });
        }, "RangeError", "invalid property bag with reject should throw like Node");
    });

    test("PlainDateTime.from matches Node Temporal input edge cases", function () {
        assertNodeEquals(
            Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29 }, {}).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29 }, {}).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29 }, { overflow: undefined }).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29 }, { overflow: undefined }).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, banana: 1 }).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, banana: 1 }).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, hour: null }).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, hour: null }).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, hour: false }).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, hour: false }).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, hour: "", minute: "" }).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, hour: '', minute: '' }).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, hour: "8", minute: "05" }).toString(),
            "2024-02-29T08:05:00",
            "Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29, hour: '8', minute: '05' }).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29").toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from('2024-02-29').toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29t10:20:30").toString(),
            "2024-02-29T10:20:30",
            "Temporal.PlainDateTime.from('2024-02-29t10:20:30').toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29 10:20:30").toString(),
            "2024-02-29T10:20:30",
            "Temporal.PlainDateTime.from('2024-02-29 10:20:30').toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T10:20").toString(),
            "2024-02-29T10:20:00",
            "Temporal.PlainDateTime.from('2024-02-29T10:20').toString()"
        );

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from({ year: 2024, month: 2, day: 29 }, { overflow: "balance" });
        }, "RangeError", "invalid overflow should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from(undefined);
        }, "TypeError", "undefined input should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from(null);
        }, "TypeError", "null input should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from(false);
        }, "TypeError", "boolean input should throw like Node");
    });

    test("PlainDateTime.with matches Node Temporal edge cases", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

        assertNodeEquals(
            dateTime.with({ year: 2025 }).toString(),
            "2025-02-28T10:20:30.123",
            "Temporal.PlainDateTime.from(input).with({ year: 2025 }).toString()"
        );
        assertNodeEquals(
            dateTime.with({ month: 3, day: 31, hour: 0, minute: 0, second: 0, millisecond: 0 }).toString(),
            "2024-03-31T00:00:00",
            "Temporal.PlainDateTime.from(input).with({ month: 3, day: 31, hour: 0, minute: 0, second: 0, millisecond: 0 }).toString()"
        );
        assertNodeEquals(
            dateTime.with({ banana: 1, hour: 8 }).toString(),
            "2024-02-29T08:20:30.123",
            "Temporal.PlainDateTime.from(input).with({ banana: 1, hour: 8 }).toString()"
        );
        assertNodeEquals(
            dateTime.with({ hour: 0 }).toString(),
            "2024-02-29T00:20:30.123",
            "Temporal.PlainDateTime.from(input).with({ hour: 0 }).toString()"
        );
        assertNodeEquals(
            dateTime.with({ hour: null }).toString(),
            "2024-02-29T00:20:30.123",
            "Temporal.PlainDateTime.from(input).with({ hour: null }).toString()"
        );
        assertNodeEquals(
            dateTime.with({ hour: false }).toString(),
            "2024-02-29T00:20:30.123",
            "Temporal.PlainDateTime.from(input).with({ hour: false }).toString()"
        );
        assertNodeEquals(
            dateTime.with({ hour: "", minute: "" }).toString(),
            "2024-02-29T00:00:30.123",
            "Temporal.PlainDateTime.from(input).with({ hour: '', minute: '' }).toString()"
        );
        assertNodeEquals(
            dateTime.with({ hour: "8", minute: "05" }).toString(),
            "2024-02-29T08:05:30.123",
            "Temporal.PlainDateTime.from(input).with({ hour: '8', minute: '05' }).toString()"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2023-01-31T10:20:30").with({ month: 2 }).toString(),
            "2023-02-28T10:20:30",
            "Temporal.PlainDateTime.from('2023-01-31T10:20:30').with({ month: 2 }).toString()"
        );
        assertNodeEquals(
            dateTime.with({ hour: 8 }, {}).toString(),
            "2024-02-29T08:20:30.123",
            "Temporal.PlainDateTime.from(input).with({ hour: 8 }, {}).toString()"
        );
        assertNodeEquals(
            dateTime.with({ hour: 8 }, { overflow: undefined }).toString(),
            "2024-02-29T08:20:30.123",
            "Temporal.PlainDateTime.from(input).with({ hour: 8 }, { overflow: undefined }).toString()"
        );

        assertThrowsWith(function () {
            dateTime.with({});
        }, "TypeError", "empty with object should throw like Node");

        assertThrowsWith(function () {
            dateTime.with({ banana: 1 });
        }, "TypeError", "extra-only with object should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2023-01-31T10:20:30").with({ month: 2 }, { overflow: "reject" });
        }, "RangeError", "with invalid date reject should throw like Node");

        assertThrowsWith(function () {
            dateTime.with({ hour: 8 }, { overflow: "balance" });
        }, "RangeError", "with invalid overflow should throw like Node");

        assertThrowsWith(function () {
            dateTime.with(null);
        }, "TypeError", "with null should throw like Node");

        assertThrowsWith(function () {
            dateTime.with(undefined);
        }, "TypeError", "with undefined should throw like Node");
    });

    test("PlainDateTime.subtract delegates through a valid add path like Node", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-03-01T00:00:00");
        var result = dateTime.subtract(Temporal.Duration.from("P1D"));

        assertNodeEquals(
            result.toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from('2024-03-01T00:00:00').subtract(Temporal.Duration.from('P1D')).toString()"
        );
        assertNodeEquals(
            dateTime.toString(),
            "2024-03-01T00:00:00",
            "PlainDateTime.subtract should not mutate the receiver"
        );
    });

    test("PlainDateTime.withPlainTime replaces the time part like Node", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

        assertNodeEquals(
            dateTime.withPlainTime("23:59:58.987").toString(),
            "2024-02-29T23:59:58.987",
            "Temporal.PlainDateTime.from(input).withPlainTime('23:59:58.987').toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime({ hour: 8, minute: 5 }).toString(),
            "2024-02-29T08:05:00",
            "Temporal.PlainDateTime.from(input).withPlainTime({ hour: 8, minute: 5 }).toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime().toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from(input).withPlainTime().toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime("08:05").toString(),
            "2024-02-29T08:05:00",
            "Temporal.PlainDateTime.from(input).withPlainTime('08:05').toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime("08:05:06.007").toString(),
            "2024-02-29T08:05:06.007",
            "Temporal.PlainDateTime.from(input).withPlainTime('08:05:06.007').toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime({ hour: 8, minute: 5, year: 2000 }).toString(),
            "2024-02-29T08:05:00",
            "Temporal.PlainDateTime.from(input).withPlainTime({ hour: 8, minute: 5, year: 2000 }).toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime({ hour: null, minute: null }).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from(input).withPlainTime({ hour: null, minute: null }).toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime({ hour: false, minute: false }).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from(input).withPlainTime({ hour: false, minute: false }).toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime({ hour: "", minute: "" }).toString(),
            "2024-02-29T00:00:00",
            "Temporal.PlainDateTime.from(input).withPlainTime({ hour: '', minute: '' }).toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime({ hour: 24 }).toString(),
            "2024-02-29T23:00:00",
            "Temporal.PlainDateTime.from(input).withPlainTime({ hour: 24 }).toString()"
        );
        assertNodeEquals(
            dateTime.withPlainTime({ hour: 8, minute: 60 }).toString(),
            "2024-02-29T08:59:00",
            "Temporal.PlainDateTime.from(input).withPlainTime({ hour: 8, minute: 60 }).toString()"
        );
        assertNodeEquals(
            dateTime.toString(),
            "2024-02-29T10:20:30.123",
            "PlainDateTime.withPlainTime should not mutate the receiver"
        );

        assertThrowsWith(function () {
            dateTime.withPlainTime({});
        }, "TypeError", "withPlainTime empty object should throw like Node");

        assertThrowsWith(function () {
            dateTime.withPlainTime({ banana: 1 });
        }, "TypeError", "withPlainTime extra-only object should throw like Node");

        assertNodeEquals(
            dateTime.withPlainTime({ hour: 24 }, { overflow: "reject" }).toString(),
            "2024-02-29T23:00:00",
            "Temporal.PlainDateTime.from(input).withPlainTime({ hour: 24 }, { overflow: 'reject' }).toString()"
        );

        assertThrowsWith(function () {
            Temporal.PlainTime.from({ hour: 24 }, { overflow: "reject" });
        }, "RangeError", "PlainTime.from invalid hour reject should throw like Node");

        assertThrowsWith(function () {
            dateTime.withPlainTime(null);
        }, "TypeError", "withPlainTime null should throw like Node");

        assertThrowsWith(function () {
            dateTime.withPlainTime(false);
        }, "TypeError", "withPlainTime boolean should throw like Node");

        assertThrowsWith(function () {
            dateTime.withPlainTime("08:05:06Z");
        }, "RangeError", "withPlainTime UTC designator should throw like Node");
    });

    test("PlainDateTime.until and since match Node Temporal basics", function () {
        function untilString(one, two, options) {
            return Temporal.PlainDateTime.from(one).until(Temporal.PlainDateTime.from(two), options).toString();
        }

        function sinceString(one, two, options) {
            return Temporal.PlainDateTime.from(one).since(Temporal.PlainDateTime.from(two), options).toString();
        }

        assertNodeEquals(
            untilString("2024-02-29T10:20:30.123", "2024-02-29T10:20:30.123"),
            "PT0S",
            "Temporal.PlainDateTime.from(a).until(Temporal.PlainDateTime.from(a)).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T10:20:30.123", "2024-03-01T10:20:30.124"),
            "P1D",
            "Temporal.PlainDateTime.from(a).until(Temporal.PlainDateTime.from(b)).toString()"
        );
        assertNodeEquals(
            untilString("2024-03-01T10:20:30.124", "2024-02-29T10:20:30.123"),
            "-P1D",
            "Temporal.PlainDateTime.from(b).until(Temporal.PlainDateTime.from(a)).toString()"
        );
        assertNodeEquals(
            sinceString("2024-03-01T10:20:30.124", "2024-02-29T10:20:30.123"),
            "P1D",
            "Temporal.PlainDateTime.from(b).since(Temporal.PlainDateTime.from(a)).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T00:00:00", "2025-03-01T00:00:00", { largestUnit: "year" }),
            "P1Y1M1D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'year' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T00:00:00", "2024-03-01T00:00:00", { largestUnit: "month" }),
            "P1M1D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'month' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T00:00:00", "2024-03-01T00:00:00", { largestUnit: "day" }),
            "P30D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'day' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T10:00:00", "2024-03-01T12:30:00", { largestUnit: "hour" }),
            "PT26H30M",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'hour' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T10:20:30.123", "2024-02-29T10:20:31.789", { smallestUnit: "second" }),
            "PT1S",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'second' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T10:20:30.123", "2024-02-29T10:20:31.789", { smallestUnit: "second", roundingMode: "halfExpand" }),
            "PT2S",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'second', roundingMode: 'halfExpand' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T10:20:31.789", "2024-02-29T10:20:30.123", { smallestUnit: "second", roundingMode: "ceil" }),
            "-PT1S",
            "Temporal.PlainDateTime.from(b).until(a, { smallestUnit: 'second', roundingMode: 'ceil' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T10:20:31.789", "2024-02-29T10:20:30.123", { smallestUnit: "second", roundingMode: "floor" }),
            "-PT2S",
            "Temporal.PlainDateTime.from(b).until(a, { smallestUnit: 'second', roundingMode: 'floor' }).toString()"
        );
        assertNodeEquals(
            sinceString("2024-02-29T10:20:30.123", "2024-02-29T10:20:31.789", { smallestUnit: "second", roundingMode: "trunc" }),
            "-PT1S",
            "Temporal.PlainDateTime.from(a).since(b, { smallestUnit: 'second', roundingMode: 'trunc' }).toString()"
        );
        assertNodeEquals(
            sinceString("2024-02-29T10:20:30.123", "2024-02-29T10:20:31.789", { smallestUnit: "second", roundingMode: "halfExpand" }),
            "-PT2S",
            "Temporal.PlainDateTime.from(a).since(b, { smallestUnit: 'second', roundingMode: 'halfExpand' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T10:20:30", "2024-02-29T10:21:31", { smallestUnit: "minute", roundingMode: "halfExpand" }),
            "PT1M",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'minute', roundingMode: 'halfExpand' }).toString()"
        );
        assertNodeEquals(
            sinceString("2024-02-29T10:20:30", "2024-02-29T10:21:31", { smallestUnit: "minute", roundingMode: "halfExpand" }),
            "-PT1M",
            "Temporal.PlainDateTime.from(a).since(b, { smallestUnit: 'minute', roundingMode: 'halfExpand' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T10:00:00", "2024-02-29T10:44:00", { smallestUnit: "minute", roundingIncrement: 15, roundingMode: "halfExpand" }),
            "PT45M",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'minute', roundingIncrement: 15, roundingMode: 'halfExpand' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T00:00:00", "2024-03-01T00:00:00", { smallestUnit: "week" }),
            "PT0S",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'week' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T00:00:00", "2024-03-01T00:00:00", { smallestUnit: "weeks" }),
            "PT0S",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'weeks' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T00:00:00", "2024-03-01T00:00:00", { smallestUnit: "year" }),
            "PT0S",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'year' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T00:00:00", "2024-03-01T00:00:00", { largestUnit: "days", smallestUnit: "hours" }),
            "P1D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'days', smallestUnit: 'hours' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-01T00:00:00", "2024-02-15T00:00:00", { largestUnit: "week" }),
            "P2W",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'week' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-01T00:00:00", "2024-02-16T00:00:00", { largestUnit: "week" }),
            "P2W1D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'week' }).toString() with day remainder"
        );
        assertNodeEquals(
            untilString("2024-02-01T00:00:00", "2024-02-16T12:00:00", { largestUnit: "week", smallestUnit: "day", roundingMode: "halfExpand" }),
            "P2W2D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'week', smallestUnit: 'day' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-16T00:00:00", "2024-02-01T00:00:00", { largestUnit: "week" }),
            "-P2W1D",
            "Temporal.PlainDateTime.from(b).until(a, { largestUnit: 'week' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-01T00:00:00", "2024-02-15T00:00:00", { largestUnit: "weeks" }),
            "P2W",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'weeks' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T00:00:00", "2024-03-01T00:00:00", { smallestUnit: "minute", roundingIncrement: "5" }),
            "P1D",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'minute', roundingIncrement: '5' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T00:00:00", "2024-03-01T00:00:00", { smallestUnit: "day", roundingIncrement: 1.5 }),
            "P1D",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'day', roundingIncrement: 1.5 }).toString()"
        );
        assertNodeEquals(
            untilString("2024-02-29T00:00:00", "2024-03-01T00:00:00", { smallestUnit: "day", roundingIncrement: 2 }),
            "PT0S",
            "Temporal.PlainDateTime.from(a).until(b, { smallestUnit: 'day', roundingIncrement: 2 }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T10:30:00", "2024-03-01T11:45:00", { largestUnit: "month", smallestUnit: "hour" }),
            "P1M1DT1H",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'month', smallestUnit: 'hour' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T10:30:00", "2024-03-01T11:45:00", { largestUnit: "month", smallestUnit: "minute" }),
            "P1M1DT1H15M",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'month', smallestUnit: 'minute' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T10:30:00", "2024-03-01T23:45:00", { largestUnit: "month", smallestUnit: "day", roundingMode: "halfExpand" }),
            "P1M2D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'month', smallestUnit: 'day', roundingMode: 'halfExpand' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T10:30:00", "2024-03-01T23:45:00", { largestUnit: "month", smallestUnit: "day", roundingMode: "trunc" }),
            "P1M1D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'month', smallestUnit: 'day', roundingMode: 'trunc' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T10:30:00", "2024-03-01T13:45:00", { largestUnit: "month", smallestUnit: "hour", roundingIncrement: 6, roundingMode: "halfExpand" }),
            "P1M1DT6H",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'month', smallestUnit: 'hour', roundingIncrement: 6 }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T00:00:00", "2025-03-01T12:00:00", { largestUnit: "year", smallestUnit: "day", roundingMode: "halfExpand" }),
            "P1Y1M2D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'year', smallestUnit: 'day', roundingMode: 'halfExpand' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-01-31T00:00:00", "2025-03-01T12:00:00", { largestUnit: "year", smallestUnit: "day", roundingMode: "trunc" }),
            "P1Y1M1D",
            "Temporal.PlainDateTime.from(a).until(b, { largestUnit: 'year', smallestUnit: 'day', roundingMode: 'trunc' }).toString()"
        );
        assertNodeEquals(
            untilString("2024-03-01T11:45:00", "2024-01-31T10:30:00", { largestUnit: "month", smallestUnit: "hour" }),
            "-P1M1DT1H",
            "Temporal.PlainDateTime.from(b).until(a, { largestUnit: 'month', smallestUnit: 'hour' }).toString()"
        );
        assertNodeEquals(
            sinceString("2024-03-01T11:45:00", "2024-01-31T10:30:00", { largestUnit: "month", smallestUnit: "hour" }),
            "P1M1DT1H",
            "Temporal.PlainDateTime.from(b).since(a, { largestUnit: 'month', smallestUnit: 'hour' }).toString()"
        );

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { smallestUnit: "hour", roundingMode: "bad" });
        }, "RangeError", "until invalid roundingMode should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { smallestUnit: "hour", roundingIncrement: 0 });
        }, "RangeError", "until invalid roundingIncrement should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), null);
        }, "TypeError", "until null options should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), false);
        }, "TypeError", "until boolean options should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), "second");
        }, "TypeError", "until string options should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(null);
        }, "TypeError", "until invalid other should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { smallestUnit: "banana" });
        }, "RangeError", "until invalid smallestUnit should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { smallestUnit: null });
        }, "RangeError", "until null smallestUnit should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-03-01T00:00:00").since(Temporal.PlainDateTime.from("2024-02-29T00:00:00"), { smallestUnit: "banana" });
        }, "RangeError", "since invalid smallestUnit should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { largestUnit: "minute", smallestUnit: "hour" });
        }, "RangeError", "until smallestUnit larger than largestUnit should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { largestUnit: "hour", smallestUnit: "day" });
        }, "RangeError", "until day smallestUnit with hour largestUnit should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { smallestUnit: "hour", roundingIncrement: 7 });
        }, "RangeError", "until hour roundingIncrement must divide day like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { smallestUnit: "hour", roundingIncrement: 24 });
        }, "RangeError", "until hour roundingIncrement maximum should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { smallestUnit: "minute", roundingIncrement: 17 });
        }, "RangeError", "until minute roundingIncrement must divide hour like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").until(Temporal.PlainDateTime.from("2024-03-01T00:00:00"), { smallestUnit: "millisecond", roundingIncrement: 1000 });
        }, "RangeError", "until millisecond roundingIncrement maximum should throw like Node");
    });

    test("PlainDateTime.round matches Node Temporal basics", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

        assertNodeEquals(dateTime.round("second").toString(), "2024-02-29T10:20:30", "PlainDateTime.round('second')");
        assertNodeEquals(dateTime.round("minute").toString(), "2024-02-29T10:21:00", "PlainDateTime.round('minute')");
        assertNodeEquals(dateTime.round("hour").toString(), "2024-02-29T10:00:00", "PlainDateTime.round('hour')");
        assertNodeEquals(dateTime.round("day").toString(), "2024-02-29T00:00:00", "PlainDateTime.round('day')");
        assertNodeEquals(dateTime.round("millisecond").toString(), "2024-02-29T10:20:30.123", "PlainDateTime.round('millisecond')");
        assertNodeEquals(dateTime.round({ smallestUnit: "second", roundingMode: "trunc" }).toString(), "2024-02-29T10:20:30", "PlainDateTime.round second trunc");
        assertNodeEquals(dateTime.round({ smallestUnit: "second", roundingMode: "ceil" }).toString(), "2024-02-29T10:20:31", "PlainDateTime.round second ceil");
        assertNodeEquals(dateTime.round({ smallestUnit: "minute", roundingMode: "halfExpand" }).toString(), "2024-02-29T10:21:00", "PlainDateTime.round minute halfExpand");
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T10:07:30").round({ smallestUnit: "minute", roundingIncrement: 15, roundingMode: "halfExpand" }).toString(),
            "2024-02-29T10:15:00",
            "PlainDateTime.round minute increment 15 halfExpand"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T22:31:00").round({ smallestUnit: "hour", roundingIncrement: 3, roundingMode: "halfExpand" }).toString(),
            "2024-03-01T00:00:00",
            "PlainDateTime.round hour increment 3 halfExpand"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T23:59:59.999").round("day").toString(),
            "2024-03-01T00:00:00",
            "PlainDateTime.round day edge"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T23:59:31").round({ smallestUnit: "minute" }).toString(),
            "2024-03-01T00:00:00",
            "PlainDateTime.round minute edge carry"
        );
        assertNodeEquals(dateTime.round({ smallestUnit: "seconds" }).toString(), "2024-02-29T10:20:30", "PlainDateTime.round plural seconds");

        assertThrowsWith(function () {
            dateTime.round({});
        }, "RangeError", "round missing smallestUnit should throw like Node");
        assertThrowsWith(function () {
            dateTime.round({ smallestUnit: "month" });
        }, "RangeError", "round date smallestUnit should throw like Node");
        assertThrowsWith(function () {
            dateTime.round({ smallestUnit: "second", roundingMode: "bad" });
        }, "RangeError", "round invalid roundingMode should throw like Node");
        assertThrowsWith(function () {
            dateTime.round({ smallestUnit: "second", roundingIncrement: 0 });
        }, "RangeError", "round invalid roundingIncrement should throw like Node");
        assertThrowsWith(function () {
            dateTime.round({ smallestUnit: "hour", roundingIncrement: 7 });
        }, "RangeError", "round increment not dividing day should throw like Node");
        assertThrowsWith(function () {
            dateTime.round(null);
        }, "TypeError", "round null should throw like Node");
        assertThrowsWith(function () {
            dateTime.round(undefined);
        }, "TypeError", "round undefined should throw like Node");
    });

    test("PlainDateTime converts to PlainDate and PlainTime like Node", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");
        var plainDate = dateTime.toPlainDate();
        var plainTime = dateTime.toPlainTime();

        assert(plainDate instanceof Temporal.PlainDate, "toPlainDate should return a PlainDate");
        assert(plainTime instanceof Temporal.PlainTime, "toPlainTime should return a PlainTime");
        assertNodeEquals(
            plainDate.toString(),
            "2024-02-29",
            "Temporal.PlainDateTime.from(input).toPlainDate().toString()"
        );
        assertNodeEquals(
            plainDate.toJSON(),
            "2024-02-29",
            "Temporal.PlainDateTime.from(input).toPlainDate().toJSON()"
        );
        assertNodeEquals(
            plainTime.toString(),
            "10:20:30.123",
            "Temporal.PlainDateTime.from(input).toPlainTime().toString()"
        );
        assertNodeEquals(
            plainTime.toJSON(),
            "10:20:30.123",
            "Temporal.PlainDateTime.from(input).toPlainTime().toJSON()"
        );
    });

    test("PlainDateTime.compare accepts PlainDateTime-like inputs like Node", function () {
        assertNodeEquals(
            Temporal.PlainDateTime.compare("2024-02-29T10:20:30", { year: 2024, month: 2, day: 29, hour: 10, minute: 20, second: 31 }),
            -1,
            "Temporal.PlainDateTime.compare('2024-02-29T10:20:30', { second: 31 })"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.compare({ year: 2024, month: 3, day: 1 }, "2024-02-29T23:59:59"),
            1,
            "Temporal.PlainDateTime.compare({ year: 2024, month: 3, day: 1 }, '2024-02-29T23:59:59')"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.compare("2024-02-29T10:20:30", "2024-02-29T10:20:30"),
            0,
            "Temporal.PlainDateTime.compare('2024-02-29T10:20:30', '2024-02-29T10:20:30')"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.compare("2024-02-29T10:20:30.123", "2024-02-29T10:20:30.124"),
            -1,
            "Temporal.PlainDateTime.compare('2024-02-29T10:20:30.123', '2024-02-29T10:20:30.124')"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.compare({ year: 2024, month: 2, day: 29 }, "2024-02-29T00:00:00"),
            0,
            "Temporal.PlainDateTime.compare({ year: 2024, month: 2, day: 29 }, '2024-02-29T00:00:00')"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.compare({ year: 2023, month: 2, day: 29 }, "2023-02-28T00:00:00"),
            0,
            "Temporal.PlainDateTime.compare({ year: 2023, month: 2, day: 29 }, '2023-02-28T00:00:00')"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.compare({ year: 2024, month: 2, day: 29, banana: 1 }, "2024-02-29T00:00:00"),
            0,
            "Temporal.PlainDateTime.compare({ year: 2024, month: 2, day: 29, banana: 1 }, '2024-02-29T00:00:00')"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.compare({ year: 2024, month: 2, day: 29, hour: "8", minute: "05" }, "2024-02-29T08:05:00"),
            0,
            "Temporal.PlainDateTime.compare({ year: 2024, month: 2, day: 29, hour: '8', minute: '05' }, '2024-02-29T08:05:00')"
        );

        assertThrowsWith(function () {
            Temporal.PlainDateTime.compare("2023-02-29T00:00:00", "2023-02-28T00:00:00");
        }, "RangeError", "compare invalid ISO string should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.compare(undefined, "2024-02-29T00:00:00");
        }, "TypeError", "compare undefined should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.compare("2024-02-29T00:00:00", null);
        }, "TypeError", "compare null should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.compare(false, "2024-02-29T00:00:00");
        }, "TypeError", "compare boolean should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.compare({ year: 2024 }, "2024-01-01T00:00:00");
        }, "TypeError", "compare missing fields should throw like Node");

        assertThrowsWith(function () {
            Temporal.PlainDateTime.compare({ banana: 1 }, "2024-01-01T00:00:00");
        }, "TypeError", "compare empty partial object should throw like Node");
    });

    test("PlainDateTime equals and primitive protocol match Node Temporal", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

        assertNodeEquals(
            dateTime.equals("2024-02-29T10:20:30.123"),
            true,
            "Temporal.PlainDateTime.from(input).equals(input)"
        );
        assertNodeEquals(
            dateTime.equals("2024-02-29T10:20:30.124"),
            false,
            "Temporal.PlainDateTime.from(input).equals(different millisecond)"
        );
        assertNodeEquals(
            dateTime.equals({ year: 2024, month: 2, day: 29, hour: 10, minute: 20, second: 30, millisecond: 123 }),
            true,
            "Temporal.PlainDateTime.from(input).equals(property bag)"
        );
        assertNodeEquals(
            Temporal.PlainDateTime.from("2024-02-29T00:00:00").equals({ year: 2024, month: 2, day: 29 }),
            true,
            "Temporal.PlainDateTime.from(midnight).equals(date-only property bag)"
        );
        assertNodeEquals(
            dateTime.toJSON(),
            "2024-02-29T10:20:30.123",
            "Temporal.PlainDateTime.from(input).toJSON()"
        );

        assertThrowsWith(function () {
            dateTime.equals(null);
        }, "TypeError", "equals null should throw like Node");

        assertThrowsWith(function () {
            dateTime.valueOf();
        }, "TypeError", "valueOf should throw like Node");
    });

    writeLine("--------------------------------------------------");
    writeLine("Passed:  " + results.passed);
    writeLine("Failed:  " + results.failed);
    writeLine("Skipped: " + results.skipped);

    if (results.failed > 0) {
        throw new Error("Temporal PlainDateTime tests failed: " + results.failed);
    }
}());
