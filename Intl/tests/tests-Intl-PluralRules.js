/*
 * Intl.PluralRules subset tests for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.PluralRules.js"

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

    function assertArrayEquals(actual, expected, message) {
        assertEquals(actual.join("|"), expected.join("|"), message);
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

    writeLine("Intl.PluralRules subset tests");
    writeLine("-----------------------------");

    test("constructor works with and without new", function () {
        var withNew = new Intl.PluralRules("hu-HU");
        var withoutNew = Intl.PluralRules("en-US", { type: "ordinal" });

        assert(withNew instanceof Intl.PluralRules, "new should create PluralRules");
        assert(withoutNew instanceof Intl.PluralRules, "call should create PluralRules");
        assertEquals(withNew.select(1), "one", "new PluralRules select");
        assertEquals(withoutNew.select(2), "two", "called PluralRules select");
    });

    test("supportedLocalesOf reports implemented locales", function () {
        assertEquals(typeof Intl.PluralRules.supportedLocalesOf, "function", "static method exists");
        assertEquals(Intl.PluralRules.supportedLocalesOf(["hu-hu", "banana", "en-UK", "hu-HU"], { localeMatcher: "lookup" }).join("|"), "hu-HU|en-GB", "filters supported locales");
        assertEquals(Intl.PluralRules.supportedLocalesOf("de-de", { localeMatcher: "best fit" }).join("|"), "de-DE", "string locale");
        assertEquals(Intl.PluralRules.supportedLocalesOf(undefined).join("|"), "", "undefined locales");

        assertThrowsWith(function () {
            Intl.PluralRules.supportedLocalesOf(["en-US"], { localeMatcher: "bad" });
        }, "RangeError", "unsupported localeMatcher");
    });

    test("resolvedOptions exposes the supported subset", function () {
        var cardinal = new Intl.PluralRules("fr-FR").resolvedOptions();
        var ordinal = new Intl.PluralRules("en-UK", { type: "ordinal" }).resolvedOptions();

        assertEquals(cardinal.locale, "fr-FR", "cardinal locale");
        assertEquals(cardinal.type, "cardinal", "cardinal type");
        assertArrayEquals(cardinal.pluralCategories, ["one", "many", "other"], "fr-FR cardinal categories");
        assertEquals(ordinal.locale, "en-GB", "legacy alias");
        assertEquals(ordinal.type, "ordinal", "ordinal type");
        assertArrayEquals(ordinal.pluralCategories, ["one", "two", "few", "other"], "English ordinal categories");

        ordinal.pluralCategories.push("bad");
        assertArrayEquals(new Intl.PluralRules("en-US", { type: "ordinal" }).resolvedOptions().pluralCategories, ["one", "two", "few", "other"], "categories are copied");
    });

    test("English cardinal and ordinal rules follow CLDR", function () {
        var cardinal = new Intl.PluralRules("en-US");
        var ordinal = new Intl.PluralRules("en-US", { type: "ordinal" });

        assertEquals(cardinal.select(0), "other", "0 cardinal");
        assertEquals(cardinal.select(1), "one", "1 cardinal");
        assertEquals(cardinal.select(2), "other", "2 cardinal");
        assertEquals(cardinal.select(1.5), "other", "fraction cardinal");
        assertEquals(cardinal.select(-1), "one", "negative cardinal uses absolute value");
        assertEquals(ordinal.select(1), "one", "1st");
        assertEquals(ordinal.select(2), "two", "2nd");
        assertEquals(ordinal.select(3), "few", "3rd");
        assertEquals(ordinal.select(4), "other", "4th");
        assertEquals(ordinal.select(11), "other", "11th");
        assertEquals(ordinal.select(21), "one", "21st");
        assertEquals(ordinal.select(22), "two", "22nd");
        assertEquals(ordinal.select(23), "few", "23rd");
    });

    test("German cardinal and ordinal rules follow CLDR", function () {
        var cardinal = new Intl.PluralRules("de-DE");
        var ordinal = new Intl.PluralRules("de-DE", { type: "ordinal" });

        assertEquals(cardinal.select(1), "one", "1 cardinal");
        assertEquals(cardinal.select(0), "other", "0 cardinal");
        assertEquals(cardinal.select(2), "other", "2 cardinal");
        assertEquals(cardinal.select(1.5), "other", "fraction cardinal");
        assertEquals(ordinal.select(1), "other", "1 ordinal");
        assertEquals(ordinal.select(2), "other", "2 ordinal");
    });

    test("French cardinal and ordinal rules follow CLDR", function () {
        var cardinal = new Intl.PluralRules("fr-FR");
        var ordinal = new Intl.PluralRules("fr-FR", { type: "ordinal" });

        assertEquals(cardinal.select(0), "one", "0 cardinal");
        assertEquals(cardinal.select(1), "one", "1 cardinal");
        assertEquals(cardinal.select(1.5), "one", "1.5 cardinal");
        assertEquals(cardinal.select(2), "other", "2 cardinal");
        assertEquals(cardinal.select(1000000), "many", "million cardinal");
        assertEquals(cardinal.select(2000000), "many", "two million cardinal");
        assertEquals(cardinal.select(1000001), "other", "not exact million");
        assertEquals(ordinal.select(1), "one", "1 ordinal");
        assertEquals(ordinal.select(2), "other", "2 ordinal");
    });

    test("Hungarian cardinal and ordinal rules follow CLDR", function () {
        var cardinal = new Intl.PluralRules("hu-HU");
        var ordinal = new Intl.PluralRules("hu-HU", { type: "ordinal" });

        assertEquals(cardinal.select(0), "other", "0 cardinal");
        assertEquals(cardinal.select(1), "one", "1 cardinal");
        assertEquals(cardinal.select(1.5), "other", "fraction cardinal");
        assertEquals(cardinal.select(2), "other", "2 cardinal");
        assertEquals(ordinal.select(1), "one", "1 ordinal");
        assertEquals(ordinal.select(5), "one", "5 ordinal");
        assertEquals(ordinal.select(2), "other", "2 ordinal");
        assertEquals(ordinal.select(6), "other", "6 ordinal");
    });

    test("edge cases select other where the subset has no category", function () {
        var cardinal = new Intl.PluralRules("en-US");
        var ordinal = new Intl.PluralRules("en-US", { type: "ordinal" });

        assertEquals(cardinal.select(NaN), "other", "NaN cardinal");
        assertEquals(cardinal.select(Infinity), "other", "Infinity cardinal");
        assertEquals(cardinal.select(-Infinity), "other", "-Infinity cardinal");
        assertEquals(ordinal.select(1.2), "other", "fraction ordinal");
        assertEquals(new Intl.PluralRules("banana").resolvedOptions().locale, "en-US", "fallback locale");
        assertEquals(new Intl.PluralRules("hu-HU").resolvedOptions().locale, "hu-HU", "module JSON locale remains supported");
    });

    test("values are coerced with Number", function () {
        var cardinal = new Intl.PluralRules("hu-HU");
        var ordinal = new Intl.PluralRules("en-US", { type: "ordinal" });

        assertEquals(cardinal.select("1"), "one", "string number");
        assertEquals(cardinal.select("banana"), "other", "invalid string number");
        assertEquals(ordinal.select(new Number(23)), "few", "Number object");
        assertEquals(cardinal.select(null), "other", "null is 0");
        assertEquals(cardinal.select(true), "one", "true is 1");
    });

    test("unsupported options throw RangeError", function () {
        assertThrowsWith(function () {
            new Intl.PluralRules("hu-HU", { type: "range" });
        }, "RangeError", "unsupported type");

        assertThrowsWith(function () {
            new Intl.PluralRules("hu-HU", { minimumFractionDigits: 2 });
        }, "RangeError", "unsupported digit option");
    });

    writeLine("Passed: " + passed);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.PluralRules tests failed: " + failed);
    }
}());
