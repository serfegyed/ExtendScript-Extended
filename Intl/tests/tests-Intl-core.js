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
        global.require = require;
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

    test("shared registry data exposes formatter tables", function () {
        assertEquals(Intl.__getLocaleData__(undefined, "currencies").HUF.symbols["hu-HU"], "Ft", "currency symbol override");
        assertEquals(Intl.__getLocaleData__(undefined, "collation").hungarian["\u00F6"].base, "oz", "collation character record");
        assertEquals(Intl.__getLocaleData__("banana"), undefined, "unknown locale data");
    });


    test("module locale data loads only requested module data with en-US fallback", function () {
        var collatorEn = Intl.__getModuleLocaleData__("Collator", "en-US");
        var collatorHu = Intl.__getModuleLocaleData__("Collator", "hu-HU");
        var dateTimeEn = Intl.__getModuleLocaleData__("DateTimeFormat", "en-US");
        var dateTimeFr = Intl.__getModuleLocaleData__("DateTimeFormat", "fr-FR");
        var displayEn = Intl.__getModuleLocaleData__("DisplayNames", "en-US");
        var displayDe = Intl.__getModuleLocaleData__("DisplayNames", "de-DE");
        var durationEn = Intl.__getModuleLocaleData__("DurationFormat", "en-US");
        var durationHu = Intl.__getModuleLocaleData__("DurationFormat", "hu-HU");
        var listEn = Intl.__getModuleLocaleData__("ListFormat", "en-US");
        var listHu = Intl.__getModuleLocaleData__("ListFormat", "hu-HU");
        var numberEn = Intl.__getModuleLocaleData__("NumberFormat", "en-US");
        var numberHu = Intl.__getModuleLocaleData__("NumberFormat", "hu-HU");
        var relativeEn = Intl.__getModuleLocaleData__("RelativeTimeFormat", "en-US");
        var relativeDe = Intl.__getModuleLocaleData__("RelativeTimeFormat", "de-DE");
        var en = Intl.__getModuleLocaleData__("PluralRules", "en-US");
        var hu = Intl.__getModuleLocaleData__("PluralRules", "hu-HU");
        var fr = Intl.__getModuleLocaleData__("PluralRules", "fr-FR");
        var fallback = Intl.__getModuleLocaleData__("PluralRules", "banana");

        assertEquals(collatorEn.__locale__, "en-US", "Collator en-US baseline locale");
        assertEquals(collatorEn.recordMap, "generic", "Collator en-US baseline record map");
        assertEquals(collatorHu.__locale__, "hu-HU", "Collator hu-HU JSON locale");
        assertEquals(collatorHu.recordMap, "hungarian", "Collator hu-HU JSON record map");
        assertEquals(dateTimeEn.__locale__, "en-US", "DateTimeFormat en-US baseline locale");
        assertEquals(dateTimeEn.months["long"][0], "January", "DateTimeFormat en-US baseline month table");
        assertEquals(dateTimeFr.__locale__, "fr-FR", "DateTimeFormat fr-FR JSON locale");
        assertEquals(dateTimeFr.months["long"][0], "janvier", "DateTimeFormat fr-FR JSON month table");
        assertEquals(displayEn.__locale__, "en-US", "DisplayNames en-US baseline locale");
        assertEquals(displayEn.regions.HU, "Hungary", "DisplayNames en-US baseline region");
        assertEquals(displayDe.__locale__, "de-DE", "DisplayNames de-DE JSON locale");
        assertEquals(displayDe.regions.HU, "Ungarn", "DisplayNames de-DE JSON region");
        assertEquals(displayDe.languages.dialect["fr-FR"], "Franz\u00F6sisch (Frankreich)", "DisplayNames de-DE JSON language");
        assertEquals(durationEn.__locale__, "en-US", "DurationFormat en-US baseline locale");
        assertEquals(durationEn.labels["narrow"].months[0], "m", "DurationFormat en-US baseline labels");
        assertEquals(durationHu.__locale__, "hu-HU", "DurationFormat hu-HU JSON locale");
        assertEquals(durationHu.labels["narrow"].months[0], "h.", "DurationFormat hu-HU JSON labels");
        assertEquals(durationHu.join.connectorRules[0].connector, " \u00E9s ", "DurationFormat hu-HU JSON connector");
        assertEquals(listEn.__locale__, "en-US", "ListFormat en-US baseline locale");
        assertEquals(listEn.conjunction["short"].end, "{0}, & {1}", "ListFormat en-US baseline pattern");
        assertEquals(listHu.__locale__, "hu-HU", "ListFormat hu-HU JSON locale");
        assertEquals(listHu.conjunction["short"].end, "{0} & {1}", "ListFormat hu-HU JSON pattern");
        assertEquals(numberEn.__locale__, "en-US", "NumberFormat en-US baseline locale");
        assertEquals(numberEn.group, ",", "NumberFormat en-US baseline grouping");
        assertEquals(numberHu.__locale__, "hu-HU", "NumberFormat hu-HU JSON locale");
        assertEquals(numberHu.group, "\u00A0", "NumberFormat hu-HU JSON grouping");
        assertEquals(relativeEn.__locale__, "en-US", "RelativeTimeFormat en-US baseline locale");
        assertEquals(relativeEn["long"].auto.day["-1"], "yesterday", "RelativeTimeFormat en-US baseline auto day");
        assertEquals(relativeDe.__locale__, "de-DE", "RelativeTimeFormat de-DE JSON locale");
        assertEquals(relativeDe["long"].auto.day["2"], "\u00FCbermorgen", "RelativeTimeFormat de-DE JSON auto day");
        assertEquals(en.__locale__, "en-US", "en-US baseline locale");
        assertEquals(en.ordinal[2], "few", "en-US baseline ordinal data");
        assertEquals(hu.__locale__, "hu-HU", "hu-HU JSON locale");
        assertEquals(hu.ordinal.join("|"), "one|other", "hu-HU JSON categories");
        assertEquals(fr.cardinal.join("|"), "one|many|other", "fr-FR JSON categories");
        assertEquals(fallback.__locale__, "en-US", "missing module locale falls back to en-US");

        assertThrowsWith(function () {
            Intl.__getModuleLocaleData__("MissingModule", "hu-HU");
        }, "Error", "missing en-US baseline is a development error");
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
