/*
 * Intl.Collator subset tests for ESTK and Node.js.
 */
//@include "../../Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.Collator.js"

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
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.Collator.js"), "utf8"));
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

    function assertSign(actual, expected, message) {
        var sign = actual < 0 ? -1 : (actual > 0 ? 1 : 0);
        assertEquals(sign, expected, message);
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

    writeLine("Intl.Collator subset tests");
    writeLine("--------------------------");

    test("constructor works with and without new", function () {
        var withNew = new Intl.Collator("de-DE");
        var withoutNew = Intl.Collator("de-DE");

        assert(withNew instanceof Intl.Collator, "new should create Collator");
        assert(withoutNew instanceof Intl.Collator, "call should create Collator");
        assertSign(withNew.compare("a", "b"), -1, "new collator compare");
        assertSign(withoutNew.compare("b", "a"), 1, "called collator compare");
    });

    test("supportedLocalesOf reports implemented locales", function () {
        assertEquals(typeof Intl.Collator.supportedLocalesOf, "function", "static method exists");
        assertEquals(Intl.Collator.supportedLocalesOf(["hu-hu", "banana", "en-UK", "hu-HU"], { localeMatcher: "lookup" }).join("|"), "hu-HU|en-GB", "filters supported locales");
        assertEquals(Intl.Collator.supportedLocalesOf("de-de", { localeMatcher: "best fit" }).join("|"), "de-DE", "string locale");
        assertEquals(Intl.Collator.supportedLocalesOf(undefined).join("|"), "", "undefined locales");

        assertThrowsWith(function () {
            Intl.Collator.supportedLocalesOf(["en-US"], { localeMatcher: "bad" });
        }, "RangeError", "unsupported localeMatcher");
    });

    test("resolvedOptions exposes the supported subset", function () {
        var options = new Intl.Collator("hu-hu", {
            usage: "search",
            sensitivity: "accent",
            ignorePunctuation: true,
            caseFirst: "upper",
            localeMatcher: "lookup"
        }).resolvedOptions();

        assertEquals(options.locale, "hu-HU", "locale");
        assertEquals(options.usage, "search", "usage");
        assertEquals(options.sensitivity, "accent", "sensitivity");
        assertEquals(options.ignorePunctuation, true, "ignorePunctuation");
        assertEquals(options.collation, "default", "collation");
        assertEquals(options.numeric, false, "numeric");
        assertEquals(options.caseFirst, "upper", "caseFirst");
    });

    test("sensitivity controls base accent and case differences", function () {
        assertSign(new Intl.Collator("en-US", { sensitivity: "base" }).compare("resume", "r\u00E9sum\u00E9"), 0, "base ignores accents");
        assertSign(new Intl.Collator("en-US", { sensitivity: "accent" }).compare("resume", "r\u00E9sum\u00E9"), -1, "accent keeps accents");
        assertSign(new Intl.Collator("en-US", { sensitivity: "accent" }).compare("a", "A"), 0, "accent ignores case");
        assertSign(new Intl.Collator("en-US", { sensitivity: "case" }).compare("a", "\u00E1"), 0, "case ignores accents");
        assertSign(new Intl.Collator("en-US", { sensitivity: "case" }).compare("a", "A"), -1, "case keeps case");
        assertSign(new Intl.Collator("en-US", { sensitivity: "variant" }).compare("a", "\u00E1"), -1, "variant keeps accents");
        assertSign(new Intl.Collator("en-US", { sensitivity: "variant" }).compare("a", "A"), -1, "variant keeps case");
    });
    test("caseFirst orders lowercase and uppercase variants", function () {
        assertSign(new Intl.Collator("hu-HU", { sensitivity: "case" }).compare("a", "A"), -1, "default caseFirst is lower-first");
        assertSign(new Intl.Collator("hu-HU", { sensitivity: "case", caseFirst: "false" }).compare("\u00E1", "\u00C1"), -1, "false keeps lower-first for a-acute");
        assertSign(new Intl.Collator("hu-HU", { sensitivity: "case", caseFirst: "lower" }).compare("\u0151", "\u0150"), -1, "lower puts o-double-acute lowercase first");
        assertSign(new Intl.Collator("hu-HU", { sensitivity: "case", caseFirst: "upper" }).compare("\u0171", "\u0170"), 1, "upper puts u-double-acute uppercase first");
        assertSign(new Intl.Collator("de-DE", { sensitivity: "variant", caseFirst: "upper" }).compare("\u00FC", "\u00DC"), 1, "upper works with German u-umlaut");
        assertSign(new Intl.Collator("fr-FR", { sensitivity: "accent", caseFirst: "upper" }).compare("\u00E9", "\u00C9"), 0, "caseFirst has no effect when case is ignored");
        assertEquals(new Intl.Collator("en-US", { caseFirst: "lower" }).resolvedOptions().caseFirst, "lower", "resolved lower caseFirst");
    });

    test("Hungarian base sensitivity keeps umlaut vowel groups distinct", function () {
        var collator = new Intl.Collator("hu-HU", { sensitivity: "base" });

        assertSign(collator.compare("a", "\u00E1"), 0, "a and a-acute share a base letter");
        assertSign(collator.compare("o", "\u00F3"), 0, "o and o-acute share a base letter");
        assertSign(collator.compare("o", "\u00F6"), -1, "o and o-umlaut remain distinct in Hungarian");
        assertSign(collator.compare("u", "\u00FC"), -1, "u and u-umlaut remain distinct in Hungarian");
        assertSign(collator.compare("\u00F6", "\u0151"), 0, "o-umlaut and double-acute share a base group");
        assertSign(collator.compare("\u00FC", "\u0171"), 0, "u-umlaut and double-acute share a base group");
    });

    test("ignorePunctuation removes ASCII punctuation before comparing", function () {
        assertSign(new Intl.Collator("en-US").compare("a-b", "ab"), -1, "punctuation normally participates");
        assertSign(new Intl.Collator("en-US", { ignorePunctuation: true }).compare("a-b", "ab"), 0, "punctuation ignored");
        assertSign(new Intl.Collator("de-DE", { ignorePunctuation: true, sensitivity: "base" }).compare("co-op", "coop"), 0, "punctuation ignored with base sensitivity");
    });

    test("usage search is accepted but uses the same compare core", function () {
        var sort = new Intl.Collator("fr-FR", { usage: "sort", sensitivity: "variant" });
        var search = new Intl.Collator("fr-FR", { usage: "search", sensitivity: "variant" });

        assertEquals(search.resolvedOptions().usage, "search", "resolved search usage");
        assertSign(search.compare("resume", "r\u00E9sum\u00E9"), -1, "search keeps the same variant behavior");
        assertSign(search.compare("a-b", "ab"), sort.compare("a-b", "ab") < 0 ? -1 : (sort.compare("a-b", "ab") > 0 ? 1 : 0), "search and sort share compare behavior");
    });

    test("compare coerces inputs to strings", function () {
        var collator = new Intl.Collator("en-US");

        assertSign(collator.compare(2, 10), 1, "numbers compare as strings in the non-numeric subset");
        assertSign(collator.compare(null, "null"), 0, "null string coercion");
        assertSign(collator.compare(true, "true"), 0, "boolean string coercion");
    });

    test("numeric true compares ASCII digit runs like Node observed natural sort", function () {
        var numeric = new Intl.Collator("hu-HU", { numeric: true });

        assertEquals(numeric.resolvedOptions().numeric, true, "resolved numeric true");
        assertSign(numeric.compare("a2", "a10"), -1, "a2 before a10");
        assertSign(numeric.compare("2", "10"), -1, "2 before 10");
        assertSign(numeric.compare("file02", "file2"), 0, "leading zeros ignored");
        assertSign(numeric.compare("file2", "file10"), -1, "file2 before file10");
        assertSign(numeric.compare("v1.9", "v1.10"), -1, "dot separates digit runs");
        assertSign(numeric.compare("a-2", "a-10"), -1, "minus is punctuation, not a negative sign");
        assertSign(numeric.compare("a1.02", "a1.2"), 0, "leading zeros ignored after separator");
        assertSign(new Intl.Collator("en-US", { numeric: "false" }).compare("2", "10"), -1, "truthy string enables numeric");
    });

    test("edge cases follow the approved Collator subset", function () {
        var base = new Intl.Collator("en-US", { sensitivity: "base" });
        var accent = new Intl.Collator("fr-FR", { sensitivity: "accent", caseFirst: "upper" });
        var explicitDefaults = new Intl.Collator("de-DE", {
            usage: new String("sort"),
            sensitivity: new String("variant"),
            caseFirst: new String("false"),
            collation: new String("standard"),
            localeMatcher: new String("lookup")
        }).resolvedOptions();

        assertSign(new Intl.Collator("en-US").compare("", "a"), -1, "empty string sorts before non-empty string");
        assertSign(new Intl.Collator("en-US").compare("", ""), 0, "empty strings compare equal");
        assertSign(new Intl.Collator("en-US").compare(undefined, "undefined"), 0, "undefined string coercion");
        assertSign(new Intl.Collator("en-US").compare(false, "false"), 0, "false string coercion");
        assertSign(new Intl.Collator("en-US").compare(10, 2), -1, "numbers compare lexically by default");

        assertEquals(explicitDefaults.usage, "sort", "usage String object coerces");
        assertEquals(explicitDefaults.sensitivity, "variant", "sensitivity String object coerces");
        assertEquals(explicitDefaults.caseFirst, "false", "caseFirst String object coerces");
        assertEquals(explicitDefaults.collation, "default", "standard collation alias resolves to default");

        assertSign(base.compare("\u00E1", "\u00C1"), 0, "caseFirst cannot affect base sensitivity");
        assertSign(accent.compare("\u00E9", "\u00C9"), 0, "caseFirst cannot affect accent sensitivity");
        assertSign(new Intl.Collator("en-US", { ignorePunctuation: 0 }).compare("a-b", "ab"), -1, "numeric zero leaves punctuation enabled");
        assertSign(new Intl.Collator("en-US", { ignorePunctuation: "false" }).compare("a-b", "ab"), 0, "truthy string enables ignorePunctuation");
    });
    test("unsupported options throw RangeError", function () {
        assertThrowsWith(function () {
            new Intl.Collator("en-US", { usage: "lookup" });
        }, "RangeError", "unsupported usage");

        assertThrowsWith(function () {
            new Intl.Collator("en-US", { sensitivity: "banana" });
        }, "RangeError", "unsupported sensitivity");

        assertThrowsWith(function () {
            new Intl.Collator("en-US", { caseFirst: "banana" });
        }, "RangeError", "unsupported caseFirst");

        assertThrowsWith(function () {
            new Intl.Collator("en-US", { collation: "phonebk" });
        }, "RangeError", "collation not supported");
    });

    test("unsupported locale falls back through Intl-core", function () {
        assertEquals(new Intl.Collator("banana").resolvedOptions().locale, "en-US", "fallback locale");
        assertEquals(new Intl.Collator("en-UK").resolvedOptions().locale, "en-GB", "legacy alias");
    });

    writeLine("Passed: " + passed);
    if (failed > 0) {
        writeLine("Failed: " + failed);
        throw new Error("Intl.Collator subset tests failed");
    }
}());
