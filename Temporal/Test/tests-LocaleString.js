//@include "../../Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
//@include "../Lib/Temporal.Instant.js"
//@include "../Lib/Temporal.PlainTime.js"
//@include "../Lib/Temporal.PlainDate.js"
//@include "../Lib/Temporal.PlainDateTime.js"
//@include "../Lib/Temporal.PlainYearMonth.js"
//@include "../Lib/Temporal.PlainMonthDay.js"
//@include "../Lib/Temporal.LocaleDate.js"

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
        load("../Lib/Temporal.PlainTime.js");
        load("../Lib/Temporal.PlainDate.js");
        load("../Lib/Temporal.PlainDateTime.js");
        load("../Lib/Temporal.PlainYearMonth.js");
        load("../Lib/Temporal.PlainMonthDay.js");
        load("../Lib/Temporal.LocaleDate.js");
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

    function assert(condition, message) {
        if (!condition) fail(message || "Assertion failed");
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

    function pad(value, length) {
        var result = String(Math.abs(value));
        while (result.length < length) result = "0" + result;
        return result;
    }

    function expectedHostLocal(epochMilliseconds) {
        var date = new Date(epochMilliseconds);
        var year = date.getFullYear();
        var yearText = year >= 0 && year <= 9999 ? pad(year, 4) :
            (year < 0 ? "-" : "+") + pad(year, 6);
        var isoMinutes = -date.getTimezoneOffset();
        var offsetSign = isoMinutes < 0 ? "-" : "+";
        var offsetAbsolute = Math.abs(isoMinutes);
        var offsetHour = Math.floor(offsetAbsolute / 60);
        var offsetMinute = offsetAbsolute - offsetHour * 60;

        return yearText + "-" + pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2) +
            "T" + pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2) + ":" +
            pad(date.getSeconds(), 2) + "." + pad(date.getMilliseconds(), 3) +
            offsetSign + pad(offsetHour, 2) + ":" + pad(offsetMinute, 2);
    }

    function dateFromPlainDateTime(value) {
        var date = new Date(0);
        date.setHours(12, 0, 0, 0);
        date.setFullYear(value.year, value.month - 1, value.day);
        date.setHours(value.hour, value.minute, value.second, value.millisecond);
        return date;
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

    test("all seven supported specification objects expose toLocaleString", function () {
        assertEquals(typeof Temporal.Duration.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.Instant.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainDate.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainDateTime.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainMonthDay.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainTime.prototype.toLocaleString, "function");
        assertEquals(typeof Temporal.PlainYearMonth.prototype.toLocaleString, "function");
    });

    test("objects without a complete date-time keep their own ISO fields", function () {
        assertEquals(Temporal.Duration.from("P1DT2H").toLocaleString(), "P1DT2H");
        assertEquals(Temporal.PlainDate.from("2026-07-15").toLocaleString(), "2026-07-15");
        assertEquals(Temporal.PlainTime.from("12:34:56.123").toLocaleString(), "12:34:56.123");
        assertEquals(Temporal.PlainYearMonth.from("2026-07").toLocaleString(), "2026-07");
        assertEquals(Temporal.PlainMonthDay.from("07-15").toLocaleString(), "07-15");
    });

    test("partial Plain outputs do not invent an offset or missing fields", function () {
        assert(!/[+-]\d{2}:\d{2}$/.test(Temporal.PlainDate.from("2026-07-15").toLocaleString()));
        assert(!/[+-]\d{2}:\d{2}$/.test(Temporal.PlainTime.from("12:34:56.123").toLocaleString()));
        assertEquals(Temporal.PlainYearMonth.from("2026-07").toLocaleString().length, 7);
        assertEquals(Temporal.PlainMonthDay.from("07-15").toLocaleString().length, 5);
    });

    test("PlainDateTime is interpreted through host-local Date fields", function () {
        var value = Temporal.PlainDateTime.from("2026-07-15T12:34:56.123");
        var date = dateFromPlainDateTime(value);
        assertEquals(value.toLocaleString(), expectedHostLocal(date.getTime()));
    });

    test("PlainDateTime uses the offset at the represented winter and summer dates", function () {
        var winter = Temporal.PlainDateTime.from("2026-01-15T12:34:56.123");
        var summer = Temporal.PlainDateTime.from("2026-07-15T12:34:56.123");
        assertEquals(winter.toLocaleString(), expectedHostLocal(dateFromPlainDateTime(winter).getTime()));
        assertEquals(summer.toLocaleString(), expectedHostLocal(dateFromPlainDateTime(summer).getTime()));
    });

    test("DST gap normalization follows the host Date decision", function () {
        var value = Temporal.PlainDateTime.from("2026-03-29T02:30:00");
        var date = dateFromPlainDateTime(value);
        assertEquals(value.toLocaleString(), expectedHostLocal(date.getTime()));
    });

    test("DST overlap selection follows the host Date decision", function () {
        var value = Temporal.PlainDateTime.from("2026-10-25T02:30:00");
        var date = dateFromPlainDateTime(value);
        assertEquals(value.toLocaleString(), expectedHostLocal(date.getTime()));
    });

    test("PlainDateTime output always contains milliseconds and colon offset", function () {
        var output = Temporal.PlainDateTime.from("2026-01-15T12:34:56").toLocaleString();
        assert(/\.\d{3}[+-]\d{2}:\d{2}$/.test(output), "Unexpected output: " + output);
    });

    test("locale and options arguments are ignored on every supported object", function () {
        var values = [
            Temporal.Duration.from("P1D"),
            Temporal.Instant.from("2026-01-15T12:00:00Z"),
            Temporal.PlainDate.from("2026-01-15"),
            Temporal.PlainDateTime.from("2026-01-15T12:00:00"),
            Temporal.PlainMonthDay.from("01-15"),
            Temporal.PlainTime.from("12:00:00"),
            Temporal.PlainYearMonth.from("2026-01")
        ];
        var i;
        for (i = 0; i < values.length; i++) {
            assertEquals(
                values[i].toLocaleString("hu-HU", { dateStyle: "full" }),
                values[i].toLocaleString()
            );
        }
    });

    test("adapter methods reject incompatible receivers", function () {
        assertThrows(function () { Temporal.Instant.prototype.toLocaleString.call({ epochMilliseconds: 0 }); });
        assertThrows(function () { Temporal.PlainDateTime.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.PlainDate.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.PlainTime.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.PlainYearMonth.prototype.toLocaleString.call({}); });
        assertThrows(function () { Temporal.PlainMonthDay.prototype.toLocaleString.call({}); });
    });

    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);

    if (results.failed > 0 && typeof process !== "undefined") {
        process.exitCode = 1;
    }
}());
