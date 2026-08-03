/*
 * Intl.DisplayNames subset tests for ESTK and Node.js.
 */
//@include "../../Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.DisplayNames.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.DisplayNames.js"), "utf8"));
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

    writeLine("Intl.DisplayNames subset tests");
    writeLine("------------------------------");

    test("constructor works with and without new", function () {
        var withNew = new Intl.DisplayNames("hu-HU", { type: "region" });
        var withoutNew = Intl.DisplayNames("hu-HU", { type: "region" });

        assert(withNew instanceof Intl.DisplayNames, "new should create DisplayNames");
        assert(withoutNew instanceof Intl.DisplayNames, "call should create DisplayNames");
        assertEquals(withNew.of("HU"), "Magyarorsz\u00E1g", "new DisplayNames of");
        assertEquals(withoutNew.of("DE"), "N\u00E9metorsz\u00E1g", "called DisplayNames of");
    });

    test("supportedLocalesOf reports implemented locales", function () {
        assertEquals(typeof Intl.DisplayNames.supportedLocalesOf, "function", "static method exists");
        assertEquals(Intl.DisplayNames.supportedLocalesOf(["hu-hu", "banana", "en-UK", "hu-HU"], { localeMatcher: "lookup" }).join("|"), "hu-HU|en-GB", "filters supported locales");
        assertEquals(Intl.DisplayNames.supportedLocalesOf("de-de", { localeMatcher: "best fit" }).join("|"), "de-DE", "string locale");
        assertEquals(Intl.DisplayNames.supportedLocalesOf(undefined).join("|"), "", "undefined locales");

        assertThrowsWith(function () {
            Intl.DisplayNames.supportedLocalesOf(["en-US"], { localeMatcher: "bad" });
        }, "RangeError", "unsupported localeMatcher");
    });

    test("resolvedOptions exposes the supported subset", function () {
        var language = new Intl.DisplayNames("hu-hu", {
            type: "language",
            languageDisplay: "standard",
            fallback: "none",
            localeMatcher: "lookup"
        }).resolvedOptions();
        var region = new Intl.DisplayNames("fr-FR", { type: "region" }).resolvedOptions();

        assertEquals(language.locale, "hu-HU", "locale");
        assertEquals(language.style, "long", "style");
        assertEquals(language.type, "language", "type");
        assertEquals(language.fallback, "none", "fallback");
        assertEquals(language.languageDisplay, "standard", "languageDisplay");
        assertEquals(region.languageDisplay, undefined, "non-language omits languageDisplay");
    });

    test("language names follow the approved long tables", function () {
        assertEquals(new Intl.DisplayNames("en-US", { type: "language" }).of("en-US"), "American English", "en-US dialect");
        assertEquals(new Intl.DisplayNames("en-US", { type: "language", languageDisplay: "standard" }).of("en-US"), "English (United States)", "en-US standard");
        assertEquals(new Intl.DisplayNames("de-DE", { type: "language" }).of("hu-HU"), "Ungarisch (Ungarn)", "German Hungarian");
        assertEquals(new Intl.DisplayNames("fr-FR", { type: "language" }).of("en-GB"), "anglais britannique", "French British English");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "language" }).of("fr-FR"), "francia (Franciaorsz\u00E1g)", "Hungarian French");
    });

    test("region names follow the approved long tables", function () {
        assertEquals(new Intl.DisplayNames("en-GB", { type: "region" }).of("GB"), "United Kingdom", "English region");
        assertEquals(new Intl.DisplayNames("de-DE", { type: "region" }).of("US"), "Vereinigte Staaten", "German region");
        assertEquals(new Intl.DisplayNames("fr-FR", { type: "region" }).of("HU"), "Hongrie", "French region");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "region" }).of("FR"), "Franciaorsz\u00E1g", "Hungarian region");
    });

    test("currency names follow the approved long tables", function () {
        assertEquals(new Intl.DisplayNames("en-US", { type: "currency" }).of("usd"), "US Dollar", "uppercase currency");
        assertEquals(new Intl.DisplayNames("de-DE", { type: "currency" }).of("GBP"), "Britisches Pfund", "German currency");
        assertEquals(new Intl.DisplayNames("fr-FR", { type: "currency" }).of("HUF"), "forint hongrois", "French currency");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "currency" }).of("EUR"), "eur\u00F3", "Hungarian currency");
    });

    test("fallback controls unknown but well-formed codes", function () {
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "region" }).of("IT"), "IT", "unknown region code fallback");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "region", fallback: "none" }).of("IT"), undefined, "unknown region none fallback");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "currency" }).of("JPY"), "JPY", "unknown currency code fallback");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "currency", fallback: "none" }).of("JPY"), undefined, "unknown currency none fallback");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "language" }).of("it"), "it", "unknown language code fallback");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "language", fallback: "none" }).of("it"), undefined, "unknown language none fallback");
    });

    test("canonicalization keeps well-formed code inputs stable", function () {
        var languages = new Intl.DisplayNames("hu-HU", { type: "language" });
        var regions = new Intl.DisplayNames("hu-HU", { type: "region" });
        var currencies = new Intl.DisplayNames("hu-HU", { type: "currency" });

        assertEquals(languages.of("EN-us"), "amerikai angol", "language tag case canonicalization");
        assertEquals(languages.of("EN-uk"), "brit angol", "language tag legacy alias");
        assertEquals(languages.of("DE"), "n\u00E9met", "language-only uppercase input");
        assertEquals(regions.of("gb"), "Egyes\u00FClt Kir\u00E1lys\u00E1g", "region lowercase input");
        assertEquals(currencies.of("eur"), "eur\u00F3", "currency lowercase input");
    });

    test("language fallback follows the narrow Intl-core locale rules", function () {
        var codeFallback = new Intl.DisplayNames("en-US", { type: "language" });
        var noneFallback = new Intl.DisplayNames("en-US", { type: "language", fallback: "none" });

        assertEquals(codeFallback.of("xx"), "xx", "unknown language-only code");
        assertEquals(codeFallback.of("xx-YY"), "xx-YY", "unknown language-region code");
        assertEquals(codeFallback.of("en-YY"), "en-YY", "known language with unknown region");
        assertEquals(noneFallback.of("xx-YY"), undefined, "unknown language-region none fallback");

        assertThrowsWith(function () {
            codeFallback.of("");
        }, "RangeError", "empty language code");

        assertThrowsWith(function () {
            codeFallback.of("a-b-c");
        }, "RangeError", "too many language tag parts");
    });

    test("region and currency validation is intentionally narrow", function () {
        var regions = new Intl.DisplayNames("en-US", { type: "region" });
        var currencies = new Intl.DisplayNames("en-US", { type: "currency" });

        assertEquals(regions.of("zz"), "ZZ", "unknown two-letter region fallback is canonicalized");
        assertEquals(new Intl.DisplayNames("en-US", { type: "region", fallback: "none" }).of("zz"), undefined, "unknown two-letter region none fallback");
        assertEquals(currencies.of("xxx"), "XXX", "unknown three-letter currency fallback is canonicalized");
        assertEquals(new Intl.DisplayNames("en-US", { type: "currency", fallback: "none" }).of("xxx"), undefined, "unknown three-letter currency none fallback");

        assertThrowsWith(function () {
            regions.of("1A");
        }, "RangeError", "numeric region code part");

        assertThrowsWith(function () {
            regions.of("H");
        }, "RangeError", "one-letter region");

        assertThrowsWith(function () {
            currencies.of("EURO");
        }, "RangeError", "four-letter currency");

        assertThrowsWith(function () {
            currencies.of("12A");
        }, "RangeError", "numeric currency code part");
    });

    test("String object inputs are coerced", function () {
        assertEquals(new Intl.DisplayNames("hu-HU", { type: new String("region") }).of(new String("gb")), "Egyes\u00FClt Kir\u00E1lys\u00E1g", "String region input");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "currency", fallback: new String("code") }).of(new String("huf")), "magyar forint", "String currency input");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "language", languageDisplay: new String("standard") }).of(new String("en-GB")), "angol (Egyes\u00FClt Kir\u00E1lys\u00E1g)", "String language input");
    });

    test("localeMatcher is accepted as an ignored compatibility option", function () {
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "region", localeMatcher: "lookup" }).of("US"), "Egyes\u00FClt \u00C1llamok", "lookup localeMatcher");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "region", localeMatcher: "best fit" }).of("US"), "Egyes\u00FClt \u00C1llamok", "best fit localeMatcher");
        assertEquals(new Intl.DisplayNames("hu-HU", { type: "region", localeMatcher: "banana" }).of("US"), "Egyes\u00FClt \u00C1llamok", "invalid localeMatcher remains ignored in this subset");
    });

    test("unsupported locale falls back through Intl-core", function () {
        assertEquals(new Intl.DisplayNames("banana", { type: "region" }).resolvedOptions().locale, "en-US", "fallback locale");
        assertEquals(new Intl.DisplayNames("en-UK", { type: "region" }).resolvedOptions().locale, "en-GB", "legacy alias");
    });

    test("unsupported options throw RangeError", function () {
        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "script" });
        }, "RangeError", "unsupported type");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "calendar" });
        }, "RangeError", "unsupported calendar type");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "dateTimeField" });
        }, "RangeError", "unsupported dateTimeField type");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "unit" });
        }, "RangeError", "unit matrix is intentionally unsupported");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "region", style: "short" });
        }, "RangeError", "unsupported style");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "region", style: "narrow" });
        }, "RangeError", "unsupported narrow style");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "region", fallback: "banana" });
        }, "RangeError", "unsupported fallback");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "language", languageDisplay: "banana" });
        }, "RangeError", "unsupported languageDisplay");
    });

    test("invalid values throw", function () {
        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US");
        }, "TypeError", "options required");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", {});
        }, "TypeError", "type required");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "region" }).of("USA");
        }, "RangeError", "invalid region code");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "currency" }).of("US");
        }, "RangeError", "invalid currency code");

        assertThrowsWith(function () {
            new Intl.DisplayNames("en-US", { type: "region" }).of();
        }, "TypeError", "code required");
    });

    writeLine("Passed: " + passed);
    if (failed > 0) {
        writeLine("Failed: " + failed);
        throw new Error("Intl.DisplayNames tests failed: " + failed);
    }
}());
