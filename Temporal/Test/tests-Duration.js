//@include "../../Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
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

    function assertThrowsWith(fn, expectedName, expectedMessage, message) {
        try {
            fn();
        } catch (error) {
            if (typeof process !== "undefined" && process.versions && process.versions.node) {
                assertEquals(error.name, expectedName, (message || "Unexpected error name"));
            } else if (expectedName === "TypeError") {
                assert(error instanceof TypeError, message || "Unexpected error type");
            } else if (expectedName === "RangeError") {
                assert(error instanceof RangeError, message || "Unexpected error type");
            } else {
                assertEquals(error.name, expectedName, (message || "Unexpected error name"));
            }
            assertEquals(error.message, expectedMessage, (message || "Unexpected error message"));
            return;
        }

        fail(message || "Expected function to throw");
    }

    function assertAlmostEquals(actual, expected, epsilon, message) {
        if (Math.abs(actual - expected) > epsilon) {
            fail((message || "Values are not close enough") +
                "\n  expected: " + expected +
                "\n  actual:   " + actual);
        }
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
        writeLine("[SKIP] " + name + (reason ? " — " + reason : ""));
    }

    writeLine("Temporal ExtendScript polyfill tests");
    writeLine("------------------------------------");

    test("Temporal namespace is loaded", function () {
        assert(typeof Temporal === "object", "Temporal namespace should exist");
        assert(typeof Temporal.Duration === "function", "Temporal.Duration should exist");
        assert(typeof Temporal.PlainDateTime === "function", "Temporal.PlainDateTime should exist");
    });

    test("Duration.from parses an ISO duration", function () {
        var duration = Temporal.Duration.from("P1Y2M3W4DT5H6M7.008S");

        assertEquals(duration.years, 1, "years");
        assertEquals(duration.months, 2, "months");
        assertEquals(duration.weeks, 3, "weeks");
        assertEquals(duration.days, 4, "days");
        assertEquals(duration.hours, 5, "hours");
        assertEquals(duration.minutes, 6, "minutes");
        assertEquals(duration.seconds, 7, "seconds");
        assertEquals(duration.milliseconds, 8, "milliseconds");
        assertEquals(duration.toString(), "P1Y2M3W4DT5H6M7.008S", "toString");
    });

    test("Duration.from parses a negative ISO duration", function () {
        var duration = Temporal.Duration.from("-P1DT2H");

        assertEquals(duration.sign, -1, "sign");
        assertEquals(duration.days, -1, "days");
        assertEquals(duration.hours, -2, "hours");
        assertEquals(duration.toString(), "-P1DT2H", "toString");
    });

    test("__copyFields__ copies own fields without creating a Temporal instance", function () {
        var source = { year: 2024, month: 2 };
        var copied = Temporal.__copyFields__(source);

        assertEquals(copied.year, 2024, "__copyFields__ should copy own fields");
        assertEquals(copied.month, 2, "__copyFields__ should copy own fields");
        assertEquals(typeof copied.add, "undefined", "__copyFields__ should return a plain data object");

        copied.year = 2000;
        assertEquals(source.year, 2024, "copy should not mutate source object");
    });

    test("Gregorian day serial helpers count calendar days without Date", function () {
        assertEquals(Temporal.__dateToDaySerial__(1970, 1, 1), 0, "Unix epoch day serial");
        assertEquals(
            Temporal.__daysBetweenDates__(
                { year: 2024, month: 2, day: 28 },
                { year: 2025, month: 2, day: 28 }
            ),
            366,
            "2024-02-28 to 2025-02-28 crosses leap day"
        );
        assertEquals(
            Temporal.__daysBetweenDates__(
                { year: 2024, month: 2, day: 29 },
                { year: 2025, month: 2, day: 28 }
            ),
            365,
            "2024-02-29 to 2025-02-28 starts after the leap day"
        );
        assertEquals(
            Temporal.__daysBetweenDates__(
                { year: 2025, month: 2, day: 28 },
                { year: 2024, month: 2, day: 29 }
            ),
            -365,
            "day difference should keep direction"
        );
    });

    test("Duration.from handles millisecond-only objects", function () {
        var duration = Temporal.Duration.from({ milliseconds: 1 });

        assertEquals(duration.sign, 1, "sign");
        assertEquals(duration.milliseconds, 1, "milliseconds");
        assertEquals(duration.toString(), "PT0.001S", "toString");
    });

    test("Duration.from matches Node Temporal object edge cases", function () {
        assertEquals(Temporal.Duration.from({ days: 1, banana: 2 }).toString(), "P1D", "unknown keys should be ignored");
        assertEquals(Temporal.Duration.from({ days: 0 }).toString(), "PT0S", "zero duration field should be accepted");
        assertEquals(Temporal.Duration.from({ hours: "2" }).toString(), "PT2H", "numeric strings should be accepted");
        assertEquals(Temporal.Duration.from({ hours: null }).toString(), "PT0S", "null field coerces to zero");
        assertEquals(Temporal.Duration.from({ hours: false }).toString(), "PT0S", "false field coerces to zero");
        assertEquals(Temporal.Duration.from({ hours: "" }).toString(), "PT0S", "empty string field coerces to zero");
        assertEquals(Temporal.Duration.from("+P1D").toString(), "P1D", "leading plus sign");
        assertEquals(Temporal.Duration.from("P0D").toString(), "PT0S", "zero date field string");

        assertThrowsWith(function () {
            Temporal.Duration.from(undefined);
        }, "TypeError", "Temporal error: Duration argument must be Duration or string.", "undefined from input");

        assertThrowsWith(function () {
            Temporal.Duration.from(null);
        }, "TypeError", "Temporal error: Duration argument must be Duration or string.", "null from input");

        assertThrowsWith(function () {
            Temporal.Duration.from({});
        }, "TypeError", "Temporal error: Did not provide any valid Duration fields.", "empty object");

        assertThrowsWith(function () {
            Temporal.Duration.from({ day: 1 });
        }, "TypeError", "Temporal error: Did not provide any valid Duration fields.", "singular field name");

        assertThrowsWith(function () {
            Temporal.Duration.from({ days: 1, hours: -1 });
        }, "RangeError", "Temporal error: Duration was not valid.", "mixed signs");

        assertThrowsWith(function () {
            Temporal.Duration.from({ days: 1.5 });
        }, "RangeError", "Temporal error: Expected finite integer.", "fractional field");

        assertThrowsWith(function () {
            Temporal.Duration.from({ hours: NaN });
        }, "RangeError", "Temporal error: Expected finite integer.", "NaN field");

        assertThrowsWith(function () {
            Temporal.Duration.from({ hours: Infinity });
        }, "RangeError", "Temporal error: Expected finite integer.", "infinite field");
    });

    test("Duration constructor matches Node Temporal field validation", function () {
        assertEquals(new Temporal.Duration().toString(), "PT0S", "empty constructor");
        assertEquals(new Temporal.Duration(0, 0, 0, 1).toString(), "P1D", "day constructor");
        assertEquals(new Temporal.Duration(0, 0, 0, -1, -2).toString(), "-P1DT2H", "negative fields");
        assertEquals(new Temporal.Duration(0, 0, 0, "1").toString(), "P1D", "numeric string field");
        assertEquals(new Temporal.Duration(0, 0, 0, null).toString(), "PT0S", "null coerces to zero");
        assertEquals(new Temporal.Duration(undefined, 0, 0, 1).toString(), "P1D", "undefined coerces to zero");
        assertEquals(new Temporal.Duration(0, 0, 0, 0, 25).toString(), "PT25H", "hours do not balance");

        assertThrowsWith(function () {
            new Temporal.Duration(0, 0, 0, 1, -1);
        }, "RangeError", "Temporal error: Duration was not valid.", "mixed constructor signs");

        assertThrowsWith(function () {
            new Temporal.Duration(0, 0, 0, 1.5);
        }, "RangeError", "Temporal error: Expected finite integer.", "fractional constructor field");

        assertThrowsWith(function () {
            new Temporal.Duration(0, 0, 0, NaN);
        }, "RangeError", "Temporal error: Expected finite integer.", "NaN constructor field");

        assertThrowsWith(function () {
            new Temporal.Duration(0, 0, 0, Infinity);
        }, "RangeError", "Temporal error: Expected finite integer.", "infinite constructor field");

        assertThrowsWith(function () {
            Temporal.Duration(0, 0, 0, 1);
        }, "TypeError", "Method invoked on an object that is not Temporal.Duration.", "constructor without new");
    });

    test("Duration.negated and abs include weeks", function () {
        var duration = Temporal.Duration.from("P2W");
        var negated = duration.negated();
        var absolute = negated.abs();

        assertEquals(negated.weeks, -2, "negated weeks");
        assertEquals(negated.toString(), "-P2W", "negated toString");
        assertEquals(absolute.weeks, 2, "absolute weeks");
        assertEquals(absolute.toString(), "P2W", "absolute toString");
    });

    test("Duration.add and subtract use a valid basic path", function () {
        var duration = Temporal.Duration.from("P3D");

        assertEquals(duration.add("P2D").toString(), "P5D", "add days");
        assertEquals(duration.subtract("P1D").toString(), "P2D", "subtract days");
        assertEquals(Temporal.Duration.from("P1D").subtract("PT0.001S").toString(), "PT23H59M59.999S", "subtract should rebalance through milliseconds");
        assertEquals(Temporal.Duration.from("PT23H").add("PT2H").toString(), "PT25H", "add should preserve the largest time unit");
        assertEquals(duration.toString(), "P3D", "add/subtract should not mutate the original");
    });

    test("Duration.add and subtract preserve Node Temporal time units", function () {
        assertEquals(Temporal.Duration.from("PT60M").add("PT1M").toString(), "PT61M", "minutes should not balance to hours");
        assertEquals(Temporal.Duration.from("PT59S").add("PT2S").toString(), "PT61S", "seconds should not balance to minutes");
        assertEquals(Temporal.Duration.from("PT1H").add("-PT30M").toString(), "PT30M", "opposite signs positive remainder");
        assertEquals(Temporal.Duration.from("PT30M").add("-PT1H").toString(), "-PT30M", "opposite signs negative remainder");
        assertEquals(Temporal.Duration.from("P1D").add("PT24H").toString(), "P2D", "days remain the largest unit");
        assertEquals(Temporal.Duration.from("P1D").subtract("PT25H").toString(), "-PT1H", "negative remainder drops zero days");
    });

    test("Duration.with matches Node Temporal edge cases", function () {
        var duration = Temporal.Duration.from("P1DT2H");

        assertEquals(Temporal.Duration.from("P1D").with({ hours: 2 }).toString(), "P1DT2H", "set positive field");
        assertEquals(Temporal.Duration.from("P1D").with({ hours: 2, banana: 1 }).toString(), "P1DT2H", "unknown keys with valid fields should be ignored");
        assertEquals(duration.with({ days: 0 }).toString(), "PT2H", "clear one field");
        assertEquals(Temporal.Duration.from("P1D").with({ days: 0 }).toString(), "PT0S", "clear last non-zero field");
        assertEquals(Temporal.Duration.from("P1D").with({ hours: "2" }).toString(), "P1DT2H", "numeric string field");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1D").with({ hours: -2 });
        }, "RangeError", "Temporal error: Duration was not valid.", "mixed signs");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1D").with({ hours: NaN });
        }, "RangeError", "Temporal error: Expected finite integer.", "NaN with field");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1D").with({});
        }, "TypeError", "Temporal error: Did not provide any valid Duration fields.", "empty with");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1D").with({ banana: 1 });
        }, "TypeError", "Temporal error: Did not provide any valid Duration fields.", "invalid with key");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1D").with(null);
        }, "TypeError", "Temporal error: Must provide a duration.", "null with");
    });

    test("Duration sign and blank are derived from fields", function () {
        var zero = Temporal.Duration.from({ days: 0 });
        var positive = Temporal.Duration.from({ days: 1, sign: -1, blank: true });
        var negative = Temporal.Duration.from({ days: -1 });
        var cleared = negative.with({ days: 0 });
        var expandedNegative = Temporal.Duration.from("-P1D").with({ hours: -2 });

        assertEquals(zero.sign, 0, "zero sign");
        assertEquals(zero.blank, true, "zero blank");
        assertEquals(positive.sign, 1, "positive sign ignores input sign");
        assertEquals(positive.blank, false, "positive blank ignores input blank");
        assertEquals(negative.sign, -1, "negative sign");
        assertEquals(negative.blank, false, "negative blank");
        assertEquals(cleared.sign, 0, "cleared sign");
        assertEquals(cleared.blank, true, "cleared blank");
        assertEquals(expandedNegative.sign, -1, "expanded negative sign");
        assertEquals(expandedNegative.toString(), "-P1DT2H", "expanded negative string");
    });

    test("Duration.compare matches Node Temporal basics and calendar errors", function () {
        assertEquals(Temporal.Duration.compare("P1D", "PT24H"), 0, "one day equals twenty-four hours");
        assertEquals(Temporal.Duration.compare("P2D", "PT24H"), 1, "two days greater than twenty-four hours");
        assertEquals(Temporal.Duration.compare("-P1D", "PT0S"), -1, "negative duration less than zero");
        assertEquals(Temporal.Duration.compare("P1M", "P1M"), 0, "same calendar fields compare equal without relativeTo");
        assertEquals(
            Temporal.Duration.compare("P1M", "P30D", { relativeTo: Temporal.PlainDateTime.from("2024-01-01T00:00:00") }),
            1,
            "January 2024 month is longer than thirty days"
        );
        assertEquals(
            Temporal.Duration.compare("P1M", "P30D", { relativeTo: Temporal.PlainDateTime.from("2024-02-01T00:00:00") }),
            -1,
            "February 2024 month is shorter than thirty days"
        );

        assertThrowsWith(function () {
            Temporal.Duration.compare("P1W", "P7D");
        }, "RangeError", "Temporal error: ", "week compare needs relativeTo");

        assertThrowsWith(function () {
            Temporal.Duration.compare("P1M", "P30D");
        }, "RangeError", "Temporal error: ", "month compare needs relativeTo");
    });

    test("Duration.compare matches Node Temporal closing edge cases", function () {
        assertEquals(Temporal.Duration.compare({ days: 1 }, { hours: 24 }), 0, "object inputs");
        assertEquals(Temporal.Duration.compare({ hours: "25" }, { days: 1 }), 1, "numeric string object input");
        assertEquals(Temporal.Duration.compare("-P1M", "-P30D", { relativeTo: "2024-03-31T00:00:00" }), -1, "negative calendar relativeTo string");
        assertEquals(
            Temporal.Duration.compare("P1M", "P30D", { relativeTo: { year: 2024, month: 1, day: 1 } }),
            1,
            "relativeTo date field object"
        );
        assertEquals(Temporal.Duration.compare("P1D", "PT24H", { ignored: true }), 0, "extra options ignored");

        assertThrowsWith(function () {
            Temporal.Duration.compare("P1M", "P30D", null);
        }, "TypeError", "Temporal error: Option must be object: relativeTo.", "null options with calendar compare");

        assertThrowsWith(function () {
            Temporal.Duration.compare({ days: 1, hours: -1 }, "PT0S");
        }, "RangeError", "Temporal error: Duration was not valid.", "mixed signs object compare");

        assertThrowsWith(function () {
            Temporal.Duration.compare(undefined, "PT0S");
        }, "TypeError", "Temporal error: Duration argument must be Duration or string.", "invalid first compare input");

        assertThrowsWith(function () {
            Temporal.Duration.compare("PT0S", null);
        }, "TypeError", "Temporal error: Duration argument must be Duration or string.", "invalid second compare input");
    });

    test("Duration.toString matches Node Temporal millisecond formatting", function () {
        assertEquals(Temporal.Duration.from({ seconds: 1, milliseconds: 230 }).toString(), "PT1.23S", "trim trailing fractional zeros");
        assertEquals(Temporal.Duration.from({ milliseconds: 10 }).toString(), "PT0.01S", "keep enough fractional digits");
        assertEquals(Temporal.Duration.from("P1Y2DT0.001S").toString(), "P1Y2D", "date part hides fractional-only seconds like Node");
        assertEquals(Temporal.Duration.from("-P1Y2DT0.001S").toString(), "-P1Y2D", "negative date part hides fractional-only seconds like Node");
        assertEquals(Temporal.Duration.from("P2DT1.001S").toString(), "P2DT1.001S", "date part keeps non-zero whole seconds");
        assertEquals(Temporal.Duration.from("P2DT1H0.001S").toString(), "P2DT1H", "date part keeps hour and hides fractional-only seconds");
        assertEquals(Temporal.Duration.from({ hours: 1, milliseconds: 1 }).toString(), "PT1H", "hour hides fractional-only seconds like Node");
        assertEquals(Temporal.Duration.from({ minutes: 1, milliseconds: 1 }).toString(), "PT1M", "minute hides fractional-only seconds like Node");
        assertEquals(Temporal.Duration.from({ hours: 4, minutes: 4, milliseconds: 252 }).toString(), "PT4H4M", "higher time units hide fractional-only seconds like Node");
        assertEquals(Temporal.Duration.from({ seconds: 1, milliseconds: 1 }).toString(), "PT1.001S", "whole seconds keep their fraction");
        assertEquals(Temporal.Duration.from("PT25H").toString(), "PT25H", "string hours should not balance");
        assertEquals(Temporal.Duration.from("PT60M").toString(), "PT60M", "string minutes should not balance");
        assertEquals(Temporal.Duration.from("PT60S").toString(), "PT60S", "string seconds should not balance");
    });

    test("Duration.toString options match Node Temporal millisecond subset", function () {
        assertEquals(Temporal.Duration.from("PT1H2M3.456S").toString({ smallestUnit: "second" }), "PT1H2M3S", "smallestUnit second truncates by default");
        assertEquals(Temporal.Duration.from("PT1.234S").toString({ fractionalSecondDigits: 0 }), "PT1S", "zero fractional digits");
        assertEquals(Temporal.Duration.from("PT1.234S").toString({ fractionalSecondDigits: 2 }), "PT1.23S", "two fractional digits");
        assertEquals(Temporal.Duration.from("PT1.230S").toString({ fractionalSecondDigits: "auto" }), "PT1.23S", "auto fractional digits");
        assertEquals(Temporal.Duration.from("PT1.234S").toString({ smallestUnit: "second", roundingMode: "ceil" }), "PT2S", "ceil to second");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1H2M3.456S").toString({ smallestUnit: "minute" });
        }, "RangeError", "Temporal error: string rounding options cannot have hour or minute smallest unit.", "minute string rounding");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1S").toString({ fractionalSecondDigits: 10 });
        }, "RangeError", "fractionalSecondDigits value is out of range.", "fractionalSecondDigits range");
    });

    test("Duration.toLocaleString is a simple toString alias", function () {
        assertEquals(Temporal.Duration.from("P1DT2H").toLocaleString(), "P1DT2H", "locale string alias");
        assertEquals(new Temporal.Duration().toLocaleString(), "PT0S", "zero locale string alias");
    });

    test("Duration.toJSON uses ISO duration strings", function () {
        assertEquals(Temporal.Duration.from("P1DT2H").toJSON(), "P1DT2H", "toJSON");
    });

    test("Duration.add and subtract reject calendar largest units like Node Temporal", function () {
        assertThrowsWith(function () {
            Temporal.Duration.from("P1W").add("P1D");
        }, "RangeError", "Temporal error: Largest unit cannot be a calendar unit when adding two durations.", "week add");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1M").add("P1D");
        }, "RangeError", "Temporal error: Largest unit cannot be a calendar unit when adding two durations.", "month add");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1M").subtract("P1D");
        }, "RangeError", "Temporal error: Largest unit cannot be a calendar unit when adding two durations.", "month subtract");
    });

    test("Duration.total uses relative date position when converting years", function () {
        var beforeLeapDay = Temporal.PlainDateTime.from("2024-02-28T00:00:00");
        var onLeapDay = Temporal.PlainDateTime.from("2024-02-29T00:00:00");
        var oneYear = Temporal.Duration.from("P1Y");

        assertEquals(
            oneYear.total({ unit: "day", relativeTo: beforeLeapDay }),
            366,
            "2024-02-28 + P1Y should span 366 days"
        );
        assertEquals(
            oneYear.total({ unit: "day", relativeTo: onLeapDay }),
            365,
            "2024-02-29 + P1Y should span 365 days"
        );
        assertEquals(
            oneYear.total({ unit: "week", relativeTo: beforeLeapDay }),
            366 / 7,
            "2024-02-28 + P1Y should span 366 days"
        );
        assertEquals(
            oneYear.total({ unit: "week", relativeTo: onLeapDay }),
            365 / 7,
            "2024-02-29 + P1Y should span 365 days"
        );
        assertEquals(
            oneYear.total({ unit: "year", relativeTo: beforeLeapDay }),
            1,
            "P1Y should total to exactly 1 year before leap day"
        );
        assertEquals(
            oneYear.total({ unit: "year", relativeTo: onLeapDay }),
            1,
            "P1Y should total to exactly 1 year on leap day"
        );
        assertEquals(
            oneYear.total({ unit: "month", relativeTo: onLeapDay }),
            12,
            "P1Y should total to exactly 12 months on leap day"
        );
    });

    test("Duration.total option validation matches Node Temporal", function () {
        var duration = Temporal.Duration.from("P1DT2H3M4.005S");
        var yearDuration = Temporal.Duration.from("P1Y");

        assertAlmostEquals(duration.total("days"), 1.0854630208333333, 0.000000000001, "plural string unit");
        assertAlmostEquals(duration.total({ unit: "seconds", roundingMode: "ceil", extra: true }), 93784.005, 0.000000000001, "plural object unit and ignored options");

        assertThrowsWith(function () {
            duration.total(undefined);
        }, "TypeError", "Temporal error: Must specify a totalOf parameter", "undefined totalOf");

        assertThrowsWith(function () {
            duration.total(null);
        }, "TypeError", "Temporal error: totalOf must be an object.", "null totalOf");

        assertThrowsWith(function () {
            duration.total({});
        }, "RangeError", "Value undefined out of range for Temporal.Duration.prototype.total options property unit", "missing unit");

        assertThrowsWith(function () {
            duration.total({ relativeTo: Temporal.PlainDateTime.from("2024-01-01T00:00:00") });
        }, "RangeError", "Value undefined out of range for Temporal.Duration.prototype.total options property unit", "missing unit with relativeTo");

        assertThrowsWith(function () {
            duration.total("banana");
        }, "RangeError", "Value banana out of range for Temporal.Duration.prototype.total options property unit", "invalid string unit");

        assertThrowsWith(function () {
            duration.total({ unit: null });
        }, "RangeError", "Value null out of range for Temporal.Duration.prototype.total options property unit", "null unit");

        assertThrowsWith(function () {
            duration.total({ unit: 1 });
        }, "RangeError", "Value 1 out of range for Temporal.Duration.prototype.total options property unit", "number unit");

        assertThrowsWith(function () {
            yearDuration.total({ unit: "day" });
        }, "RangeError", "Temporal error: ", "calendar duration needs relativeTo");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1W").total({ unit: "day" });
        }, "RangeError", "Temporal error: ", "week duration needs relativeTo");
    });

    test("Duration.total matches Node Temporal for negative year/month fractions", function () {
        var relative = Temporal.PlainDateTime.from("2022-02-28T00:00:00");
        var duration = Temporal.Duration.from("-P1Y2DT0.001S");
        var twoDays = Temporal.Duration.from("-P2D");

        assertAlmostEquals(
            duration.total({ unit: "year", relativeTo: relative }),
            -1.00546448090594,
            0.000000000001,
            "negative year fraction should match Node Temporal"
        );
        assertAlmostEquals(
            duration.total({ unit: "month", relativeTo: relative }),
            -12.064516129405614,
            0.000000000001,
            "negative month fraction should match Node Temporal"
        );
        assertAlmostEquals(
            duration.total({ unit: "week", relativeTo: relative }),
            -52.42857143022487,
            0.000000000001,
            "negative week total should keep millisecond precision"
        );
        assertAlmostEquals(
            twoDays.total({ unit: "year", relativeTo: relative }),
            -0.005479452054794521,
            0.000000000001,
            "without a whole year component, -P2D should match Node Temporal"
        );
        assertAlmostEquals(
            twoDays.total({ unit: "month", relativeTo: relative }),
            -0.06451612903225806,
            0.000000000001,
            "without a whole month component, -P2D should match Node Temporal"
        );
    });

    test("Duration.total matches Node Temporal edge cases", function () {
        var relative;
        var duration;

        relative = Temporal.PlainDateTime.from("2022-02-28T00:00:00");
        duration = Temporal.Duration.from("P1Y2D");
        assertAlmostEquals(duration.total({ unit: "year", relativeTo: relative }), 1.0054794520547945, 0.000000000001, "P1Y2D total years");
        assertAlmostEquals(duration.total({ unit: "month", relativeTo: relative }), 12.071428571428571, 0.000000000001, "P1Y2D total months");
        assertAlmostEquals(duration.total({ unit: "week", relativeTo: relative }), 52.42857142857143, 0.000000000001, "P1Y2D total weeks");
        assertAlmostEquals(duration.total({ unit: "day", relativeTo: relative }), 367, 0.000000000001, "P1Y2D total days");
        assertAlmostEquals(duration.total({ unit: "hour", relativeTo: relative }), 8808, 0.000000000001, "P1Y2D total hours");
        assertAlmostEquals(duration.total({ unit: "millisecond", relativeTo: relative }), 31708800000, 0.000000000001, "P1Y2D total milliseconds");

        relative = Temporal.PlainDateTime.from("2024-01-31T00:00:00");
        duration = Temporal.Duration.from("P1M2D");
        assertAlmostEquals(duration.total({ unit: "year", relativeTo: relative }), 0.08469945355191257, 0.000000000001, "P1M2D from month end total years");
        assertAlmostEquals(duration.total({ unit: "month", relativeTo: relative }), 1.064516129032258, 0.000000000001, "P1M2D from month end total months");
        assertAlmostEquals(duration.total({ unit: "week", relativeTo: relative }), 4.428571428571429, 0.000000000001, "P1M2D from month end total weeks");
        assertAlmostEquals(duration.total({ unit: "day", relativeTo: relative }), 31, 0.000000000001, "P1M2D from month end total days");

        relative = Temporal.PlainDateTime.from("2024-03-31T00:00:00");
        duration = Temporal.Duration.from("-P1M2D");
        assertAlmostEquals(duration.total({ unit: "year", relativeTo: relative }), -0.09016393442622951, 0.000000000001, "-P1M2D from 2024-03-31 total years");
        assertAlmostEquals(duration.total({ unit: "month", relativeTo: relative }), -1.0689655172413792, 0.000000000001, "-P1M2D from 2024-03-31 total months");
        assertAlmostEquals(duration.total({ unit: "week", relativeTo: relative }), -4.714285714285714, 0.000000000001, "-P1M2D from 2024-03-31 total weeks");
        assertAlmostEquals(duration.total({ unit: "day", relativeTo: relative }), -33, 0.000000000001, "-P1M2D from 2024-03-31 total days");

        relative = Temporal.PlainDateTime.from("2024-01-31T00:00:00");
        duration = Temporal.Duration.from("P1M");
        assertAlmostEquals(duration.total({ unit: "month", relativeTo: relative }), 1, 0.000000000001, "P1M from 2024-01-31 total months");
        assertAlmostEquals(duration.total({ unit: "week", relativeTo: relative }), 4.142857142857143, 0.000000000001, "P1M from 2024-01-31 total weeks");
        assertAlmostEquals(duration.total({ unit: "day", relativeTo: relative }), 29, 0.000000000001, "P1M from 2024-01-31 total days");

        relative = Temporal.PlainDateTime.from("2024-02-28T00:00:00");
        duration = Temporal.Duration.from("P1YT1S");
        assertAlmostEquals(duration.total({ unit: "year", relativeTo: relative }), 1.000000031709792, 0.000000000001, "P1YT1S total years");
        assertAlmostEquals(duration.total({ unit: "day", relativeTo: relative }), 366.00001157407405, 0.000000000001, "P1YT1S total days");
        assertAlmostEquals(duration.total({ unit: "second", relativeTo: relative }), 31622401, 0.000000000001, "P1YT1S total seconds");
        assertAlmostEquals(duration.total({ unit: "millisecond", relativeTo: relative }), 31622401000, 0.000000000001, "P1YT1S total milliseconds");
    });

    test("Duration.round balances milliseconds back to calendar fields with day serials", function () {
        var beforeLeapDay = Temporal.PlainDateTime.from("2024-02-28T00:00:00");
        var onLeapDay = Temporal.PlainDateTime.from("2024-02-29T00:00:00");
        var februaryStart = Temporal.PlainDateTime.from("2024-02-01T00:00:00");

        assertEquals(
            Temporal.Duration.from("P366D").round({
                largestUnit: "year",
                smallestUnit: "millisecond",
                relativeTo: beforeLeapDay
            }).toString(),
            "P1Y",
            "366 days from 2024-02-28 balances to P1Y"
        );
        assertEquals(
            Temporal.Duration.from("P365D").round({
                largestUnit: "year",
                smallestUnit: "millisecond",
                relativeTo: onLeapDay
            }).toString(),
            "P1Y",
            "365 days from 2024-02-29 balances to P1Y"
        );
        assertEquals(
            Temporal.Duration.from("P29D").round({
                largestUnit: "month",
                smallestUnit: "millisecond",
                relativeTo: februaryStart
            }).toString(),
            "P1M",
            "29 days from 2024-02-01 balances to P1M"
        );
    });

    test("Duration.round matches Node Temporal rounding modes", function () {
        function assertRound(durationString, smallestUnit, roundingMode, expected) {
            assertEquals(
                Temporal.Duration.from(durationString).round({
                    smallestUnit: smallestUnit,
                    roundingMode: roundingMode
                }).toString(),
                expected,
                durationString + " round " + roundingMode + " to " + smallestUnit
            );
        }

        assertRound("PT90S", "minute", "ceil", "PT2M");
        assertRound("PT90S", "minute", "floor", "PT1M");
        assertRound("PT90S", "minute", "expand", "PT2M");
        assertRound("PT90S", "minute", "trunc", "PT1M");
        assertRound("PT90S", "minute", "halfCeil", "PT2M");
        assertRound("PT90S", "minute", "halfFloor", "PT1M");
        assertRound("PT90S", "minute", "halfExpand", "PT2M");
        assertRound("PT90S", "minute", "halfTrunc", "PT1M");
        assertRound("PT90S", "minute", "halfEven", "PT2M");

        assertRound("-PT90S", "minute", "ceil", "-PT1M");
        assertRound("-PT90S", "minute", "floor", "-PT2M");
        assertRound("-PT90S", "minute", "expand", "-PT2M");
        assertRound("-PT90S", "minute", "trunc", "-PT1M");
        assertRound("-PT90S", "minute", "halfCeil", "-PT1M");
        assertRound("-PT90S", "minute", "halfFloor", "-PT2M");
        assertRound("-PT90S", "minute", "halfExpand", "-PT2M");
        assertRound("-PT90S", "minute", "halfTrunc", "-PT1M");
        assertRound("-PT90S", "minute", "halfEven", "-PT2M");

        assertRound("PT150S", "minute", "halfEven", "PT2M");
        assertRound("-PT150S", "minute", "halfEven", "-PT2M");
        assertRound("PT89.999S", "minute", "halfExpand", "PT1M");
        assertRound("-PT89.999S", "minute", "halfExpand", "-PT1M");
        assertRound("PT1H30M", "hour", "halfEven", "PT2H");
        assertRound("PT2H30M", "hour", "halfEven", "PT2H");
        assertRound("P1DT12H", "day", "halfEven", "P2D");
    });

    test("Duration.round matches Node Temporal increments and calendar cases", function () {
        function assertRoundOptions(durationString, options, expected, message) {
            assertEquals(
                Temporal.Duration.from(durationString).round(options).toString(),
                expected,
                message || durationString + " round options"
            );
        }

        assertRoundOptions("PT7M", { smallestUnit: "minute", roundingIncrement: 5 }, "PT5M", "PT7M to 5-minute increment");
        assertRoundOptions("PT8M", { smallestUnit: "minute", roundingIncrement: 5 }, "PT10M", "PT8M to 5-minute increment");
        assertRoundOptions("-PT7M", { smallestUnit: "minute", roundingIncrement: 5 }, "-PT5M", "-PT7M to 5-minute increment");
        assertRoundOptions("-PT8M", { smallestUnit: "minute", roundingIncrement: 5 }, "-PT10M", "-PT8M to 5-minute increment");
        assertRoundOptions("PT17S", { smallestUnit: "second", roundingIncrement: 10, roundingMode: "trunc" }, "PT10S", "PT17S trunc to 10-second increment");
        assertRoundOptions("PT17S", { smallestUnit: "second", roundingIncrement: 10, roundingMode: "ceil" }, "PT20S", "PT17S ceil to 10-second increment");
        assertRoundOptions("PT0.5S", { smallestUnit: "second" }, "PT1S", "PT0.5S to second");
        assertRoundOptions("-PT0.5S", { smallestUnit: "second" }, "-PT1S", "-PT0.5S to second");

        assertRoundOptions(
            "P1Y2DT12H",
            {
                largestUnit: "year",
                smallestUnit: "day",
                relativeTo: Temporal.PlainDateTime.from("2024-02-28T00:00:00")
            },
            "P1Y3D",
            "P1Y2DT12H calendar round to day"
        );
        assertRoundOptions(
            "P1M15D",
            {
                largestUnit: "month",
                smallestUnit: "day",
                relativeTo: Temporal.PlainDateTime.from("2024-01-31T00:00:00")
            },
            "P1M15D",
            "P1M15D calendar round to day"
        );
        assertRoundOptions(
            "P1M15D",
            {
                largestUnit: "month",
                smallestUnit: "week",
                relativeTo: Temporal.PlainDateTime.from("2024-01-31T00:00:00")
            },
            "P1M2W",
            "P1M15D calendar round to week"
        );
    });

    test("Duration.round matches Node Temporal option edge cases", function () {
        assertEquals(Temporal.Duration.from("PT1.234S").round("seconds").toString(), "PT1S", "plural string smallestUnit");
        assertEquals(Temporal.Duration.from("PT1.234S").round({ smallestUnit: "seconds" }).toString(), "PT1S", "plural object smallestUnit");
        assertEquals(
            Temporal.Duration.from("PT90M").round({ largestUnit: "hours", smallestUnit: "minutes" }).toString(),
            "PT1H30M",
            "plural largestUnit and smallestUnit"
        );
        assertEquals(
            Temporal.Duration.from("PT7M").round({ smallestUnit: "minute", roundingIncrement: "5" }).toString(),
            "PT5M",
            "numeric string roundingIncrement"
        );
        assertEquals(
            Temporal.Duration.from("PT90S").round({ smallestUnit: "minute", roundingMode: undefined }).toString(),
            "PT2M",
            "undefined roundingMode uses default"
        );
        assertEquals(
            Temporal.Duration.from("PT25H").round({ smallestUnit: "minute" }).toString(),
            "PT25H",
            "auto largestUnit preserves hours"
        );
        assertEquals(
            Temporal.Duration.from("PT61M").round({ smallestUnit: "second" }).toString(),
            "PT61M",
            "auto largestUnit preserves minutes"
        );
        assertEquals(
            Temporal.Duration.from("PT25H").round({ largestUnit: "day", smallestUnit: "minute" }).toString(),
            "P1DT1H",
            "explicit day largestUnit balances hours"
        );
        assertEquals(
            Temporal.Duration.from("-P1M15D").round({
                largestUnit: "month",
                smallestUnit: "week",
                relativeTo: "2024-03-31T00:00:00"
            }).toString(),
            "-P1M2W",
            "negative calendar round with relativeTo string"
        );
        assertEquals(
            Temporal.Duration.from("P45D").round({
                largestUnit: "month",
                smallestUnit: "day",
                relativeTo: "2024-01-31T00:00:00"
            }).toString(),
            "P1M16D",
            "month-end calendar balancing"
        );
    });

    test("Duration.round validation errors match Node Temporal", function () {
        assertThrowsWith(function () {
            Temporal.Duration.from("PT1S").round(undefined);
        }, "TypeError", "Temporal error: Must specify a roundTo parameter.", "undefined roundTo");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1S").round(null);
        }, "TypeError", "Temporal error: roundTo must be an object.", "null roundTo");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1S").round({});
        }, "RangeError", "Temporal error: smallestUnit and largestUnit cannot both be None.", "empty roundTo object");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1S").round({ smallestUnit: "banana" });
        }, "RangeError", "Value banana out of range for Temporal.Duration.prototype.round options property smallestUnit", "invalid smallestUnit");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1H").round({ largestUnit: "minute", smallestUnit: "hour" });
        }, "RangeError", "Temporal error: smallestUnit is larger than largestUnit.", "smallestUnit larger than largestUnit");

        assertThrowsWith(function () {
            Temporal.Duration.from("P1Y").round({ largestUnit: "year", smallestUnit: "day" });
        }, "RangeError", "Temporal error: largestUnit when rounding Duration was not the largest provided unit", "missing relativeTo for calendar round");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1M").round({ smallestUnit: "minute", roundingIncrement: 0 });
        }, "RangeError", "Temporal error: Integer out of range.", "zero roundingIncrement");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1M").round({ smallestUnit: "minute", roundingIncrement: 61 });
        }, "RangeError", "Temporal error: roundingIncrement exceeds maximum", "too large roundingIncrement");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT1H").round({ smallestUnit: "hour", roundingIncrement: 7 });
        }, "RangeError", "Temporal error: dividend is not divisible by roundingIncrement", "non-divisor roundingIncrement");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT7M").round({ smallestUnit: "minute", roundingIncrement: NaN });
        }, "RangeError", "Temporal error: Expected finite integer.", "NaN roundingIncrement");

        assertThrowsWith(function () {
            Temporal.Duration.from("PT90S").round({ smallestUnit: "minute", roundingMode: null });
        }, "RangeError", "Value null out of range for Temporal.Duration.prototype.round options property roundingMode", "null roundingMode");
    });

    test("PlainDateTime.from parses an ISO date-time", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

        assertEquals(dateTime.year, 2024, "year");
        assertEquals(dateTime.month, 2, "month");
        assertEquals(dateTime.day, 29, "day");
        assertEquals(dateTime.hour, 10, "hour");
        assertEquals(dateTime.minute, 20, "minute");
        assertEquals(dateTime.second, 30, "second");
        assertEquals(dateTime.millisecond, 123, "millisecond");
        assertEquals(dateTime.toString(), "2024-02-29T10:20:30.123", "toString");
    });

    test("PlainDateTime.add handles leap-day calendar addition", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-02-28T00:00:00");
        var result = dateTime.add(Temporal.Duration.from("P1D"));

        assertEquals(result.toString(), "2024-02-29T00:00:00", "2024 is a leap year");
    });

    test("PlainDateTime.from validates month/day combinations", function () {
        assertThrows(function () {
            Temporal.PlainDateTime.from("2024-02-31T00:00:00", { overflow: "reject" });
        }, "February 31 should be rejected");

        assertThrows(function () {
            Temporal.PlainDateTime.from("2023-02-29T00:00:00", { overflow: "reject" });
        }, "February 29 should be rejected in a non-leap year");

        assertThrows(function () {
            Temporal.PlainDateTime.from("2023-02-29T00:00:00");
        }, "Invalid ISO strings should be rejected like Node Temporal");

        assertEquals(
            Temporal.PlainDateTime.from({ year: 2023, month: 2, day: 29 }).toString(),
            "2023-02-28T00:00:00",
            "Default constrain should clamp invalid property bag day to the last valid day"
        );
    });

    test("PlainDateTime.subtract delegates through a valid add path", function () {
        var dateTime = Temporal.PlainDateTime.from("2024-03-01T00:00:00");
        var result = dateTime.subtract(Temporal.Duration.from("P1D"));

        assertEquals(result.toString(), "2024-02-29T00:00:00", "subtract should cross leap day correctly");
        assertEquals(dateTime.toString(), "2024-03-01T00:00:00", "subtract should not mutate the original");
    });

    writeLine("------------------------------------");
    writeLine("Passed:  " + results.passed);
    writeLine("Failed:  " + results.failed);
    writeLine("Skipped: " + results.skipped);

    if (results.failed > 0) {
        throw new Error("Temporal tests failed: " + results.failed);
    }
}());
