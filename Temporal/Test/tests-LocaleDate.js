//@include "../../Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
//@include "../Lib/Temporal.Instant.js"
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

    test("adapter installs an own Instant.toLocaleString method", function () {
        assertEquals(
            Temporal.Instant.prototype.hasOwnProperty("toLocaleString"),
            true
        );
    });

    test("epoch formats from host-local numeric fields", function () {
        var instant = Temporal.Instant.fromEpochMilliseconds(0);
        assertEquals(instant.toLocaleString(), expectedHostLocal(0));
    });

    test("millisecond precision is always emitted with three digits", function () {
        var epoch = Temporal.Instant.from("2024-01-01T00:00:00.012Z").epochMilliseconds;
        assertEquals(Temporal.Instant.fromEpochMilliseconds(epoch).toLocaleString(), expectedHostLocal(epoch));
        if (!/\.\d{3}[+-]\d{2}:\d{2}$/.test(Temporal.Instant.fromEpochMilliseconds(epoch).toLocaleString())) {
            fail("Expected fixed three-digit milliseconds and numeric offset");
        }
    });

    test("winter and summer use the offset for the represented instant", function () {
        var winter = Temporal.Instant.from("2026-01-15T12:34:56.123Z");
        var summer = Temporal.Instant.from("2026-07-15T12:34:56.123Z");
        assertEquals(winter.toLocaleString(), expectedHostLocal(winter.epochMilliseconds));
        assertEquals(summer.toLocaleString(), expectedHostLocal(summer.epochMilliseconds));
    });

    test("pre-epoch values retain the correct local millisecond", function () {
        assertEquals(
            Temporal.Instant.fromEpochMilliseconds(-1).toLocaleString(),
            expectedHostLocal(-1)
        );
    });

    test("extended years are formatted numerically", function () {
        var positive = Temporal.Instant.from("+010000-01-01T00:00:00Z");
        var negative = Temporal.Instant.from("-000001-01-01T00:00:00Z");
        assertEquals(positive.toLocaleString(), expectedHostLocal(positive.epochMilliseconds));
        assertEquals(negative.toLocaleString(), expectedHostLocal(negative.epochMilliseconds));
    });

    test("Instant range endpoints use the epoch constructor path", function () {
        var minimum = Temporal.__MIN_INSTANT_EPOCH_MILLISECONDS__;
        var maximum = Temporal.__MAX_INSTANT_EPOCH_MILLISECONDS__;
        assertEquals(Temporal.Instant.fromEpochMilliseconds(minimum).toLocaleString(), expectedHostLocal(minimum));
        assertEquals(Temporal.Instant.fromEpochMilliseconds(maximum).toLocaleString(), expectedHostLocal(maximum));
    });

    test("formatting does not call Instant.toString or native ISO parsing", function () {
        var original = Temporal.Instant.prototype.toString;
        var instant = Temporal.Instant.fromEpochMilliseconds(0);
        try {
            Temporal.Instant.prototype.toString = function () {
                throw new Error("Instant.toString must not be used");
            };
            assertEquals(instant.toLocaleString(), expectedHostLocal(0));
        } finally {
            Temporal.Instant.prototype.toString = original;
        }
    });

    test("locale and options arguments are intentionally ignored", function () {
        var instant = Temporal.Instant.from("2026-07-15T12:34:56.123Z");
        assertEquals(
            instant.toLocaleString("hu-HU", { dateStyle: "full" }),
            instant.toLocaleString()
        );
    });

    test("detached calls reject incompatible receivers", function () {
        assertThrows(function () {
            Temporal.Instant.prototype.toLocaleString.call({ epochMilliseconds: 0 });
        });
    });

    writeLine("Passed: " + results.passed);
    writeLine("Failed: " + results.failed);

    if (results.failed > 0 && typeof process !== "undefined") {
        process.exitCode = 1;
    }
}());
