//@include "../../Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
//@include "../Lib/Temporal.Instant.js"

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
    }());
}

(function () {
    var results = { passed: 0, failed: 0, skipped: 0 };

    function writeLine(message) {
        if (typeof console !== "undefined" && console.log) console.log(message);
        else if (typeof $ !== "undefined" && $.writeln) $.writeln(message);
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
                "\n  expected: " + expected + "\n  actual:   " + actual);
        }
    }

    function assertNodeEquals(actual, expected, nodeReference) {
        assertEquals(actual, expected, "Node reference: " + nodeReference);
    }

    function assertThrowsWith(fn, expectedName, nodeReference) {
        try {
            fn();
        } catch (error) {
            if (typeof process !== "undefined" && process.versions && process.versions.node) {
                assertEquals(error.name, expectedName, "Node reference: " + nodeReference);
            } else if (expectedName === "TypeError") {
                assert(error instanceof TypeError, "Node reference: " + nodeReference);
            } else if (expectedName === "RangeError") {
                assert(error instanceof RangeError, "Node reference: " + nodeReference);
            } else {
                assertEquals(error.name, expectedName, "Node reference: " + nodeReference);
            }
            return;
        }
        fail("Expected " + expectedName + ". Node reference: " + nodeReference);
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

    writeLine("Temporal Instant ExtendScript polyfill tests");
    writeLine("-------------------------------------------");

    test("Instant exposes the selected millisecond surface", function () {
        assert(typeof Temporal.Instant === "function", "Temporal.Instant should exist");
        assert(typeof Temporal.Instant.from === "function", "Instant.from should exist");
        assert(typeof Temporal.Instant.fromEpochMilliseconds === "function", "fromEpochMilliseconds should exist");
        assert(typeof Temporal.Instant.compare === "function", "Instant.compare should exist");
        assertEquals(typeof Temporal.Instant.fromEpochNanoseconds, "undefined", "BigInt factory is intentionally excluded");
        assertEquals(typeof Temporal.Instant.prototype.epochNanoseconds, "undefined", "BigInt property is intentionally excluded");
        assertEquals(typeof Temporal.Instant.prototype.toZonedDateTimeISO, "undefined", "timezone API is intentionally excluded");

        assertNodeEquals(new Temporal.Instant(0).toString(), "1970-01-01T00:00:00Z", "Node equivalent: new Temporal.Instant(0n)");
        assertNodeEquals(new Temporal.Instant(1).toString(), "1970-01-01T00:00:00.001Z", "project millisecond constructor; Node factory equivalent: fromEpochMilliseconds(1)");
        assertNodeEquals(new Temporal.Instant(-1).toString(), "1969-12-31T23:59:59.999Z", "project millisecond constructor; Node factory equivalent: fromEpochMilliseconds(-1)");
        assertNodeEquals(new Temporal.Instant("12").epochMilliseconds, 12, "project millisecond constructor coercion; Node BigInt constructor accepts '12'");
        assertThrowsWith(function () { Temporal.Instant(0); }, "TypeError", "Node: Temporal.Instant constructor called without new");
        assertThrowsWith(function () { new Temporal.Instant(1.9); }, "RangeError", "project millisecond constructor follows Node fromEpochMilliseconds integer validation");
    });

    test("fromEpochMilliseconds matches Node coercion, integer, and boundary behavior", function () {
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds(0).toString(), "1970-01-01T00:00:00Z", "fromEpochMilliseconds(0)");
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds(1).toString(), "1970-01-01T00:00:00.001Z", "fromEpochMilliseconds(1)");
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds(-1).toString(), "1969-12-31T23:59:59.999Z", "fromEpochMilliseconds(-1)");
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds("12").epochMilliseconds, 12, "fromEpochMilliseconds('12').epochMilliseconds");
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds(null).epochMilliseconds, 0, "fromEpochMilliseconds(null).epochMilliseconds");
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds(8640000000000000).toString(), "+275760-09-13T00:00:00Z", "maximum Instant boundary");
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds(-8640000000000000).toString(), "-271821-04-20T00:00:00Z", "minimum Instant boundary");

        assertThrowsWith(function () { Temporal.Instant.fromEpochMilliseconds(1.9); }, "RangeError", "Node: fractional epoch milliseconds");
        assertThrowsWith(function () { Temporal.Instant.fromEpochMilliseconds(-1.9); }, "RangeError", "Node: negative fractional epoch milliseconds");
        assertThrowsWith(function () { Temporal.Instant.fromEpochMilliseconds(undefined); }, "RangeError", "Node: undefined epoch milliseconds");
        assertThrowsWith(function () { Temporal.Instant.fromEpochMilliseconds(NaN); }, "RangeError", "Node: NaN epoch milliseconds");
        assertThrowsWith(function () { Temporal.Instant.fromEpochMilliseconds(Infinity); }, "RangeError", "Node: infinite epoch milliseconds");
        assertThrowsWith(function () { Temporal.Instant.fromEpochMilliseconds(8640000000000001); }, "RangeError", "Node: above maximum Instant boundary");
        assertThrowsWith(function () { Temporal.Instant.fromEpochMilliseconds(-8640000000000001); }, "RangeError", "Node: below minimum Instant boundary");
    });

    test("from parses UTC and numeric offsets like Node", function () {
        assertNodeEquals(Temporal.Instant.from("1970-01-01T00:00:00Z").epochMilliseconds, 0, "Instant.from UTC epoch");
        assertNodeEquals(Temporal.Instant.from("1970-01-01T01:30:00+01:30").epochMilliseconds, 0, "positive offset normalization");
        assertNodeEquals(Temporal.Instant.from("1970-01-01T00:00:00-01:00").epochMilliseconds, 3600000, "negative offset normalization");
        assertNodeEquals(Temporal.Instant.from("1970-01-01T00:00+0130").epochMilliseconds, -5400000, "compact positive offset");
        assertNodeEquals(Temporal.Instant.from("1970-01-01T00:00+01").epochMilliseconds, -3600000, "hour-only positive offset");
        assertNodeEquals(Temporal.Instant.from("1970-01-01 00:00Z").epochMilliseconds, 0, "space date-time separator");
        assertNodeEquals(Temporal.Instant.from("1970-01-01t00:00z").epochMilliseconds, 0, "lowercase date-time markers");
        assertNodeEquals(Temporal.Instant.from("2024-01-01T00:00+01:30[Europe/Budapest]").epochMilliseconds, 1704061800000, "bracketed timezone name with numeric offset");
    });

    test("from handles extended years, pre-epoch values, and leap seconds", function () {
        assertNodeEquals(Temporal.Instant.from("+010000-01-01T00:00Z").toString(), "+010000-01-01T00:00:00Z", "extended positive ISO year");
        assertNodeEquals(Temporal.Instant.from("-000001-01-01T00:00Z").toString(), "-000001-01-01T00:00:00Z", "extended negative ISO year");
        assertNodeEquals(Temporal.Instant.from("1969-12-31T23:59:59.999Z").epochMilliseconds, -1, "pre-epoch millisecond");
        assertNodeEquals(Temporal.Instant.from("2016-12-31T23:59:60Z").toString(), "2016-12-31T23:59:59Z", "leap second clamps to 59");
    });

    test("sub-millisecond strings reduce to Node epochMilliseconds", function () {
        var positive = Temporal.Instant.from("1970-01-01T00:00:00.000999999Z");
        var negative = Temporal.Instant.from("1969-12-31T23:59:59.999999999Z");
        var modern = Temporal.Instant.from("2024-02-29T12:34:56.123456789Z");

        assertNodeEquals(positive.epochMilliseconds, 0, "Node epochMilliseconds for positive sub-millisecond Instant");
        assertNodeEquals(negative.epochMilliseconds, -1, "Node epochMilliseconds for pre-epoch sub-millisecond Instant");
        assertNodeEquals(modern.epochMilliseconds, 1709210096123, "Node epochMilliseconds for 9-digit fraction");
        assertEquals(positive.toString(), "1970-01-01T00:00:00Z", "project output is normalized to millisecond precision");
        assertEquals(negative.toString(), "1969-12-31T23:59:59.999Z", "negative project output is normalized to millisecond precision");
        assertEquals(modern.toString(), "2024-02-29T12:34:56.123Z", "9-digit input is normalized to millisecond precision");
    });

    test("from rejects missing offsets and invalid ISO values like Node", function () {
        assertThrowsWith(function () { Temporal.Instant.from("2024-02-29T12:34:56"); }, "RangeError", "Node: Instant string without offset");
        assertThrowsWith(function () { Temporal.Instant.from("2024-02-29"); }, "RangeError", "Node: date-only Instant string");
        assertThrowsWith(function () { Temporal.Instant.from("2024-02-30T00:00Z"); }, "RangeError", "Node: invalid calendar date");
        assertThrowsWith(function () { Temporal.Instant.from("2024-01-01T24:00Z"); }, "RangeError", "Node: invalid hour");
        assertThrowsWith(function () { Temporal.Instant.from("1970-01-01T00:00+24:00"); }, "RangeError", "Node: invalid offset hour");
        assertThrowsWith(function () { Temporal.Instant.from("1970-01-01T00:00+01:60"); }, "RangeError", "Node: invalid offset minute");
        assertThrowsWith(function () { Temporal.Instant.from(null); }, "TypeError", "Node: Instant.from(null)");
        assertThrowsWith(function () { Temporal.Instant.from(1); }, "TypeError", "Node: Instant.from(number)");
    });

    test("from copies Instant instances and compare matches Node", function () {
        var original = Temporal.Instant.fromEpochMilliseconds(1);
        var copy = Temporal.Instant.from(original);

        assertNodeEquals(copy === original, false, "Instant.from(instance) returns a distinct Instant");
        assertNodeEquals(Temporal.Instant.compare("1970-01-01T00:00Z", original), -1, "compare earlier and later Instant");
        assertNodeEquals(Temporal.Instant.compare(original, "1970-01-01T00:00Z"), 1, "compare later and earlier Instant");
        assertNodeEquals(Temporal.Instant.compare(original, copy), 0, "compare equal Instants");
    });

    test("add and subtract support fixed time units only", function () {
        var base = Temporal.Instant.from("2024-01-01T00:00:00.123Z");

        assertNodeEquals(base.add({ hours: 1 }).toString(), "2024-01-01T01:00:00.123Z", "Instant.add({ hours: 1 })");
        assertNodeEquals(base.add({ minutes: -1 }).toString(), "2023-12-31T23:59:00.123Z", "Instant.add negative Duration");
        assertNodeEquals(base.add({ seconds: 2, milliseconds: 3 }).toString(), "2024-01-01T00:00:02.126Z", "Instant.add seconds and milliseconds");
        assertNodeEquals(base.subtract("PT1.001S").toString(), "2023-12-31T23:59:59.122Z", "Instant.subtract ISO Duration");

        assertThrowsWith(function () { base.add({ days: 1 }); }, "RangeError", "Node: Instant.add rejects days");
        assertThrowsWith(function () { base.add({ weeks: 1 }); }, "RangeError", "Node: Instant.add rejects weeks");
        assertThrowsWith(function () { base.add({ months: 1 }); }, "RangeError", "Node: Instant.add rejects months");
        assertThrowsWith(function () { base.add({ years: 1 }); }, "RangeError", "Node: Instant.add rejects years");
        assertThrowsWith(function () { Temporal.Instant.fromEpochMilliseconds(8640000000000000).add({ milliseconds: 1 }); }, "RangeError", "Node: add overflow");
    });

    test("until and since balance fixed differences like Node", function () {
        var start = Temporal.Instant.fromEpochMilliseconds(0);
        var end = Temporal.Instant.fromEpochMilliseconds(90061001);

        assertNodeEquals(start.until(end).toString(), "PT90061.001S", "Instant.until default units at millisecond precision");
        assertNodeEquals(start.until(end, { largestUnit: "hour" }).toString(), "PT25H1M1.001S", "Instant.until largestUnit hour");
        assertNodeEquals(start.until(end, { largestUnit: "minute" }).toString(), "PT1501M1.001S", "Instant.until largestUnit minute");
        assertNodeEquals(end.since(start, { largestUnit: "hour" }).toString(), "PT25H1M1.001S", "Instant.since positive difference");
        assertNodeEquals(start.since(end, { largestUnit: "hour" }).toString(), "-PT25H1M1.001S", "Instant.since negative difference");
        assertThrowsWith(function () { start.until(end, { largestUnit: "day" }); }, "RangeError", "Node: Instant.until rejects day largestUnit");
        assertThrowsWith(function () { start.until(end, null); }, "TypeError", "Node: Instant.until rejects null options");
    });

    test("until rounds positive and negative differences like Node", function () {
        var start = Temporal.Instant.fromEpochMilliseconds(0);
        var end = Temporal.Instant.fromEpochMilliseconds(90061001);

        assertNodeEquals(start.until(end, { smallestUnit: "second", roundingMode: "halfExpand" }).toString(), "PT90061S", "positive halfExpand difference");
        assertNodeEquals(start.until(end, { smallestUnit: "second", roundingIncrement: 30, roundingMode: "ceil" }).toString(), "PT90090S", "30-second ceil difference");
        assertNodeEquals(end.until(start, { largestUnit: "hour", smallestUnit: "second", roundingMode: "ceil" }).toString(), "-PT25H1M1S", "negative ceil difference");
        assertNodeEquals(end.until(start, { largestUnit: "hour", smallestUnit: "second", roundingMode: "floor" }).toString(), "-PT25H1M2S", "negative floor difference");
        assertNodeEquals(end.until(start, { largestUnit: "hour", smallestUnit: "second", roundingMode: "halfEven" }).toString(), "-PT25H1M1S", "negative halfEven difference");
        assertThrowsWith(function () { start.until(end, { smallestUnit: "second", roundingIncrement: 60 }); }, "RangeError", "Node: difference increment cannot equal radix");
        assertThrowsWith(function () { start.until(end, { smallestUnit: "millisecond", roundingIncrement: 3 }); }, "RangeError", "Node: difference increment must divide radix");
    });

    test("round supports every rounding mode for negative epoch values", function () {
        var instant = Temporal.Instant.fromEpochMilliseconds(-1500);

        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "ceil" }).epochMilliseconds, -1000, "negative Instant round ceil");
        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "floor" }).epochMilliseconds, -2000, "negative Instant round floor");
        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "expand" }).epochMilliseconds, -1000, "negative Instant round expand");
        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "trunc" }).epochMilliseconds, -2000, "negative Instant round trunc");
        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "halfCeil" }).epochMilliseconds, -1000, "negative Instant round halfCeil");
        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "halfFloor" }).epochMilliseconds, -2000, "negative Instant round halfFloor");
        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "halfExpand" }).epochMilliseconds, -1000, "negative Instant round halfExpand");
        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "halfTrunc" }).epochMilliseconds, -2000, "negative Instant round halfTrunc");
        assertNodeEquals(instant.round({ smallestUnit: "second", roundingMode: "halfEven" }).epochMilliseconds, -2000, "negative Instant round halfEven");
    });

    test("round validates units and increments like Node", function () {
        var instant = Temporal.Instant.fromEpochMilliseconds(1500);

        assertNodeEquals(instant.round("hour").epochMilliseconds, 0, "Instant.round('hour')");
        assertNodeEquals(instant.round("minute").epochMilliseconds, 0, "Instant.round('minute')");
        assertNodeEquals(instant.round("second").epochMilliseconds, 2000, "Instant.round('second')");
        assertNodeEquals(instant.round({ smallestUnit: "hour", roundingIncrement: 24 }).epochMilliseconds, 0, "24-hour Instant rounding increment");
        assertNodeEquals(instant.round({ smallestUnit: "millisecond", roundingIncrement: 1000 }).epochMilliseconds, 2000, "1000-millisecond Instant rounding increment");
        assertThrowsWith(function () { instant.round({ smallestUnit: "hour", roundingIncrement: 15 }); }, "RangeError", "Node: increment must divide day radix");
        assertThrowsWith(function () { instant.round({ smallestUnit: "hour", roundingIncrement: 25 }); }, "RangeError", "Node: increment exceeds maximum");
        assertThrowsWith(function () { instant.round("day"); }, "RangeError", "Node: Instant.round rejects day");
        assertThrowsWith(function () { instant.round(); }, "TypeError", "Node: Instant.round requires argument");
        assertThrowsWith(function () { instant.round(null); }, "TypeError", "Node: Instant.round rejects null");
    });

    test("toString formats UTC and rounds like Node within project precision", function () {
        var instant = Temporal.Instant.from("2024-01-01T00:00:00.123Z");

        assertNodeEquals(instant.toString(), "2024-01-01T00:00:00.123Z", "Instant.toString()");
        assertNodeEquals(instant.toString({}), "2024-01-01T00:00:00.123Z", "Instant.toString({})");
        assertNodeEquals(instant.toString({ fractionalSecondDigits: 0 }), "2024-01-01T00:00:00Z", "fractionalSecondDigits 0");
        assertNodeEquals(instant.toString({ fractionalSecondDigits: 1 }), "2024-01-01T00:00:00.1Z", "fractionalSecondDigits 1");
        assertNodeEquals(instant.toString({ fractionalSecondDigits: 2 }), "2024-01-01T00:00:00.12Z", "fractionalSecondDigits 2");
        assertNodeEquals(instant.toString({ fractionalSecondDigits: 3 }), "2024-01-01T00:00:00.123Z", "fractionalSecondDigits 3");
        assertNodeEquals(instant.toString({ smallestUnit: "minute" }), "2024-01-01T00:00Z", "toString smallestUnit minute");
        assertNodeEquals(instant.toString({ smallestUnit: "second" }), "2024-01-01T00:00:00Z", "toString smallestUnit second");
        assertNodeEquals(instant.toString({ smallestUnit: "millisecond" }), "2024-01-01T00:00:00.123Z", "toString smallestUnit millisecond");
        assertNodeEquals(instant.toString({ roundingMode: "ceil", fractionalSecondDigits: 0 }), "2024-01-01T00:00:01Z", "toString ceil to second");
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds(-1).toString(), "1969-12-31T23:59:59.999Z", "pre-epoch UTC formatting");
        assertNodeEquals(Temporal.Instant.fromEpochMilliseconds(8640000000000000).toString(), "+275760-09-13T00:00:00Z", "maximum extended-year formatting");
    });

    test("equals, JSON, unsupported locale formatting, and valueOf follow the project surface", function () {
        var instant = Temporal.Instant.from("2024-01-01T00:00:00.123Z");

        assertNodeEquals(instant.equals("2024-01-01T00:00:00.123Z"), true, "Instant.equals equal string");
        assertNodeEquals(instant.equals("2024-01-01T00:00:00.124Z"), false, "Instant.equals unequal string");
        assertNodeEquals(instant.toJSON(), "2024-01-01T00:00:00.123Z", "Instant.toJSON()");
        assertEquals(
            Temporal.Instant.prototype.hasOwnProperty("toLocaleString"),
            false,
            "Intl- and time-zone-dependent Instant.toLocaleString stays unsupported"
        );
        assertEquals(
            instant.toLocaleString,
            Object.prototype.toLocaleString,
            "Instant inherits only Object.prototype.toLocaleString"
        );
        assertThrowsWith(function () { instant.valueOf(); }, "TypeError", "Node: Instant.valueOf always throws");
    });

    writeLine("");
    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);
    writeLine("Skipped: " + results.skipped);

    if (results.failed > 0 && typeof process !== "undefined") process.exitCode = 1;
}());
