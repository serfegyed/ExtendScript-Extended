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

    writeLine("Temporal PlainTime ExtendScript polyfill tests");
    writeLine("----------------------------------------------");

    test("PlainTime constructor follows Node coercion and range rules", function () {
        assertEquals(Temporal.__plainTimeVersion__, 12, "PlainTime12 source should be loaded");
        assertNodeEquals(new Temporal.PlainTime(12, 34, 56, 789).toString(), "12:34:56.789", "new Temporal.PlainTime(12, 34, 56, 789).toString()");
        assertNodeEquals(new Temporal.PlainTime(1.9, 2.9, 3.9, 4.9).toString(), "01:02:03.004", "new Temporal.PlainTime(1.9, 2.9, 3.9, 4.9).toString()");
        assertNodeEquals(new Temporal.PlainTime(undefined, undefined, undefined, undefined).toString(), "00:00:00", "new Temporal.PlainTime(undefined, undefined, undefined, undefined).toString()");
        assertThrowsWith(function () { new Temporal.PlainTime(24); }, "RangeError", "Node: constructor rejects hour 24");
        assertThrowsWith(function () { Temporal.PlainTime(10); }, "TypeError", "Node: constructor requires new");
    });

    test("PlainTime.from handles strings, date-time strings, bags, and overflow like Node", function () {
        function InheritedTime() {}
        InheritedTime.prototype.hour = 8;

        assertNodeEquals(Temporal.PlainTime.from("08:05").toString(), "08:05:00", "Temporal.PlainTime.from('08:05').toString()");
        assertNodeEquals(Temporal.PlainTime.from("08").toString(), "08:00:00", "Temporal.PlainTime.from('08').toString()");
        assertNodeEquals(Temporal.PlainTime.from("T08:05").toString(), "08:05:00", "Temporal.PlainTime.from('T08:05').toString()");
        assertNodeEquals(Temporal.PlainTime.from("2024-02-29T10:20:30.123").toString(), "10:20:30.123", "Temporal.PlainTime.from('2024-02-29T10:20:30.123').toString()");
        assertNodeEquals(Temporal.PlainTime.from("2024-02-29t10:20:30.123").toString(), "10:20:30.123", "Temporal.PlainTime.from(lowercase date-time separator).toString()");
        assertNodeEquals(Temporal.PlainTime.from("2024-02-29 10:20:30.123").toString(), "10:20:30.123", "Temporal.PlainTime.from(space date-time separator).toString()");
        assertNodeEquals(Temporal.PlainTime.from("08:05:60.999").toString(), "08:05:59.999", "Temporal.PlainTime.from('08:05:60.999').toString()");
        assertNodeEquals(Temporal.PlainTime.from({ hour: "8", minute: "05", second: null, millisecond: false }).toString(), "08:05:00", "Temporal.PlainTime.from(coercible bag).toString()");
        assertNodeEquals(Temporal.PlainTime.from({ hour: 24, minute: 60, millisecond: 1000 }).toString(), "23:59:00.999", "Temporal.PlainTime.from(out-of-range bag).toString()");
        assertNodeEquals(Temporal.PlainTime.from(new InheritedTime()).toString(), "08:00:00", "Temporal.PlainTime.from(object with inherited hour).toString()");
        assertThrowsWith(function () { Temporal.PlainTime.from({ hour: 24 }, { overflow: "reject" }); }, "RangeError", "Node: reject overflow");
        assertThrowsWith(function () { Temporal.PlainTime.from({}); }, "TypeError", "Node: empty bag");
        assertThrowsWith(function () { Temporal.PlainTime.from("08:05Z"); }, "RangeError", "Node: UTC designator");
        assertThrowsWith(function () { Temporal.PlainTime.from("2023-02-29T10:00"); }, "RangeError", "Node: invalid date prefix");
    });

    test("compare, equals, toJSON, and valueOf match Node", function () {
        var time = Temporal.PlainTime.from("10:20:30.123");
        assertNodeEquals(Temporal.PlainTime.compare(time, "10:20:30.124"), -1, "Temporal.PlainTime.compare('10:20:30.123', '10:20:30.124')");
        assertNodeEquals(time.equals({ hour: 10, minute: 20, second: 30, millisecond: 123 }), true, "Temporal.PlainTime.from(input).equals(propertyBag)");
        assertNodeEquals(time.toJSON(), "10:20:30.123", "Temporal.PlainTime.from(input).toJSON()");
        assertNodeEquals(typeof time.toPlainDateTime, "undefined", "typeof Temporal.PlainTime.prototype.toPlainDateTime");
        assertThrowsWith(function () { time.valueOf(); }, "TypeError", "Node: PlainTime.valueOf always throws");
    });

    test("with replaces only supplied fields and preserves the receiver", function () {
        function InheritedTime() {}
        InheritedTime.prototype.hour = 8;

        var time = Temporal.PlainTime.from("10:20:30.123");
        assertNodeEquals(time.with({ minute: 5, millisecond: 7 }).toString(), "10:05:30.007", "Temporal.PlainTime.from(input).with({ minute: 5, millisecond: 7 }).toString()");
        assertNodeEquals(time.with({ hour: 24, minute: 60 }).toString(), "23:59:30.123", "Temporal.PlainTime.from(input).with({ hour: 24, minute: 60 }).toString()");
        assertNodeEquals(time.toString(), "10:20:30.123", "PlainTime.with does not mutate receiver");
        assertNodeEquals(time.with(new InheritedTime()).toString(), "08:20:30.123", "PlainTime.with reads inherited time fields");
        assertThrowsWith(function () { time.with({}); }, "TypeError", "Node: PlainTime.with empty bag");
        assertThrowsWith(function () { time.with({ hour: 24 }, { overflow: "reject" }); }, "RangeError", "Node: PlainTime.with reject overflow");
        assertThrowsWith(function () { time.with({ hour: 8, calendar: "iso8601" }); }, "TypeError", "Node: PlainTime.with rejects calendar");
        assertThrowsWith(function () { time.with({ hour: 8, timeZone: "UTC" }); }, "TypeError", "Node: PlainTime.with rejects timeZone");
    });

    test("add and subtract wrap within the ISO day like Node", function () {
        assertNodeEquals(Temporal.PlainTime.from("23:59:59.900").add({ milliseconds: 200 }).toString(), "00:00:00.1", "Temporal.PlainTime.from(input).add({ milliseconds: 200 }).toString()");
        assertNodeEquals(Temporal.PlainTime.from("12:00").add({ days: 1, hours: 2 }).toString(), "14:00:00", "Temporal.PlainTime.from('12:00').add({ days: 1, hours: 2 }).toString()");
        assertNodeEquals(Temporal.PlainTime.from("12:00").add({ months: 1 }).toString(), "12:00:00", "Temporal.PlainTime.from('12:00').add({ months: 1 }).toString()");
        assertNodeEquals(Temporal.PlainTime.from("00:00:00.100").subtract({ milliseconds: 200 }).toString(), "23:59:59.9", "Temporal.PlainTime.from(input).subtract({ milliseconds: 200 }).toString()");
    });

    test("until and since return Node-referenced millisecond durations", function () {
        var start = Temporal.PlainTime.from("10:20:30.123");
        var end = Temporal.PlainTime.from("12:22:33.456");
        var negative = Temporal.PlainTime.from("12:00").until("10:30");
        var fractionalOnlySeconds = Temporal.PlainTime.from("10:53:24.339").until("14:57:24.591");
        assertNodeEquals(start.until(end).toString(), "PT2H2M3.333S", "Temporal.PlainTime.from(start).until(end).toString()");
        assertNodeEquals(start.until(end, { largestUnit: "auto" }).toString(), "PT2H2M3.333S", "Temporal.PlainTime.from(start).until(end, { largestUnit: 'auto' }).toString()");
        assertNodeEquals(start.until(end, { largestUnit: "hours" }).toString(), "PT2H2M3.333S", "Temporal.PlainTime.from(start).until(end, { largestUnit: 'hours' }).toString()");
        assertNodeEquals(start.until(end, { smallestUnit: "seconds" }).toString(), "PT2H2M3S", "Temporal.PlainTime.from(start).until(end, { smallestUnit: 'seconds' }).toString()");
        assertNodeEquals(start.until(end, { largestUnit: "minute" }).toString(), "PT122M3.333S", "Temporal.PlainTime.from(start).until(end, { largestUnit: 'minute' }).toString()");
        assertNodeEquals(negative.hours, -1, "Temporal.PlainTime.from('12:00').until('10:30').hours");
        assertNodeEquals(negative.minutes, -30, "Temporal.PlainTime.from('12:00').until('10:30').minutes");
        assertNodeEquals(negative.sign, -1, "Temporal.PlainTime.from('12:00').until('10:30').sign");
        assertNodeEquals(negative.toString(), "-PT1H30M", "Temporal.PlainTime.from('12:00').until('10:30').toString()");
        assertNodeEquals(fractionalOnlySeconds.hours, 4, "PlainTime fractional-only difference hours");
        assertNodeEquals(fractionalOnlySeconds.minutes, 4, "PlainTime fractional-only difference minutes");
        assertNodeEquals(fractionalOnlySeconds.seconds, 0, "PlainTime fractional-only difference seconds");
        assertNodeEquals(fractionalOnlySeconds.milliseconds, 252, "PlainTime fractional-only difference milliseconds");
        assertNodeEquals(fractionalOnlySeconds.toString(), "PT4H4M", "PlainTime fractional-only difference toString()");
        assertNodeEquals(end.since(start).toString(), "PT2H2M3.333S", "Temporal.PlainTime.from(end).since(start).toString()");
        assertNodeEquals(end.since(start, { largestUnit: "auto" }).toString(), "PT2H2M3.333S", "Temporal.PlainTime.from(end).since(start, { largestUnit: 'auto' }).toString()");
    });

    test("until rounding and unit validation match Node", function () {
        assertNodeEquals(Temporal.PlainTime.from("10:20:30.123").until("12:22:33.789", { smallestUnit: "second", roundingMode: "halfExpand" }).toString(), "PT2H2M4S", "PlainTime.until second halfExpand");
        assertNodeEquals(Temporal.PlainTime.from("10:07").until("11:01", { smallestUnit: "minute", roundingIncrement: 15, roundingMode: "halfExpand" }).toString(), "PT1H", "PlainTime.until 15-minute halfExpand");
        assertThrowsWith(function () { Temporal.PlainTime.from("10:00").until("11:00", { largestUnit: "day" }); }, "RangeError", "Node: PlainTime.until date unit");
        assertThrowsWith(function () { Temporal.PlainTime.from("10:00").until("11:00", null); }, "TypeError", "Node: PlainTime.until null options");
    });

    test("round supports the millisecond time-unit subset like Node", function () {
        assertNodeEquals(Temporal.PlainTime.from("10:07:30").round({ smallestUnit: "minute", roundingIncrement: 15, roundingMode: "halfExpand" }).toString(), "10:15:00", "PlainTime.round 15-minute halfExpand");
        assertNodeEquals(Temporal.PlainTime.from("23:31").round("hour").toString(), "00:00:00", "Temporal.PlainTime.from('23:31').round('hour').toString()");
        assertNodeEquals(Temporal.PlainTime.from("10:07:30").round("minute").toString(), "10:08:00", "Temporal.PlainTime.from('10:07:30').round('minute').toString()");
        assertNodeEquals(Temporal.PlainTime.from("10:07:30").round("minutes").toString(), "10:08:00", "Temporal.PlainTime.from('10:07:30').round('minutes').toString()");
        assertNodeEquals(Temporal.PlainTime.from("23:54:01.476").round({ smallestUnit: "millisecond", roundingIncrement: 8, roundingMode: "halfEven" }).toString(), "23:54:01.48", "PlainTime.round 8-millisecond halfEven parent-unit alignment");
        assertThrowsWith(function () { Temporal.PlainTime.from("10:07").round({ smallestUnit: "minute", roundingIncrement: 17 }); }, "RangeError", "Node: invalid rounding increment");
        assertThrowsWith(function () { Temporal.PlainTime.from("10:07").round({ smallestUnit: "minute", roundingIncrement: 60 }); }, "RangeError", "Node: rounding increment cannot equal the unit radix");
        assertThrowsWith(function () { Temporal.PlainTime.from("10:07").round("day"); }, "RangeError", "Node: PlainTime.round day");
    });

    test("toString options round and format like Node within millisecond precision", function () {
        var time = Temporal.PlainTime.from("10:20:30.123");
        assertNodeEquals(time.toString({ smallestUnit: "minute" }), "10:20", "PlainTime.toString({ smallestUnit: 'minute' })");
        assertNodeEquals(time.toString({ smallestUnit: "seconds" }), "10:20:30", "PlainTime.toString({ smallestUnit: 'seconds' })");
        assertNodeEquals(time.toString({ fractionalSecondDigits: 2 }), "10:20:30.12", "PlainTime.toString({ fractionalSecondDigits: 2 })");
        assertNodeEquals(time.toString({ fractionalSecondDigits: 1.9 }), "10:20:30.1", "PlainTime.toString({ fractionalSecondDigits: 1.9 })");
        assertNodeEquals(time.toString({ smallestUnit: "second", fractionalSecondDigits: 2 }), "10:20:30", "PlainTime.toString smallestUnit takes formatting precedence");
        assertNodeEquals(time.toString({ smallestUnit: "millisecond", fractionalSecondDigits: 2 }), "10:20:30.123", "PlainTime.toString millisecond takes formatting precedence");
        assertNodeEquals(Temporal.PlainTime.from("23:59:59.999").toString({ smallestUnit: "second", roundingMode: "halfExpand" }), "00:00:00", "PlainTime.toString second rollover");
    });

    test("PlainTime integrates with PlainDate and PlainDateTime", function () {
        var time = Temporal.PlainTime.from("10:20:30.123");
        var dateTime = Temporal.PlainDate.from("2024-02-29").toPlainDateTime(time);
        assert(dateTime instanceof Temporal.PlainDateTime, "toPlainDateTime should return PlainDateTime");
        assertNodeEquals(dateTime.toString(), "2024-02-29T10:20:30.123", "Temporal.PlainDate.from('2024-02-29').toPlainDateTime(Temporal.PlainTime.from('10:20:30.123')).toString()");
        assertNodeEquals(dateTime.toPlainTime().toString(), "10:20:30.123", "PlainDateTime.toPlainTime round trip");
        assertNodeEquals(Temporal.PlainDate.from("2024-02-29").toPlainDateTime("08:05").toString(), "2024-02-29T08:05:00", "Temporal.PlainDate.from(date).toPlainDateTime('08:05').toString()");
        assertNodeEquals(dateTime.withPlainTime("23:59:58.987").toString(), "2024-02-29T23:59:58.987", "PlainDateTime.withPlainTime(input).toString()");
    });

    writeLine("");
    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);
    writeLine("Skipped: " + results.skipped);

    if (results.failed > 0 && typeof process !== "undefined") {
        process.exitCode = 1;
    }
}());
