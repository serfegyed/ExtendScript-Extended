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

    test("Calendar differences support year month week and auto largestUnit", function () {
        // Native Temporal, Node v26.5.0 reference strings.
        var cases = [
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"year"},"P1Y"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"year"},"-P1Y"],
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"year","largestUnit":"auto"},"P1Y"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"year","largestUnit":"auto"},"-P1Y"],
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"year","largestUnit":"year"},"P1Y"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"year","largestUnit":"year"},"-P1Y"],
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"month"},"P14M"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"month"},"-P14M"],
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"month","largestUnit":"auto"},"P14M"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"month","largestUnit":"auto"},"-P14M"],
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"month","largestUnit":"month"},"P14M"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"month","largestUnit":"month"},"-P14M"],
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"week"},"P63W"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"week"},"-P63W"],
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"week","largestUnit":"auto"},"P63W"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"week","largestUnit":"auto"},"-P63W"],
            ["2024-01-01","2025-03-20","until",{"smallestUnit":"week","largestUnit":"week"},"P63W"],
            ["2024-01-01","2025-03-20","since",{"smallestUnit":"week","largestUnit":"week"},"-P63W"]
        ];
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            assertNodeEquals(Temporal.PlainDateTime.from(row[0])[row[2]](row[1], row[3]).toString(),
                row[4], "calendar difference case " + i);
        }
    });

    test("Calendar differences round signed time remainders", function () {
        // Native Temporal, Node v26.5.0 reference strings.
        var cases = [
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"ceil"},"P1M"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"ceil"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"floor"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"floor"},"-P1M"],
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"expand"},"P1M"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"expand"},"-P1M"],
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"trunc"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"trunc"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"halfCeil"},"P1M"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"halfCeil"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"halfFloor"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"halfFloor"},"-P1M"],
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"halfExpand"},"P1M"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"halfExpand"},"-P1M"],
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"halfTrunc"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"halfTrunc"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","until",{"smallestUnit":"month","roundingMode":"halfEven"},"PT0S"],
            ["2024-01-01","2024-01-16T12:00","since",{"smallestUnit":"month","roundingMode":"halfEven"},"PT0S"],
            ["2025-03-20T18:00","2024-01-31T12:00","until",{"smallestUnit":"year","roundingIncrement":2},"PT0S"],
            ["2025-03-20T18:00","2024-01-31T12:00","since",{"smallestUnit":"year","roundingIncrement":2},"PT0S"],
            ["2025-03-20T18:00","2024-01-31T12:00","until",{"smallestUnit":"month","roundingIncrement":2},"-P12M"],
            ["2025-03-20T18:00","2024-01-31T12:00","since",{"smallestUnit":"month","roundingIncrement":2},"P12M"],
            ["2025-03-20T18:00","2024-01-31T12:00","until",{"smallestUnit":"week","roundingIncrement":2},"-P58W"],
            ["2025-03-20T18:00","2024-01-31T12:00","since",{"smallestUnit":"week","roundingIncrement":2},"P58W"],
            ["2024-01-01","2024-02-15","until",{"largestUnit":"month","smallestUnit":"week"},"P1M2W"]
        ];
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            assertNodeEquals(Temporal.PlainDateTime.from(row[0])[row[2]](row[1], row[3]).toString(),
                row[4], "calendar difference case " + i);
        }
    });

    test("Calendar differences validate options and equal endpoints", function () {
        var value = Temporal.PlainDateTime.from("2024-01-01");
        assertNodeEquals(value.until(value, { smallestUnit: "year" }).toString(), "PT0S", "equal endpoints");
        assertThrowsWith(function () { value.until("2025-01-01", { largestUnit: "day", smallestUnit: "month" }); }, "RangeError", "unit order");
        assertThrowsWith(function () { value.until(value, { smallestUnit: "year", roundingMode: "oops" }); }, "RangeError", "equal endpoints invalid mode");
        assertThrowsWith(function () { value.until(value, { largestUnit: "year", smallestUnit: "month", roundingIncrement: 2 }); }, "RangeError", "mixed units increment");
        assertThrowsWith(function () { value.until("invalid", { smallestUnit: "week" }); }, "RangeError", "invalid endpoint");
    });

    test("F18 difference options reject inherited object names", function () {
        // Native Temporal, Node v26.5.0: all cases throw RangeError.
        var names = ["toString","constructor","hasOwnProperty","valueOf"];
        var properties = ["largestUnit", "smallestUnit"];
        var methods = ["until", "since"];
        var value = Temporal.PlainDateTime.from("2024-01-01");
        for (var i = 0; i < names.length; i++) {
            for (var j = 0; j < properties.length; j++) {
                var options = {};
                options[properties[j]] = names[i];
                for (var k = 0; k < methods.length; k++) {
                    assertThrowsWith(function () { value[methods[k]]("2024-01-02", options); },
                        "RangeError", names[i] + " " + properties[j] + " " + methods[k]);
                }
            }
        }
    });

    test("F18 rounding formatting and overflow reject inherited names", function () {
        var names = ["toString","constructor","hasOwnProperty","valueOf"];
        var value = Temporal.PlainDateTime.from("2024-01-01");
        for (var i = 0; i < names.length; i++) {
            assertThrowsWith(function () { value.round({ smallestUnit: names[i] }); }, "RangeError", "round " + names[i]);
            assertThrowsWith(function () { value.toString({ smallestUnit: names[i] }); }, "RangeError", "format " + names[i]);
            assertThrowsWith(function () { value.add({ days: 1 }, { overflow: names[i] }); }, "RangeError", "overflow " + names[i]);
        }
    });

    test("F15 PlainDateTime differences stay valid near both ISO range limits", function () {
        // Native Temporal, Node v26.5.0 reference strings.
        var cases = [
            ["+275760-09-01","+275760-09-02","until",{"largestUnit":"month"},"P1D"],
            ["+275760-09-01","+275760-09-02","since",{"largestUnit":"month"},"-P1D"],
            ["+275760-09-01","+275760-09-02","until",{"largestUnit":"year"},"P1D"],
            ["+275760-09-01","+275760-09-02","since",{"largestUnit":"year"},"-P1D"],
            ["+275760-09-02","+275760-09-01","until",{"largestUnit":"month"},"-P1D"],
            ["+275760-09-02","+275760-09-01","since",{"largestUnit":"month"},"P1D"],
            ["+275760-09-02","+275760-09-01","until",{"largestUnit":"year"},"-P1D"],
            ["+275760-09-02","+275760-09-01","since",{"largestUnit":"year"},"P1D"],
            ["-271821-04-21","-271821-04-20","until",{"largestUnit":"month"},"-P1D"],
            ["-271821-04-21","-271821-04-20","since",{"largestUnit":"month"},"P1D"],
            ["-271821-04-21","-271821-04-20","until",{"largestUnit":"year"},"-P1D"],
            ["-271821-04-21","-271821-04-20","since",{"largestUnit":"year"},"P1D"],
            ["-271821-04-20","-271821-04-21","until",{"largestUnit":"month"},"P1D"],
            ["-271821-04-20","-271821-04-21","since",{"largestUnit":"month"},"-P1D"],
            ["-271821-04-20","-271821-04-21","until",{"largestUnit":"year"},"P1D"],
            ["-271821-04-20","-271821-04-21","since",{"largestUnit":"year"},"-P1D"]
        ];
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            assertNodeEquals(Temporal.PlainDateTime.from(row[0])[row[2]](row[1], row[3]).toString(),
                row[4], "ISO range case " + i);
        }
    });

    test("Temporal namespace is loaded", function () {
        assert(typeof Temporal === "object", "Temporal namespace should exist");
        assert(typeof Temporal.Duration === "function", "Temporal.Duration should exist");
        assert(typeof Temporal.PlainDateTime === "function", "Temporal.PlainDateTime should exist");
        assert(typeof Temporal.PlainDate === "function", "Temporal.PlainDate should exist");
        assert(typeof Temporal.PlainTime === "function", "Temporal.PlainTime should exist");
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


    test("F03 constructor stores normalized integer time fields", function () {
        // Native Temporal, Node v26.5.0.
        var value = new Temporal.PlainDateTime(2024, 1, 1, "2");
        assertNodeEquals(typeof value.hour, "number", "constructor string hour becomes a number");
        assertNodeEquals(value.add({ hours: 1 }).toString(), "2024-01-01T03:00:00", "numeric hour addition");
        value = new Temporal.PlainDateTime(2024, 1, 1, 1.9, 2.9, 3.9, 4.9);
        assertNodeEquals(value.hour, 1, "truncated hour");
        assertNodeEquals(value.minute, 2, "truncated minute");
        assertNodeEquals(value.second, 3, "truncated second");
        assertNodeEquals(value.millisecond, 4, "truncated millisecond");
    });

    test("F03 invalid time fields throw in constructor, from and with", function () {
        // Native Temporal, Node v26.5.0: all 48 calls throw RangeError.
        var names = ["hour", "minute", "second", "millisecond"];
        var invalid = [NaN, Infinity, -Infinity, "oops"];
        var base = Temporal.PlainDateTime.from("2024-01-01");
        for (var i = 0; i < names.length; i++) {
            for (var j = 0; j < invalid.length; j++) {
                var times = [0, 0, 0, 0];
                times[i] = invalid[j];
                assertThrowsWith(function () {
                    new Temporal.PlainDateTime(2024, 1, 1, times[0], times[1], times[2], times[3]);
                }, "RangeError", "constructor invalid " + names[i]);
                var bag = { year: 2024, month: 1, day: 1 };
                bag[names[i]] = invalid[j];
                assertThrowsWith(function () {
                    Temporal.PlainDateTime.from(bag);
                }, "RangeError", "from invalid " + names[i]);
                var change = {};
                change[names[i]] = invalid[j];
                assertThrowsWith(function () {
                    base.with(change);
                }, "RangeError", "with invalid " + names[i]);
            }
        }
    });

    test("F03 from coerces fields before truncation and overflow", function () {
        // Native Temporal, Node v26.5.0.
        assertNodeEquals(Temporal.PlainDateTime.from({
            year: "2.024e3", month: 1, day: true, hour: true,
            minute: null, second: "", millisecond: 1.9
        }).toString(), "2024-01-01T01:00:00.001", "Number coercion rather than parseInt");
        assertNodeEquals(Temporal.PlainDateTime.from({
            year: 2024, month: 1, day: 1, hour: 25, minute: -1
        }).toString(), "2024-01-01T23:00:00", "finite time overflow constrains");
        assertThrowsWith(function () {
            Temporal.PlainDateTime.from({ year: 2024, month: 1, day: 1, hour: 25 }, { overflow: "reject" });
        }, "RangeError", "finite time overflow rejects");
    });

    test("F03 with truncates time fields and preserves calendar constrain", function () {
        // Native Temporal, Node v26.5.0.
        var base = Temporal.PlainDateTime.from("2024-01-01");
        var value = base.with({ hour: 1.9, minute: 2.9, second: 3.9, millisecond: 4.9 });
        assertNodeEquals(value.toString(), "2024-01-01T01:02:03.004", "with truncated time fields");
        assertNodeEquals(value.millisecond, 4, "with stores integer milliseconds");
        assertNodeEquals(base.toString(), "2024-01-01T00:00:00", "with preserves receiver");
        assertNodeEquals(Temporal.PlainDateTime.from("2024-01-31").with({
            month: 2, day: 100
        }).toString(), "2024-02-29T00:00:00", "day constrained against final month");
    });

    test("F03 with rejects nonpositive dates and invalid years before constrain", function () {
        // Native Temporal, Node v26.5.0: each supplied field throws RangeError.
        var base = Temporal.PlainDateTime.from("2024-01-01");
        var changes = [{ month: 0 }, { day: 0 }, { day: -1 }, { year: Infinity }, { year: 275761 }];
        for (var i = 0; i < changes.length; i++) {
            assertThrowsWith(function () {
                base.with(changes[i]);
            }, "RangeError", "invalid date fields must not become valid through constrain");
        }
    });


    test("F04 ISO parsing rejects incomplete input and trailing text", function () {
        // Native Temporal, Node v26.5.0: all these strings throw RangeError.
        var invalid = [
            "2024-01-01garbage", "-000000-01-01T00:00", "2024-01-01T",
            "2024-01-01T12:", "2024-01-01T12:34:", "2024-01-01T12:34:56.",
            "2024-01-01T12:34:56.1234567890", "2024-01-01\n", "2024-01-01T12:3456"
        ];
        for (var i = 0; i < invalid.length; i++) {
            assertThrowsWith(function () {
                Temporal.PlainDateTime.from(invalid[i]);
            }, "RangeError", "reject malformed ISO input: " + invalid[i]);
        }
    });

    test("F04 ISO time values reject regardless of overflow option", function () {
        // Native Temporal, Node v26.5.0: ISO strings never constrain invalid times.
        var invalid = ["2024-01-01T25:99:99", "2024-01-01T12:60", "2024-01-01T12:34:61"];
        var options = [undefined, { overflow: "constrain" }, { overflow: "reject" }];
        for (var i = 0; i < invalid.length; i++) {
            for (var j = 0; j < options.length; j++) {
                assertThrowsWith(function () {
                    Temporal.PlainDateTime.from(invalid[i], options[j]);
                }, "RangeError", "invalid ISO time with any overflow setting");
            }
        }
    });

    test("F04 ISO fractions accept dot and comma and preserve milliseconds", function () {
        // Native Temporal, Node v26.5.0; finer fractions use its millisecond field.
        var inputs = ["2024-01-01T12:34:56.789", "2024-01-01T12:34:56,789"];
        for (var i = 0; i < inputs.length; i++) {
            assertNodeEquals(Temporal.PlainDateTime.from(inputs[i]).toString(),
                "2024-01-01T12:34:56.789", "equivalent fraction separators");
        }
        assertNodeEquals(Temporal.PlainDateTime.from("2024-01-01T12:34:56.1").millisecond,
            100, "one fractional digit means 100 milliseconds");
        assertNodeEquals(Temporal.PlainDateTime.from("2024-01-01T12:34:56.123456789").millisecond,
            123, "Node millisecond field; finer precision intentionally omitted");
    });

    test("F04 valid date-only, short time, extended year and leap second remain supported", function () {
        // Native Temporal, Node v26.5.0 reference strings.
        var cases = [
            ["2024-01-01", "2024-01-01T00:00:00"],
            ["2024-01-01T12", "2024-01-01T12:00:00"],
            ["0000-01-01T00:00", "0000-01-01T00:00:00"],
            ["+012345-01-01T00:00", "+012345-01-01T00:00:00"],
            ["2024-01-01T23:59:60", "2024-01-01T23:59:59"]
        ];
        for (var i = 0; i < cases.length; i++) {
            assertNodeEquals(Temporal.PlainDateTime.from(cases[i][0], { overflow: "reject" }).toString(),
                cases[i][1], "supported ISO form: " + cases[i][0]);
        }
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
            "P1DT0.001S",
            "Temporal.PlainDateTime.from(a).until(Temporal.PlainDateTime.from(b)).toString()"
        );
        assertNodeEquals(
            untilString("2024-03-01T10:20:30.124", "2024-02-29T10:20:30.123"),
            "-P1DT0.001S",
            "Temporal.PlainDateTime.from(b).until(Temporal.PlainDateTime.from(a)).toString()"
        );
        assertNodeEquals(
            sinceString("2024-03-01T10:20:30.124", "2024-02-29T10:20:30.123"),
            "P1DT0.001S",
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


    test("F05 month-end differences keep their original anchor", function () {
        // Native Temporal, Node v26.5.0: start, end, largestUnit, until, since.
        var cases = [
            ["2024-01-31","2024-03-31","month","P2M","-P2M"],
            ["2024-01-31","2024-02-29","month","P29D","-P29D"],
            ["2024-03-31","2024-02-29","month","-P1M","P1M"],
            ["2023-01-31","2023-03-31","month","P2M","-P2M"]
        ];
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            var start = Temporal.PlainDateTime.from(row[0]);
            var options = { largestUnit: row[2] };
            assertNodeEquals(start.until(row[1], options).toString(), row[3],
                "until: " + row[0] + " -> " + row[1]);
            assertNodeEquals(start.since(row[1], options).toString(), row[4],
                "since: " + row[0] + " -> " + row[1]);
        }
    });


    test("F05 leap-year differences do not accumulate constrained dates", function () {
        // Native Temporal, Node v26.5.0: start, end, largestUnit, until, since.
        var cases = [
            ["2020-02-29","2024-02-29","year","P4Y","-P4Y"],
            ["2024-02-29","2020-02-29","year","-P4Y","P4Y"],
            ["2024-02-29","2025-02-28","year","P11M30D","-P11M30D"]
        ];
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            var start = Temporal.PlainDateTime.from(row[0]);
            var options = { largestUnit: row[2] };
            assertNodeEquals(start.until(row[1], options).toString(), row[3],
                "until: " + row[0] + " -> " + row[1]);
            assertNodeEquals(start.since(row[1], options).toString(), row[4],
                "since: " + row[0] + " -> " + row[1]);
        }
    });


    test("F05 time-of-day borrowing preserves calendar direction", function () {
        // Native Temporal, Node v26.5.0: start, end, largestUnit, until, since.
        var cases = [
            ["2024-01-31T12:00","2024-03-31T11:00","month","P1M30DT23H","-P1M30DT23H"],
            ["2024-03-31T11:00","2024-01-31T12:00","month","-P1M28DT23H","P1M28DT23H"],
            ["2024-02-29T12:00","2024-03-31T11:00","month","P1M1DT23H","-P1M1DT23H"],
            ["2024-03-31T11:00","2024-02-29T12:00","year","-P30DT23H","P30DT23H"]
        ];
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            var start = Temporal.PlainDateTime.from(row[0]);
            var options = { largestUnit: row[2] };
            assertNodeEquals(start.until(row[1], options).toString(), row[3],
                "until: " + row[0] + " -> " + row[1]);
            assertNodeEquals(start.since(row[1], options).toString(), row[4],
                "since: " + row[0] + " -> " + row[1]);
        }
    });

    test("F06 calendar until rounds signed remainders in both directions", function () {
        // Native Temporal, Node v26.5.0: mode, later-to-earlier, earlier-to-later.
        var cases = [
            ["ceil","-P2M1D","P2M2D"],
            ["floor","-P2M2D","P2M1D"],
            ["expand","-P2M2D","P2M2D"],
            ["trunc","-P2M1D","P2M1D"],
            ["halfCeil","-P2M1D","P2M2D"],
            ["halfFloor","-P2M2D","P2M1D"],
            ["halfExpand","-P2M2D","P2M2D"],
            ["halfTrunc","-P2M1D","P2M1D"],
            ["halfEven","-P2M2D","P2M2D"]
        ];
        var later = Temporal.PlainDateTime.from("2024-03-02T12:00");
        var earlier = Temporal.PlainDateTime.from("2024-01-01");
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            var options = { largestUnit: "month", smallestUnit: "day", roundingMode: row[0] };
            assertNodeEquals(later.until(earlier, options).toString(), row[1],
                "until later-to-earlier " + row[0]);
            assertNodeEquals(earlier.until(later, options).toString(), row[2],
                "until earlier-to-later " + row[0]);
        }
    });


    test("F06 calendar since rounds signed remainders in both directions", function () {
        // Native Temporal, Node v26.5.0: mode, later-to-earlier, earlier-to-later.
        var cases = [
            ["ceil","P2M2D","-P2M1D"],
            ["floor","P2M1D","-P2M2D"],
            ["expand","P2M2D","-P2M2D"],
            ["trunc","P2M1D","-P2M1D"],
            ["halfCeil","P2M2D","-P2M1D"],
            ["halfFloor","P2M1D","-P2M2D"],
            ["halfExpand","P2M2D","-P2M2D"],
            ["halfTrunc","P2M1D","-P2M1D"],
            ["halfEven","P2M2D","-P2M2D"]
        ];
        var later = Temporal.PlainDateTime.from("2024-03-02T12:00");
        var earlier = Temporal.PlainDateTime.from("2024-01-01");
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            var options = { largestUnit: "month", smallestUnit: "day", roundingMode: row[0] };
            assertNodeEquals(later.since(earlier, options).toString(), row[1],
                "since later-to-earlier " + row[0]);
            assertNodeEquals(earlier.since(later, options).toString(), row[2],
                "since earlier-to-later " + row[0]);
        }
    });

    test("F07 day differences preserve subsecond fields in both directions", function () {
        // Native Temporal, Node v26.5.0: compare fields, independently of toString (F08).
        var cases = [
            ["2024-01-01","2024-01-02T00:00:00.001","day",[0,0,0,1,0,0,0,1]],
            ["2024-01-01","2024-01-02T00:00:00.999","day",[0,0,0,1,0,0,0,999]],
            ["2024-01-02T00:00:00.001","2024-01-01","day",[0,0,0,-1,0,0,0,-1]],
            ["2024-01-02T00:00:00.999","2024-01-01","day",[0,0,0,-1,0,0,0,-999]]
        ];
        var fields = ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            var start = Temporal.PlainDateTime.from(row[0]);
            var until = start.until(row[1], { largestUnit: row[2] });
            var since = start.since(row[1], { largestUnit: row[2] });
            for (var j = 0; j < fields.length; j++) {
                assertNodeEquals(until[fields[j]], row[3][j], "until " + fields[j] + " case " + i);
                assertNodeEquals(since[fields[j]], -row[3][j], "since " + fields[j] + " case " + i);
            }
        }
    });


    test("F07 week and month remainders preserve milliseconds", function () {
        // Native Temporal, Node v26.5.0: compare fields, independently of toString (F08).
        var cases = [
            ["2024-01-01","2024-01-09T00:00:00.001","week",[0,0,1,1,0,0,0,1]],
            ["2024-01-01","2024-02-02T00:00:00.001","month",[0,1,0,1,0,0,0,1]]
        ];
        var fields = ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
        for (var i = 0; i < cases.length; i++) {
            var row = cases[i];
            var start = Temporal.PlainDateTime.from(row[0]);
            var until = start.until(row[1], { largestUnit: row[2] });
            var since = start.since(row[1], { largestUnit: row[2] });
            for (var j = 0; j < fields.length; j++) {
                assertNodeEquals(until[fields[j]], row[3][j], "until " + fields[j] + " case " + i);
                assertNodeEquals(since[fields[j]], -row[3][j], "since " + fields[j] + " case " + i);
            }
        }
    });
    test("F13 halfEven uses parity within the parent unit", function () {
        // Native Temporal, Node v26.5.0 reference strings.
        var cases = [
            ["2024-01-01T00:00:01.500",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"halfEven"},"2024-01-01T00:00:01.4"],
            ["2024-01-01T00:00:00.500",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"halfEven"},"2024-01-01T00:00:00.4"],
            ["2024-01-01T00:00:01.700",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"halfEven"},"2024-01-01T00:00:01.8"],
            ["2024-01-01T00:01:10",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"halfEven"},"2024-01-01T00:01:00"],
            ["2024-01-01T00:00:10",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"halfEven"},"2024-01-01T00:00:00"],
            ["2024-01-01T01:10",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"halfEven"},"2024-01-01T01:00:00"],
            ["2024-01-01T00:10",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"halfEven"},"2024-01-01T00:00:00"],
            ["2024-01-01T12:00",{"smallestUnit":"day","roundingIncrement":1,"roundingMode":"halfEven"},"2024-01-01T00:00:00"]
        ];
        for (var i = 0; i < cases.length; i++) {
            assertNodeEquals(Temporal.PlainDateTime.from(cases[i][0]).round(cases[i][1]).toString(),
                cases[i][2], cases[i][0] + " case " + i);
        }
    });

    test("F13 rounding modes preserve time and date carries", function () {
        // Native Temporal, Node v26.5.0 reference strings.
        var cases = [
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"ceil"},"2024-03-01T00:00:00"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"ceil"},"2024-03-01T00:00:00"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"ceil"},"2025-01-01T00:00:00"],
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"floor"},"2024-02-29T23:59:59.8"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"floor"},"2024-02-29T23:59:40"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"floor"},"2024-12-31T23:40:00"],
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"expand"},"2024-03-01T00:00:00"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"expand"},"2024-03-01T00:00:00"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"expand"},"2025-01-01T00:00:00"],
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"trunc"},"2024-02-29T23:59:59.8"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"trunc"},"2024-02-29T23:59:40"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"trunc"},"2024-12-31T23:40:00"],
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"halfCeil"},"2024-03-01T00:00:00"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"halfCeil"},"2024-03-01T00:00:00"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"halfCeil"},"2025-01-01T00:00:00"],
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"halfFloor"},"2024-02-29T23:59:59.8"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"halfFloor"},"2024-02-29T23:59:40"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"halfFloor"},"2024-12-31T23:40:00"],
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"halfExpand"},"2024-03-01T00:00:00"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"halfExpand"},"2024-03-01T00:00:00"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"halfExpand"},"2025-01-01T00:00:00"],
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"halfTrunc"},"2024-02-29T23:59:59.8"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"halfTrunc"},"2024-02-29T23:59:40"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"halfTrunc"},"2024-12-31T23:40:00"],
            ["2024-02-29T23:59:59.900",{"smallestUnit":"millisecond","roundingIncrement":200,"roundingMode":"halfEven"},"2024-02-29T23:59:59.8"],
            ["2024-02-29T23:59:50",{"smallestUnit":"second","roundingIncrement":20,"roundingMode":"halfEven"},"2024-02-29T23:59:40"],
            ["2024-12-31T23:50",{"smallestUnit":"minute","roundingIncrement":20,"roundingMode":"halfEven"},"2024-12-31T23:40:00"]
        ];
        for (var i = 0; i < cases.length; i++) {
            assertNodeEquals(Temporal.PlainDateTime.from(cases[i][0]).round(cases[i][1]).toString(),
                cases[i][2], cases[i][0] + " case " + i);
        }
    });

    test("F12 rounding increments coerce numeric strings and values", function () {
        // Native Temporal, Node v26.5.0 reference strings.
        var cases = [
            ["2024-01-01T12:07","minute","15","2024-01-01T12:00:00"],
            ["2024-02-29T22:31","hour","3","2024-03-01T00:00:00"],
            ["2024-01-01T12:00:07","second","15","2024-01-01T12:00:00"],
            ["2024-01-01T00:00:00.126","millisecond","50","2024-01-01T00:00:00.15"],
            ["2024-02-29T13:00","day","1","2024-03-01T00:00:00"],
            ["2024-01-01T12:07:31","minute",true,"2024-01-01T12:08:00"]
        ];
        for (var i = 0; i < cases.length; i++) {
            assertNodeEquals(Temporal.PlainDateTime.from(cases[i][0]).round({
                smallestUnit: cases[i][1], roundingIncrement: cases[i][2]
            }).toString(), cases[i][3], "coerced increment case " + i);
        }
        assertNodeEquals(Temporal.PlainDateTime.from("2024-01-01T12:07").round({
            smallestUnit: "minute", roundingIncrement: { valueOf: function () { return 15; } }
        }).toString(), "2024-01-01T12:00:00", "numeric object increment");
    });

    test("F12 invalid nonnumeric increments are not silently replaced by one", function () {
        var values = ["oops", "0", "", null, false, "Infinity", "7", "60"];
        var dateTime = Temporal.PlainDateTime.from("2024-01-01T12:07");
        for (var i = 0; i < values.length; i++) {
            assertThrowsWith(function () {
                dateTime.round({ smallestUnit: "minute", roundingIncrement: values[i] });
            }, "RangeError", "invalid coerced increment case " + i);
        }
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
            dateTime.round({ smallestUnit: "hour", roundingIncrement: 24 });
        }, "RangeError", "round hour increment maximum should throw like Node");
        assertThrowsWith(function () {
            dateTime.round({ smallestUnit: "day", roundingIncrement: 2 });
        }, "RangeError", "round day increment maximum should throw like Node");
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
