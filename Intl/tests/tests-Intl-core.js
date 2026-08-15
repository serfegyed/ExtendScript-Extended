/*
 * Intl core subset tests for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"

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

    function sameArray(actual, expected) {
        var index;

        if (!actual || actual.length !== expected.length) {
            return false;
        }
        for (index = 0; index < expected.length; index++) {
            if (actual[index] !== expected[index]) {
                return false;
            }
        }
        return true;
    }

    function arrayToString(value) {
        var result = [];
        var index;

        if (!value) {
            return String(value);
        }
        for (index = 0; index < value.length; index++) {
            result.push(String(value[index]));
        }
        return "[" + result.join(", ") + "]";
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
        if (!sameArray(actual, expected)) {
            fail((message || "Arrays are not equal") +
                "\n  expected: " + arrayToString(expected) +
                "\n  actual:   " + arrayToString(actual));
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

    writeLine("Intl core subset tests");
    writeLine("----------------------");

    test("Intl namespace and helpers are loaded", function () {
        assert(typeof Intl === "object", "Intl namespace should exist");
        assert(typeof Intl.getCanonicalLocales === "function", "Intl.getCanonicalLocales should exist");
        assert(typeof Intl.supportedValuesOf === "function", "Intl.supportedValuesOf should exist");
        assert(typeof Intl.__canonicalizeLocales__ === "function", "canonical helper should exist");
        assert(typeof Intl.__resolveLocale__ === "function", "locale resolver should exist");
        assert(typeof Intl.__supportedLocalesOf__ === "function", "supportedLocalesOf helper should exist");
        assert(typeof Intl.__requireCore__ === "function", "core require helper should exist");
        assert(typeof Intl.__toObject__ === "function", "options object helper should exist");
        assert(typeof Intl.__readStringOption__ === "function", "string option helper should exist");
        assert(typeof Intl.__pad__ === "function", "pad helper should exist");
    });

    test("getCanonicalLocales follows Node-observed core cases", function () {
        assertArrayEquals(Intl.getCanonicalLocales(undefined), [], "undefined locales");
        assertArrayEquals(Intl.getCanonicalLocales("en-us"), ["en-US"], "en-us");
        assertArrayEquals(Intl.getCanonicalLocales("en-gb"), ["en-GB"], "en-gb");
        assertArrayEquals(Intl.getCanonicalLocales("de-de"), ["de-DE"], "de-de");
        assertArrayEquals(Intl.getCanonicalLocales("fr-fr"), ["fr-FR"], "fr-fr");
        assertArrayEquals(Intl.getCanonicalLocales("hu-hu"), ["hu-HU"], "hu-hu");
        assertArrayEquals(Intl.getCanonicalLocales(["HU-hu", "en-us", "de-de"]), ["hu-HU", "en-US", "de-DE"], "array order");
        assertArrayEquals(Intl.getCanonicalLocales(["en-US", "en-us"]), ["en-US"], "duplicates");
        assertArrayEquals(Intl.getCanonicalLocales("en-UK"), ["en-GB"], "legacy en-UK alias");
        assertArrayEquals(Intl.getCanonicalLocales("banana"), ["banana"], "unknown simple tag remains canonicalized");
    });

    test("getCanonicalLocales rejects invalid narrow-scope inputs", function () {
        assertThrowsWith(function () {
            Intl.getCanonicalLocales("");
        }, "RangeError", "empty string should throw");

        assertThrowsWith(function () {
            Intl.getCanonicalLocales({ locale: "en-US" });
        }, "TypeError", "plain object without length should throw");

        assertThrowsWith(function () {
            Intl.getCanonicalLocales("en-US-extra");
        }, "RangeError", "three-part locale is outside this subset");
    });

    test("internal resolver returns supported locale or fallback", function () {
        assertEquals(Intl.__resolveLocale__(["hu-hu", "en-us"]), "hu-HU", "first supported locale");
        assertEquals(Intl.__resolveLocale__(["banana", "fr-fr"]), "fr-FR", "skip unsupported locale");
        assertEquals(Intl.__resolveLocale__("banana"), "en-US", "default fallback");
        assertEquals(Intl.__resolveLocale__(undefined, undefined, "de-de"), "de-DE", "custom fallback");
        assertEquals(Intl.__resolveLocale__(["en-gb"], ["de-DE", "en-GB"], "de-DE"), "en-GB", "custom available list");
        assertEquals(Intl.__resolveLocale__(["hu-hu"], ["fr-FR"], "fr-FR"), "fr-FR", "unsupported requested with custom fallback");
    });

    test("internal supportedLocalesOf helper filters canonical supported locales", function () {
        var locales = Intl.__supportedLocalesOf__(["hu-hu", "banana", "en-UK", "hu-HU"], ["en-US", "en-GB", "hu-HU"], { localeMatcher: "lookup" }, "Intl.Test");

        assertArrayEquals(locales, ["hu-HU", "en-GB"], "supported locales keep order and canonical aliases");
        assertArrayEquals(Intl.__supportedLocalesOf__("fr-fr", undefined, undefined, "Intl.Test"), ["fr-FR"], "string locale");
        assertArrayEquals(Intl.__supportedLocalesOf__(undefined, undefined, undefined, "Intl.Test"), [], "undefined locales");

        locales.push("BAD");
        assertArrayEquals(Intl.__supportedLocalesOf__(["hu-hu"], ["hu-HU"], undefined, "Intl.Test"), ["hu-HU"], "returned arrays are independent");

        assertThrowsWith(function () {
            Intl.__supportedLocalesOf__(["en-US"], undefined, { localeMatcher: "bad" }, "Intl.Test");
        }, "RangeError", "unsupported localeMatcher rejected");
    });

    test("central locale data exposes shared formatter tables", function () {
        assertEquals(Intl.__getLocaleData__("hu-hu", "number").group, "\u00A0", "hu-HU number grouping");
        assertEquals(Intl.__getLocaleData__("fr-fr", "dateTime").months["long"][0], "janvier", "fr-FR month table");
        assertEquals(Intl.__getLocaleData__("hu-HU", "collation").recordMap, "hungarian", "hu-HU collation map");
        assertEquals(Intl.__getLocaleData__("hu-HU", "listFormat").conjunction["short"].end, "{0} & {1}", "hu-HU ListFormat table");
        assertEquals(Intl.__getLocaleData__(undefined, "currencies").HUF.symbols["hu-HU"], "Ft", "currency symbol override");
        assertEquals(Intl.__getLocaleData__(undefined, "pluralRules")["en-US"].ordinal[2], "few", "plural rules categories");
        assertEquals(Intl.__getLocaleData__(undefined, "durationUnitLabels")["narrow"]["hu-HU"].months[0], "h.", "duration labels");
        assertEquals(Intl.__getLocaleData__(undefined, "displayNames").regions["de-DE"].HU, "Ungarn", "display names");
        assertEquals(Intl.__getLocaleData__("banana", "number"), undefined, "unknown locale data");
    });

    test("shared internal helpers cover narrow module needs", function () {
        var options = { style: new String("short") };

        Intl.__requireCore__("Intl.Test", true);
        assertEquals(Intl.__toObject__(undefined, "Intl.Test").constructor, Object, "undefined options creates object");
        assertEquals(Intl.__toObject__(options, "Intl.Test"), options, "object options are returned");
        assertEquals(Intl.__readStringOption__(options, "style", ["short", "long"], "long", "Intl.Test"), "short", "String object option coerces");
        assertEquals(Intl.__readStringOption__({}, "style", ["short", "long"], "long", "Intl.Test"), "long", "default option");
        assertEquals(Intl.__pad__(7, 3), "007", "pad positive");
        assertEquals(Intl.__pad__(-7, 2), "07", "pad absolute value");

        assertThrowsWith(function () {
            Intl.__toObject__(null, "Intl.Test");
        }, "TypeError", "null options rejected");

        assertThrowsWith(function () {
            Intl.__readStringOption__({ style: "banana" }, "style", ["short", "long"], "long", "Intl.Test");
        }, "RangeError", "unsupported option rejected");
    });

    test("supportedValuesOf reports the implemented subset forgivingly", function () {
        var currencies = Intl.supportedValuesOf("currency");
        var copy = Intl.supportedValuesOf("currency");

        assertArrayEquals(Intl.supportedValuesOf("calendar"), ["gregory"], "calendar values");
        assertArrayEquals(Intl.supportedValuesOf("collation"), ["default", "standard"], "collation values");
        assertArrayEquals(currencies, ["EUR", "GBP", "HUF", "USD"], "currency values");
        assertArrayEquals(Intl.supportedValuesOf("numberingSystem"), ["latn"], "numberingSystem values");
        assertArrayEquals(Intl.supportedValuesOf("timeZone"), [], "timeZone is a valid empty subset");
        assertArrayEquals(Intl.supportedValuesOf("unit"), [], "unit is intentionally empty");
        assertArrayEquals(Intl.supportedValuesOf("language"), [], "unsupported key returns empty array");
        assertArrayEquals(Intl.supportedValuesOf("region"), [], "DisplayNames-only region key returns empty array");
        assertArrayEquals(Intl.supportedValuesOf("banana"), [], "unknown key returns empty array");
        assertArrayEquals(Intl.supportedValuesOf(undefined), [], "undefined key returns empty array");
        assertArrayEquals(Intl.supportedValuesOf(null), [], "null key returns empty array");

        currencies.push("BAD");
        assertArrayEquals(copy, ["EUR", "GBP", "HUF", "USD"], "returned arrays are independent copies");
        assertArrayEquals(Intl.supportedValuesOf(new String("currency")), ["EUR", "GBP", "HUF", "USD"], "String object key coerces");
    });

    writeLine("Passed: " + passed);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl core tests failed: " + failed);
    }
}());
