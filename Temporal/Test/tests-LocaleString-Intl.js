//@include "../../Tools/Console/console.js"
//@include "../../Intl/Intl-core.js"
//@include "../../Intl/Intl.DateTimeFormat.js"
//@include "../../Intl/Intl.DurationFormat.js"
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
        var intlRoot = path.join(__dirname, "../../Intl");

        function load(relativePath) {
            (0, eval)(fs.readFileSync(path.join(__dirname, relativePath), "utf8"));
        }

        function loadIntl(fileName) {
            (0, eval)(fs.readFileSync(path.join(intlRoot, fileName), "utf8"));
        }

        loadIntl("Intl-core.js");
        loadIntl("Intl.DateTimeFormat.js");
        loadIntl("Intl.DurationFormat.js");
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

    function assertNotEquals(actual, expected, message) {
        if (actual === expected) {
            fail((message || "Values should differ") +
                "\n  value: " + actual);
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

    function defaultTimeOptions(value) {
        return {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: value.millisecond === 0 ? undefined : 3
        };
    }

    function defaultDateTimeOptions(value) {
        var options = defaultTimeOptions(value);
        options.year = "numeric";
        options.month = "2-digit";
        options.day = "2-digit";
        return options;
    }

    test("Temporal core detects the loaded local Intl subset", function () {
        assertEquals(Temporal.__hasIntlDateTimeFormat__(), true);
        assertEquals(Temporal.__hasIntlDateTimeFormatToParts__(), true);
        assertEquals(Temporal.__hasIntlDurationFormat__(), true);
    });

    test("Duration delegates to Intl.DurationFormat when the local Intl subset is loaded", function () {
        var duration = Temporal.Duration.from("P1DT2H3M");
        var expected = new Intl.DurationFormat("hu-HU").format(duration);

        assertEquals(duration.toLocaleString("hu-HU"), expected);
        assertNotEquals(duration.toLocaleString("hu-HU"), duration.toString());
    });

    test("PlainDate delegates to Intl.DateTimeFormat", function () {
        var date = Temporal.PlainDate.from("2026-07-15");
        var expected = new Intl.DateTimeFormat("hu-HU").format(date);

        assertEquals(date.toLocaleString("hu-HU"), expected);
        assertEquals(date.toLocaleString("hu-HU"), "2026. 07. 15.");
    });

    test("PlainTime delegates to Intl.DateTimeFormat with time defaults", function () {
        var time = Temporal.PlainTime.from("12:34:56.123");
        var expected = new Intl.DateTimeFormat("hu-HU", defaultTimeOptions(time)).format(time);

        assertEquals(time.toLocaleString("hu-HU"), expected);
        assertEquals(time.toLocaleString("hu-HU"), "12:34:56,123");
    });

    test("PlainDateTime delegates to Intl.DateTimeFormat with date-time defaults", function () {
        var dateTime = Temporal.PlainDateTime.from("2026-07-15T12:34:56.123");
        var expected = new Intl.DateTimeFormat("hu-HU", defaultDateTimeOptions(dateTime)).format(dateTime);

        assertEquals(dateTime.toLocaleString("hu-HU"), expected);
        assertEquals(dateTime.toLocaleString("hu-HU"), "2026. 07. 15. 12:34:56,123");
    });

    test("Instant delegates to Intl.DateTimeFormat through host-local Date projection", function () {
        var instant = Temporal.Instant.from("2026-07-15T12:34:56.123Z");
        var formatter = new Intl.DateTimeFormat("hu-HU", defaultDateTimeOptions({ millisecond: 123 }));
        var expected = formatter.format(instant.epochMilliseconds);

        assertEquals(instant.toLocaleString("hu-HU"), expected);
    });

    test("explicit DateTimeFormat options are passed through", function () {
        var date = Temporal.PlainDate.from("2026-07-15");
        var options = { year: "2-digit", month: "long", day: "2-digit" };

        assertEquals(
            date.toLocaleString("de-DE", options),
            new Intl.DateTimeFormat("de-DE", options).format(date)
        );
    });

    test("PlainYearMonth and PlainMonthDay use DateTimeFormat formatToParts for partial dates", function () {
        assertEquals(Temporal.PlainYearMonth.from("2026-07").toLocaleString("hu-HU"), "2026. 07.");
        assertEquals(Temporal.PlainMonthDay.from("07-15").toLocaleString("hu-HU"), "07. 15.");
        assertEquals(Temporal.PlainYearMonth.from("2026-07").toLocaleString("en-US"), "07/2026");
        assertEquals(Temporal.PlainMonthDay.from("07-15").toLocaleString("en-US"), "07/15");
    });

    test("Intl option validation errors are not swallowed", function () {
        assertThrows(function () {
            Temporal.PlainDate.from("2026-07-15").toLocaleString("hu-HU", { timeZone: "UTC" });
        });
        assertThrows(function () {
            Temporal.Duration.from("PT1H").toLocaleString("hu-HU", { style: "full" });
        });
    });

    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);

    if (results.failed > 0 && typeof process !== "undefined") {
        process.exitCode = 1;
    }
}());
