/*
 * Intl.ListFormat subset tests for ESTK and Node.js.
 */
//@include "../../Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.ListFormat.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.ListFormat.js"), "utf8"));
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

    writeLine("Intl.ListFormat subset tests");
    writeLine("----------------------------");

    test("constructor works with and without new", function () {
        var withNew = new Intl.ListFormat("hu-HU");
        var withoutNew = Intl.ListFormat("hu-HU", { type: "disjunction" });

        assert(withNew instanceof Intl.ListFormat, "new should create ListFormat");
        assert(withoutNew instanceof Intl.ListFormat, "call should create ListFormat");
        assertEquals(withNew.format(["A", "B"]), "A \u00E9s B", "new ListFormat format");
        assertEquals(withoutNew.format(["A", "B"]), "A vagy B", "called ListFormat format");
    });

    test("supportedLocalesOf reports implemented locales", function () {
        assertEquals(typeof Intl.ListFormat.supportedLocalesOf, "function", "static method exists");
        assertEquals(Intl.ListFormat.supportedLocalesOf(["hu-hu", "banana", "en-UK", "hu-HU"], { localeMatcher: "lookup" }).join("|"), "hu-HU|en-GB", "filters supported locales");
        assertEquals(Intl.ListFormat.supportedLocalesOf("de-de", { localeMatcher: "best fit" }).join("|"), "de-DE", "string locale");
        assertEquals(Intl.ListFormat.supportedLocalesOf(undefined).join("|"), "", "undefined locales");

        assertThrowsWith(function () {
            Intl.ListFormat.supportedLocalesOf(["en-US"], { localeMatcher: "bad" });
        }, "RangeError", "unsupported localeMatcher");
    });

    test("resolvedOptions exposes the supported subset", function () {
        var options = new Intl.ListFormat("en-UK", {
            type: "unit",
            style: "narrow",
            localeMatcher: "lookup"
        }).resolvedOptions();

        assertEquals(options.locale, "en-GB", "locale");
        assertEquals(options.type, "unit", "type");
        assertEquals(options.style, "narrow", "style");
    });

    test("conjunction patterns follow the approved tables", function () {
        assertEquals(new Intl.ListFormat("en-US").format(["A", "B", "C"]), "A, B, and C", "en-US long conjunction");
        assertEquals(new Intl.ListFormat("en-US", { style: "short" }).format(["A", "B", "C"]), "A, B, & C", "en-US short conjunction");
        assertEquals(new Intl.ListFormat("en-GB").format(["A", "B", "C"]), "A, B and C", "en-GB long conjunction");
        assertEquals(new Intl.ListFormat("de-DE").format(["A", "B", "C"]), "A, B und C", "de-DE long conjunction");
        assertEquals(new Intl.ListFormat("fr-FR", { style: "narrow" }).format(["A", "B", "C"]), "A, B, C", "fr-FR narrow conjunction");
        assertEquals(new Intl.ListFormat("hu-HU", { style: "short" }).format(["A", "B", "C"]), "A, B & C", "hu-HU approved short conjunction");
        assertEquals(new Intl.ListFormat("hu-HU", { style: "narrow" }).format(["A", "B", "C"]), "A, B, C", "hu-HU approved narrow conjunction");
    });

    test("disjunction patterns follow the approved tables", function () {
        assertEquals(new Intl.ListFormat("en-US", { type: "disjunction" }).format(["A", "B", "C"]), "A, B, or C", "en-US disjunction");
        assertEquals(new Intl.ListFormat("en-GB", { type: "disjunction" }).format(["A", "B", "C"]), "A, B or C", "en-GB disjunction");
        assertEquals(new Intl.ListFormat("de-DE", { type: "disjunction" }).format(["A", "B", "C"]), "A, B oder C", "de-DE disjunction");
        assertEquals(new Intl.ListFormat("fr-FR", { type: "disjunction" }).format(["A", "B", "C"]), "A, B ou C", "fr-FR disjunction");
        assertEquals(new Intl.ListFormat("hu-HU", { type: "disjunction" }).format(["A", "B", "C"]), "A, B vagy C", "hu-HU disjunction");
        assertEquals(new Intl.ListFormat("hu-HU", { type: "disjunction", style: "narrow" }).format(["A", "B", "C"]), "A/B/C", "hu-HU narrow disjunction");
    });

    test("unit patterns follow the approved tables", function () {
        assertEquals(new Intl.ListFormat("en-US", { type: "unit" }).format(["A", "B", "C"]), "A, B, C", "en-US unit");
        assertEquals(new Intl.ListFormat("en-US", { type: "unit", style: "narrow" }).format(["A", "B", "C"]), "A B C", "en-US narrow unit");
        assertEquals(new Intl.ListFormat("de-DE", { type: "unit" }).format(["A", "B", "C"]), "A, B und C", "de-DE unit");
        assertEquals(new Intl.ListFormat("fr-FR", { type: "unit" }).format(["A", "B", "C"]), "A, B et C", "fr-FR unit");
        assertEquals(new Intl.ListFormat("hu-HU", { type: "unit" }).format(["A", "B", "C"]), "A, B \u00E9s C", "hu-HU unit");
        assertEquals(new Intl.ListFormat("hu-HU", { type: "unit", style: "short" }).format(["A", "B", "C"]), "A, B, C", "hu-HU short unit");
        assertEquals(new Intl.ListFormat("hu-HU", { type: "unit", style: "narrow" }).format(["A", "B", "C"]), "A B C", "hu-HU narrow unit");
    });

    test("list length edge cases remain stable", function () {
        var formatter = new Intl.ListFormat("hu-HU");

        assertEquals(formatter.format([]), "", "empty array");
        assertEquals(formatter.format(["A"]), "A", "one item");
        assertEquals(formatter.format(["A", "B"]), "A \u00E9s B", "two items");
        assertEquals(formatter.format(["A", "B", "C", "D"]), "A, B, C \u00E9s D", "four items");
    });

    test("string input is treated as a character list", function () {
        assertEquals(new Intl.ListFormat("hu-HU").format("abc"), "a, b \u00E9s c", "hu-HU string");
        assertEquals(new Intl.ListFormat("en-US", { style: "short" }).format("abc"), "a, b, & c", "en-US short string");
        assertEquals(new Intl.ListFormat("hu-HU", { type: "disjunction", style: "narrow" }).format("abc"), "a/b/c", "hu-HU narrow string");
    });

    test("input validation is intentionally narrow", function () {
        assertThrowsWith(function () {
            new Intl.ListFormat("hu-HU").format();
        }, "TypeError", "undefined list");

        assertThrowsWith(function () {
            new Intl.ListFormat("hu-HU").format({ 0: "A", 1: "B", length: 2 });
        }, "TypeError", "array-like object is not supported");

        assertThrowsWith(function () {
            new Intl.ListFormat("hu-HU").format(["A", 2]);
        }, "TypeError", "array values must be strings");

        if (typeof Set !== "undefined") {
            assertThrowsWith(function () {
                new Intl.ListFormat("hu-HU").format(new Set(["A", "B"]));
            }, "TypeError", "Set is not supported in this branch");
        }

        if (typeof Map !== "undefined") {
            assertThrowsWith(function () {
                new Intl.ListFormat("hu-HU").format(new Map([["A", 1], ["B", 2]]));
            }, "TypeError", "Map is not supported in this branch");
        }
    });

    test("unsupported options throw RangeError", function () {
        assertThrowsWith(function () {
            new Intl.ListFormat("hu-HU", { type: "bad" });
        }, "RangeError", "unsupported type");

        assertThrowsWith(function () {
            new Intl.ListFormat("hu-HU", { style: "bad" });
        }, "RangeError", "unsupported style");
    });

    writeLine("Passed: " + passed);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.ListFormat tests failed: " + failed);
    }
}());
