/*
 * Intl.RelativeTimeFormat subset tests for ESTK and Node.js.
 */
//@include "../../Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.PluralRules.js"
//@include "../Intl.RelativeTimeFormat.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        global.require = require;
        var fs = require("fs");
        var path = require("path");
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.PluralRules.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.RelativeTimeFormat.js"), "utf8"));
    }());
}

(function () {
    var passed = 0;
    var failed = 0;

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

    writeLine("Intl.RelativeTimeFormat subset tests");
    writeLine("------------------------------------");

    test("constructor works with and without new", function () {
        var withNew = new Intl.RelativeTimeFormat("hu-HU");
        var withoutNew = Intl.RelativeTimeFormat("en-US", { style: "short" });

        assert(withNew instanceof Intl.RelativeTimeFormat, "new should create RelativeTimeFormat");
        assert(withoutNew instanceof Intl.RelativeTimeFormat, "call should create RelativeTimeFormat");
        assertEquals(withNew.format(1, "day"), "1 nap m\u00FAlva", "new RelativeTimeFormat format");
        assertEquals(withoutNew.format(-2, "minute"), "2 min. ago", "called RelativeTimeFormat format");
    });

    test("supportedLocalesOf reports implemented locales", function () {
        assertEquals(typeof Intl.RelativeTimeFormat.supportedLocalesOf, "function", "static method exists");
        assertEquals(Intl.RelativeTimeFormat.supportedLocalesOf(["hu-hu", "banana", "en-UK", "hu-HU"], { localeMatcher: "lookup" }).join("|"), "hu-HU|en-GB", "filters supported locales");
        assertEquals(Intl.RelativeTimeFormat.supportedLocalesOf("de-de", { localeMatcher: "best fit" }).join("|"), "de-DE", "string locale");
        assertEquals(Intl.RelativeTimeFormat.supportedLocalesOf(undefined).join("|"), "", "undefined locales");

        assertThrowsWith(function () {
            Intl.RelativeTimeFormat.supportedLocalesOf(["en-US"], { localeMatcher: "bad" });
        }, "RangeError", "unsupported localeMatcher");
    });

    test("resolvedOptions exposes the supported subset", function () {
        var options = new Intl.RelativeTimeFormat("en-UK", { style: "narrow", numeric: "auto" }).resolvedOptions();

        assertEquals(options.locale, "en-GB", "legacy alias");
        assertEquals(options.style, "narrow", "style");
        assertEquals(options.numeric, "auto", "numeric");
    });

    test("numeric always formats long values", function () {
        assertEquals(new Intl.RelativeTimeFormat("en-US").format(-2, "day"), "2 days ago", "en-US past");
        assertEquals(new Intl.RelativeTimeFormat("en-US").format(1, "year"), "in 1 year", "en-US future one");
        assertEquals(new Intl.RelativeTimeFormat("de-DE").format(-2, "month"), "vor 2 Monaten", "de-DE past");
        assertEquals(new Intl.RelativeTimeFormat("fr-FR").format(1, "hour"), "dans 1 heure", "fr-FR future one");
        assertEquals(new Intl.RelativeTimeFormat("hu-HU").format(-2, "second"), "2 m\u00E1sodperccel ezel\u0151tt", "hu-HU past");
    });

    test("short and narrow styles format supported locales", function () {
        assertEquals(new Intl.RelativeTimeFormat("en-US", { style: "narrow" }).format(2, "week"), "+2w", "en-US narrow");
        assertEquals(new Intl.RelativeTimeFormat("en-GB", { style: "short" }).format(-2, "second"), "2 sec ago", "en-GB short");
        assertEquals(new Intl.RelativeTimeFormat("de-DE", { style: "short" }).format(1, "second"), "in 1 Sek.", "de-DE short");
        assertEquals(new Intl.RelativeTimeFormat("fr-FR", { style: "short" }).format(2, "hour"), "dans 2\u00A0h", "fr-FR short NBSP");
        assertEquals(new Intl.RelativeTimeFormat("fr-FR", { style: "narrow" }).format(-2, "year"), "-2 a", "fr-FR narrow");
        assertEquals(new Intl.RelativeTimeFormat("hu-HU", { style: "short" }).format(-2, "day"), "2 napja", "hu-HU short");
        assertEquals(new Intl.RelativeTimeFormat("hu-HU", { style: "narrow" }).format(-2, "week"), "2 hete", "hu-HU narrow");
    });

    test("numeric auto uses implemented lexical day forms", function () {
        assertEquals(new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(-2, "day"), "2 days ago", "en-US keeps Node numeric -2");
        assertEquals(new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(-1, "day"), "yesterday", "en-US yesterday");
        assertEquals(new Intl.RelativeTimeFormat("de-DE", { numeric: "auto" }).format(2, "day"), "\u00FCbermorgen", "de-DE after tomorrow");
        assertEquals(new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" }).format(-2, "day"), "avant-hier", "fr-FR before yesterday");
        assertEquals(new Intl.RelativeTimeFormat("hu-HU", { numeric: "auto" }).format(-2, "day"), "tegnapel\u0151tt", "hu-HU before yesterday");
        assertEquals(new Intl.RelativeTimeFormat("hu-HU", { numeric: "auto" }).format(2, "day"), "holnaput\u00E1n", "hu-HU after tomorrow");
    });

    test("edge cases follow the approved subset", function () {
        var formatter = new Intl.RelativeTimeFormat("hu-HU");

        assertEquals(formatter.format("-0", "day"), "0 nappal ezel\u0151tt", "negative zero string is past");
        if (isNodeRuntime) {
            assertEquals(formatter.format(-0, "day"), "0 nappal ezel\u0151tt", "negative zero literal is past");
        }
        assertEquals(formatter.format(0, "day"), "0 nap m\u00FAlva", "positive zero is future");
        assertEquals(new Intl.RelativeTimeFormat("banana").resolvedOptions().locale, "en-US", "fallback locale");
        assertEquals(new Intl.RelativeTimeFormat("en-US").format("2", "days"), "in 2 days", "string value and plural unit alias");
        assertEquals(new Intl.RelativeTimeFormat("en-US").format(new Number(-1), "year"), "1 year ago", "Number object value");
    });

    test("unsupported options and values throw RangeError", function () {
        assertThrowsWith(function () { new Intl.RelativeTimeFormat("hu-HU", { style: "tiny" }); }, "RangeError", "unsupported style");
        assertThrowsWith(function () { new Intl.RelativeTimeFormat("hu-HU", { numeric: "sometimes" }); }, "RangeError", "unsupported numeric");
        assertThrowsWith(function () { new Intl.RelativeTimeFormat("hu-HU").format(1, "quarter"); }, "RangeError", "unsupported unit");
        assertThrowsWith(function () { new Intl.RelativeTimeFormat("hu-HU").format(NaN, "day"); }, "RangeError", "NaN value");
        assertThrowsWith(function () { new Intl.RelativeTimeFormat("hu-HU").format(Infinity, "day"); }, "RangeError", "Infinity value");
    });

    writeLine("Passed: " + passed);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.RelativeTimeFormat tests failed: " + failed);
    }
}());