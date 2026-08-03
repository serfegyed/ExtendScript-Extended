/*
 * Intl.DurationFormat subset tests for ESTK and Node.js.
 */
//@include "../../Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.DurationFormat.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;
var nodeIntl;

if (isNodeRuntime) {
    nodeIntl = Intl;
    Intl = undefined;

    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.DurationFormat.js"), "utf8"));
    }());
}

(function () {
    var passed = 0;
    var failed = 0;
    var NNBSP = "\u202F";
    var NBSP = "\u00A0";

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
            if (isNodeRuntime) {
                assertEquals(error.name, expectedName, message || "Unexpected error name");
            }
            return;
        }
        fail(message || "Expected function to throw");
    }

    function test(name, fn) {
        try {
            fn();
            passed++;
            writeLine("[PASS] " + name);
        } catch (error) {
            failed++;
            writeLine("[FAIL] " + name);
            writeLine("       " + error);
        }
    }

    writeLine("Intl.DurationFormat subset tests");
    writeLine("--------------------------------");

    test("constructor works with and without new", function () {
        var withNew = new Intl.DurationFormat("de-DE");
        var withoutNew = Intl.DurationFormat("de-DE");

        assert(withNew instanceof Intl.DurationFormat, "new should create DurationFormat");
        assert(withoutNew instanceof Intl.DurationFormat, "call should create DurationFormat");
        assertEquals(withNew.format({ seconds: 1 }), "1 Sek.", "new formatter output");
        assertEquals(withoutNew.format({ seconds: 1 }), "1 Sek.", "called formatter output");
    });

    test("supportedLocalesOf reports implemented locales", function () {
        assertEquals(typeof Intl.DurationFormat.supportedLocalesOf, "function", "static method exists");
        assertEquals(Intl.DurationFormat.supportedLocalesOf(["hu-hu", "banana", "en-UK", "hu-HU"], { localeMatcher: "lookup" }).join("|"), "hu-HU|en-GB", "filters supported locales");
        assertEquals(Intl.DurationFormat.supportedLocalesOf("fr-fr", { localeMatcher: "best fit" }).join("|"), "fr-FR", "string locale");
        assertEquals(Intl.DurationFormat.supportedLocalesOf(undefined).join("|"), "", "undefined locales");

        assertThrowsWith(function () {
            Intl.DurationFormat.supportedLocalesOf(["en-US"], { localeMatcher: "bad" });
        }, "RangeError", "unsupported localeMatcher");
    });

    test("short style formats supported locales", function () {
        var value = { years: 1, months: 2, weeks: 0, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 0 };

        assertEquals(new Intl.DurationFormat("en-US", { style: "short" }).format(value), "1 yr, 2 mths, 3 days, 4 hr, 5 min, 6 sec", "en-US short");
        assertEquals(new Intl.DurationFormat("en-GB", { style: "short" }).format(value), "1 yr, 2 mths, 3 days, 4 hrs, 5 mins, 6 secs", "en-GB short");
        assertEquals(new Intl.DurationFormat("de-DE", { style: "short" }).format(value), "1 J, 2 Mon., 3 Tg., 4 Std., 5 Min. und 6 Sek.", "de-DE short");
        assertEquals(new Intl.DurationFormat("fr-FR", { style: "short" }).format(value), "1" + NBSP + "an, 2" + NNBSP + "m., 3" + NNBSP + "j, 4" + NNBSP + "h, 5" + NBSP + "min et 6" + NNBSP + "s", "fr-FR short");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "short" }).format(value), "1 \u00E9v, 2 h\u00F3nap, 3 nap, 4 \u00F3, 5 p \u00E9s 6 mp", "hu-HU short");
    });

    test("long style formats supported locales", function () {
        var value = { years: 1, months: 2, weeks: 0, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 0 };

        assertEquals(new Intl.DurationFormat("en-US", { style: "long" }).format(value), "1 year, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds", "en-US long");
        assertEquals(new Intl.DurationFormat("en-GB", { style: "long" }).format(value), "1 year, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds", "en-GB long");
        assertEquals(new Intl.DurationFormat("de-DE", { style: "long" }).format(value), "1 Jahr, 2 Monate, 3 Tage, 4 Stunden, 5 Minuten und 6 Sekunden", "de-DE long");
        assertEquals(new Intl.DurationFormat("fr-FR", { style: "long" }).format(value), "1" + NBSP + "an, 2" + NBSP + "mois, 3" + NBSP + "jours, 4" + NBSP + "heures, 5 minutes et 6" + NBSP + "secondes", "fr-FR long");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "long" }).format(value), "1 \u00E9v, 2 h\u00F3nap, 3 nap, 4 \u00F3ra, 5 perc \u00E9s 6 m\u00E1sodperc", "hu-HU long");
    });

    test("digital style formats clock output", function () {
        var full = { years: 1, months: 2, weeks: 0, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 0 };
        var withMilliseconds = { hours: 4, minutes: 5, seconds: 6, milliseconds: 789 };

        assertEquals(new Intl.DurationFormat("en-US", { style: "digital" }).format(full), "1 yr, 2 mths, 3 days, 4:05:06", "en-US digital full");
        assertEquals(new Intl.DurationFormat("en-GB", { style: "digital" }).format({ minutes: 5, seconds: 6 }), "0:05:06", "en-GB digital minute second");
        assertEquals(new Intl.DurationFormat("de-DE", { style: "digital" }).format(withMilliseconds), "4:05:06,789", "de-DE digital milliseconds");
        assertEquals(new Intl.DurationFormat("fr-FR", { style: "digital" }).format(full), "1" + NBSP + "an, 2" + NNBSP + "m., 3" + NNBSP + "j et 4:05:06", "fr-FR digital full");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "digital" }).format(full), "1 \u00E9v, 2 h\u00F3nap, 3 nap \u00E9s 4:05:06", "hu-HU digital full");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "digital" }).format({ milliseconds: 789 }), "0:00:00,789", "hu-HU digital milliseconds only");
        assertEquals(new Intl.DurationFormat("en-US", { style: "digital" }).format({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), "0:00:00", "digital all-zero fields produce clock zero");
    });

    test("narrow style formats supported locales", function () {
        var value = { years: 1, months: 2, weeks: 0, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 0 };

        assertEquals(new Intl.DurationFormat("en-US", { style: "narrow" }).format(value), "1y 2m 3d 4h 5m 6s", "en-US narrow");
        assertEquals(new Intl.DurationFormat("en-GB", { style: "narrow" }).format(value), "1y 2m 3d 4h 5m 6s", "en-GB narrow");
        assertEquals(new Intl.DurationFormat("de-DE", { style: "narrow" }).format(value), "1 J, 2 M, 3 T, 4h, 5 Min. und 6 Sek.", "de-DE narrow");
        assertEquals(new Intl.DurationFormat("fr-FR", { style: "narrow" }).format(value), "1a 2m. 3j 4h 5min 6s", "fr-FR narrow");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "narrow" }).format(value), "1 \u00E9v, 2 h., 3 nap, 4 \u00F3, 5 p \u00E9s 6 mp", "hu-HU narrow");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "narrow" }).format({ months: 2 }), "2 h.", "hu-HU narrow month differs from short");
        assertEquals(new Intl.DurationFormat("en-US", { style: "narrow" }).format({ seconds: 6, milliseconds: 789 }), "6s 789ms", "en-US narrow seconds milliseconds");
    });

    test("single units and milliseconds follow the approved tables", function () {
        assertEquals(new Intl.DurationFormat("en-US").format({ years: 2 }), "2 yrs", "en-US plural years");
        assertEquals(new Intl.DurationFormat("en-US").format({ hours: 2 }), "2 hr", "en-US plural hours stays hr");
        assertEquals(new Intl.DurationFormat("en-GB").format({ hours: 2 }), "2 hrs", "en-GB plural hours");
        assertEquals(new Intl.DurationFormat("fr-FR").format({ years: 2 }), "2" + NBSP + "ans", "fr-FR plural years");
        assertEquals(new Intl.DurationFormat("hu-HU").format({ milliseconds: 123 }), "123 ms", "hu-HU milliseconds");
        assertEquals(new Intl.DurationFormat("de-DE").format({ seconds: 1, milliseconds: 234 }), "1 Sek., 234 ms", "de-DE seconds milliseconds");
        assertEquals(new Intl.DurationFormat("fr-FR").format({ seconds: 1, milliseconds: 234 }), "1" + NNBSP + "s et 234" + NNBSP + "ms", "fr-FR seconds milliseconds");
        assertEquals(new Intl.DurationFormat("hu-HU").format({ seconds: 1, milliseconds: 234 }), "1 mp \u00E9s 234 ms", "hu-HU seconds milliseconds");
    });

    test("weeks and zero-valued fields are handled narrowly", function () {
        assertEquals(new Intl.DurationFormat("en-US").format({ weeks: 2, days: 3 }), "2 wks, 3 days", "en-US weeks days");
        assertEquals(new Intl.DurationFormat("de-DE").format({ weeks: 2, days: 3 }), "2 Wo., 3 Tg.", "de-DE weeks days");
        assertEquals(new Intl.DurationFormat("fr-FR").format({ weeks: 2, days: 3 }), "2" + NNBSP + "sem. et 3" + NNBSP + "j", "fr-FR weeks days");
        assertEquals(new Intl.DurationFormat("hu-HU").format({ weeks: 2, days: 3 }), "2 h\u00E9t \u00E9s 3 nap", "hu-HU weeks days");
        assertEquals(new Intl.DurationFormat("en-US").format({ years: 0, months: 0, days: 0, seconds: 0 }), "", "explicit all-zero fields follow Node-observed empty output");
    });

    test("negative and string-coerced values follow the approved subset", function () {
        assertEquals(new Intl.DurationFormat("en-US").format({ seconds: -1 }), "-1 sec", "single negative field");
        assertEquals(new Intl.DurationFormat("hu-HU").format({ seconds: "-2" }), "-2 mp", "string negative field");
        assertEquals(new Intl.DurationFormat("en-GB").format({ seconds: "2" }), "2 secs", "string positive field");
        assertEquals(new Intl.DurationFormat("en-US").format({ seconds: 2, bananas: 3 }), "2 sec", "unknown fields are ignored");
    });

    test("narrow ISO duration strings are accepted as input", function () {
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "short" }).format("P1Y2M3DT4H5M6S"), "1 \u00E9v, 2 h\u00F3nap, 3 nap, 4 \u00F3, 5 p \u00E9s 6 mp", "full ISO duration");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "short" }).format("P3D"), "3 nap", "ISO days do not leak into weeks");
        assertEquals(new Intl.DurationFormat("en-US", { style: "digital" }).format("PT1H2M"), "1:02:00", "ISO time duration digital");
        assertEquals(new Intl.DurationFormat("de-DE", { style: "long" }).format("P3D"), "3 Tage", "ISO date duration long");
        assertEquals(new Intl.DurationFormat("fr-FR", { style: "short" }).format("PT0.123S"), "123" + NNBSP + "ms", "ISO fractional seconds milliseconds");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "narrow" }).format("-PT1H2M"), "-1 \u00F3 \u00E9s -2 p", "negative ISO time duration");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "short" }).format("PT0S"), "", "ISO zero duration short");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "digital" }).format("PT0S"), "0:00:00", "ISO zero duration digital");
        assertEquals(new Intl.DurationFormat("en-US", { style: "digital" }).format("P0D"), "0:00:00", "ISO zero duration digital");
        assertEquals(new Intl.DurationFormat("en-US", { style: "short" }).format("+P2W"), "2 wks", "ISO plus sign");
    });

    test("resolvedOptions exposes the supported subset", function () {
        var options = new Intl.DurationFormat("hu-hu", {
            style: "short",
            numberingSystem: "latn",
            localeMatcher: "lookup"
        }).resolvedOptions();

        assertEquals(options.locale, "hu-HU", "locale");
        assertEquals(options.numberingSystem, "latn", "numberingSystem");
        assertEquals(options.style, "short", "style");
        assertEquals(options.years, "short", "years");
        assertEquals(options.yearsDisplay, "auto", "yearsDisplay");
        assertEquals(options.milliseconds, "short", "milliseconds");
        assertEquals(options.millisecondsDisplay, "auto", "millisecondsDisplay");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "long" }).resolvedOptions().seconds, "long", "long resolved unit style");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "digital" }).resolvedOptions().hours, "numeric", "digital resolved hours");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "digital" }).resolvedOptions().minutes, "2-digit", "digital resolved minutes");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "digital" }).resolvedOptions().hoursDisplay, "always", "digital resolved hoursDisplay");
        assertEquals(new Intl.DurationFormat("hu-HU", { style: "narrow" }).resolvedOptions().months, "narrow", "narrow resolved unit style");
    });

    test("unsupported locale falls back through Intl-core", function () {
        assertEquals(new Intl.DurationFormat("banana").resolvedOptions().locale, "en-US", "fallback locale");
        assertEquals(new Intl.DurationFormat("en-UK").resolvedOptions().locale, "en-GB", "legacy alias");
    });

    test("unsupported options throw RangeError", function () {
        assertThrowsWith(function () { new Intl.DurationFormat("en-US", { style: "banana" }); }, "RangeError", "invalid style");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US", { numberingSystem: "arab" }); }, "RangeError", "numberingSystem unsupported");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US", { localeMatcher: "bad" }); }, "RangeError", "localeMatcher unsupported");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US", { seconds: "long" }); }, "RangeError", "per-unit style unsupported");
    });

    test("invalid values throw", function () {
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format(undefined); }, "TypeError", "undefined duration unsupported");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format({}); }, "TypeError", "no supported fields");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format({ minutes: 1, seconds: -2 }); }, "RangeError", "mixed signs");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format({ seconds: 1.5 }); }, "RangeError", "fractional field");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format({ seconds: NaN }); }, "RangeError", "NaN field");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format("P"); }, "RangeError", "empty ISO duration");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format("PT"); }, "RangeError", "empty ISO time duration");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format("P1H"); }, "RangeError", "time unit before T");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format("PT1.2345S"); }, "RangeError", "too many fractional digits");
        assertThrowsWith(function () { new Intl.DurationFormat("en-US").format("pt1h"); }, "RangeError", "lowercase ISO rejected by this subset");
    });

    writeLine("Passed: " + passed);
    if (failed > 0) {
        writeLine("Failed: " + failed);
        throw new Error("Intl.DurationFormat subset tests failed");
    }
}());
