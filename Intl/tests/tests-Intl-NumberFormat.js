/*
 * Intl.NumberFormat subset tests for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.NumberFormat.js"

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
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.NumberFormat.js"), "utf8"));
    }());
}

(function () {
    var passed = 0;
    var failed = 0;
    var NBSP = "\u00A0";
    var INFINITY = "\u221E";

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

    writeLine("Intl.NumberFormat subset tests");
    writeLine("------------------------------");

    test("constructor works with and without new", function () {
        var withNew = new Intl.NumberFormat("de-DE");
        var withoutNew = Intl.NumberFormat("de-DE");

        assert(withNew instanceof Intl.NumberFormat, "new should create NumberFormat");
        assert(withoutNew instanceof Intl.NumberFormat, "call should create NumberFormat");
        assertEquals(withNew.format(1234.56), "1.234,56", "new formatter output");
        assertEquals(withoutNew.format(1234.56), "1.234,56", "called formatter output");
    });

    test("supportedLocalesOf reports implemented locales", function () {
        assertEquals(typeof Intl.NumberFormat.supportedLocalesOf, "function", "static method exists");
        assertEquals(Intl.NumberFormat.supportedLocalesOf(["hu-hu", "banana", "en-UK", "hu-HU"], { localeMatcher: "lookup" }).join("|"), "hu-HU|en-GB", "filters supported locales");
        assertEquals(Intl.NumberFormat.supportedLocalesOf("fr-fr", { localeMatcher: "best fit" }).join("|"), "fr-FR", "string locale");
        assertEquals(Intl.NumberFormat.supportedLocalesOf(undefined).join("|"), "", "undefined locales");

        assertThrowsWith(function () {
            Intl.NumberFormat.supportedLocalesOf(["en-US"], { localeMatcher: "bad" });
        }, "RangeError", "unsupported localeMatcher");
    });

    test("decimal formatting follows Node-observed core cases", function () {
        assertEquals(new Intl.NumberFormat("en-US").format(1234.56), "1,234.56", "en-US decimal");
        assertEquals(new Intl.NumberFormat("en-GB").format(1234.56), "1,234.56", "en-GB decimal");
        assertEquals(new Intl.NumberFormat("de-DE").format(1234.56), "1.234,56", "de-DE decimal");
        assertEquals(new Intl.NumberFormat("fr-FR").format(1234.56), "1" + NBSP + "234,56", "fr-FR NBSP grouping");
        assertEquals(new Intl.NumberFormat("hu-HU").format(1234567.89), "1" + NBSP + "234" + NBSP + "567,89", "hu-HU NBSP grouping");
        assertEquals(new Intl.NumberFormat("de-DE").format(-1234.5), "-1.234,5", "negative decimal");
    });

    test("fraction digits and grouping options are applied", function () {
        assertEquals(new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(1.2345), "1.23", "maximumFractionDigits rounds down");
        assertEquals(new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(1.005), "1.01", "maximumFractionDigits half expand");
        assertEquals(new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(1.2), "1.20", "minimumFractionDigits pads");
        assertEquals(new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(1.2345), "1.235", "min and max fraction digits");
        assertEquals(new Intl.NumberFormat("en-US", { useGrouping: false }).format(1234567.89), "1234567.89", "disable grouping");
    });

    test("NaN and infinities are formatted", function () {
        assertEquals(new Intl.NumberFormat("en-US").format(NaN), "NaN", "NaN");
        assertEquals(new Intl.NumberFormat("en-US").format(Infinity), INFINITY, "Infinity");
        assertEquals(new Intl.NumberFormat("en-US").format(-Infinity), "-" + INFINITY, "negative Infinity");
    });

    test("resolvedOptions exposes the supported subset", function () {
        var options = new Intl.NumberFormat("hu-hu", {
            numberingSystem: "latn",
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
            useGrouping: false
        }).resolvedOptions();

        assertEquals(options.locale, "hu-HU", "locale");
        assertEquals(options.numberingSystem, "latn", "numberingSystem");
        assertEquals(options.style, "decimal", "style");
        assertEquals(options.minimumFractionDigits, 2, "minimumFractionDigits");
        assertEquals(options.maximumFractionDigits, 4, "maximumFractionDigits");
        assertEquals(options.useGrouping, false, "useGrouping");
    });

    test("edge cases follow the approved decimal subset", function () {
        assertEquals(new Intl.NumberFormat("en-US").format("1234.5"), "1,234.5", "numeric string input");
        assertEquals(new Intl.NumberFormat("en-US").format(true), "1", "true coerces to one");
        assertEquals(new Intl.NumberFormat("en-US").format(false), "0", "false coerces to zero");
        assertEquals(new Intl.NumberFormat("en-US").format(null), "0", "null coerces to zero");
        if (isNodeRuntime) {
            assertEquals(new Intl.NumberFormat("en-US").format(-0), "-0", "negative zero follows Node");
        }
        assertEquals(new Intl.NumberFormat("en-US").format(0.0004), "0", "small fraction rounds to zero");
        assertEquals(new Intl.NumberFormat("en-US").format(0.0005), "0.001", "small fraction half expands");
        assertEquals(new Intl.NumberFormat("en-US").format(999.9999), "1,000", "rounding carries into grouping");
        assertEquals(new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(999.995), "1,000", "rounding carry with explicit max fraction digits");
        assertEquals(new Intl.NumberFormat("de-DE").format(1234567890.12), "1.234.567.890,12", "large grouped number");
        assertEquals(new Intl.NumberFormat("banana").format(1234.5), "1,234.5", "unsupported locale uses subset fallback");
        assertEquals(new Intl.NumberFormat("en-UK").resolvedOptions().locale, "en-GB", "legacy en-UK alias resolves to en-GB");
        assertEquals(new Intl.NumberFormat("en-US", { minimumFractionDigits: "2" }).format(1.2), "1.20", "fraction digit string coerces");
        assertEquals(new Intl.NumberFormat("en-US", { maximumFractionDigits: 2.9 }).resolvedOptions().maximumFractionDigits, 2, "fraction digit option truncates");
        assertEquals(new Intl.NumberFormat("en-US", { useGrouping: "false" }).format(1234.5), "1,234.5", "string false useGrouping falls back to auto");
        assertEquals(new Intl.NumberFormat("en-US", { useGrouping: "true" }).format(1234.5), "1,234.5", "string true useGrouping falls back to auto");
    });
    test("percent style formats the supported locales", function () {
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent" }).format(0.12), "12%", "en-US percent");
        assertEquals(new Intl.NumberFormat("en-GB", { style: "percent" }).format(0.12), "12%", "en-GB percent");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "percent" }).format(0.12), "12" + NBSP + "%", "de-DE percent NBSP");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "percent" }).format(0.12), "12" + NBSP + "%", "fr-FR percent NBSP");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "percent" }).format(0.12), "12%", "hu-HU percent");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent" }).format(0.1234), "12%", "percent default max fraction digits");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(0.1234), "12.3%", "percent explicit max fraction digits");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 2 }).format(0.1), "10.00%", "percent min fraction also sets default max");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "percent" }).format(12.345), "1.235" + NBSP + "%", "percent grouping after scaling");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent" }).format(NaN), "NaN%", "percent NaN");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent" }).format(Infinity), INFINITY + "%", "percent Infinity");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent" }).format(-Infinity), "-" + INFINITY + "%", "percent negative Infinity");
    });
    test("currency style formats the supported currencies", function () {
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(1234.56), "\u20AC1,234.56", "en-US EUR");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(1234.56), "$1,234.56", "en-US USD");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "GBP" }).format(1234.56), "\u00A31,234.56", "en-US GBP");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "HUF" }).format(1234.56), "HUF1,234.56", "en-US HUF");
        assertEquals(new Intl.NumberFormat("en-GB", { style: "currency", currency: "USD" }).format(1234.56), "US$1,234.56", "en-GB USD");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(1234.56), "1.234,56" + NBSP + "\u20AC", "de-DE EUR");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "currency", currency: "HUF" }).format(1234.56), "1.234,56" + NBSP + "HUF", "de-DE HUF");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD" }).format(1234.56), "1" + NBSP + "234,56" + NBSP + "$US", "fr-FR USD");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GBP" }).format(1234.56), "1" + NBSP + "234,56" + NBSP + "\u00A3GB", "fr-FR GBP");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "eur" }).format(1234.56), "1234,56" + NBSP + "EUR", "hu-HU lowercase EUR normalizes");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF" }).format(1234.56), "1234,56" + NBSP + "Ft", "hu-HU HUF symbol and fraction range");
    });

    test("currency resolvedOptions and validation follow the supported subset", function () {
        var options = new Intl.NumberFormat("hu-HU", { style: "currency", currency: "huf" }).resolvedOptions();

        assertEquals(options.style, "currency", "style");
        assertEquals(options.currency, "HUF", "currency uppercase");
        assertEquals(options.currencyDisplay, "symbol", "currencyDisplay");
        assertEquals(options.minimumFractionDigits, 0, "HUF min fraction digits");
        assertEquals(options.maximumFractionDigits, 2, "HUF max fraction digits");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", minimumFractionDigits: 2 }).format(1234), "1234,00" + NBSP + "Ft", "explicit HUF min fraction digits");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { style: "currency" });
        }, "RangeError", "currency is required");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { style: "currency", currency: "banana" });
        }, "RangeError", "unsupported currency code");


    });
    test("currencyDisplay code uses currency codes", function () {
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencyDisplay: "code" }).format(1234.56), "EUR1,234.56", "en-US EUR code");
        assertEquals(new Intl.NumberFormat("en-GB", { style: "currency", currency: "USD", currencyDisplay: "code" }).format(1234.56), "USD1,234.56", "en-GB USD code");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "currency", currency: "GBP", currencyDisplay: "code" }).format(1234.56), "1.234,56" + NBSP + "GBP", "de-DE GBP code");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "currency", currency: "HUF", currencyDisplay: "code" }).format(1234.56), "1" + NBSP + "234,56" + NBSP + "HUF", "fr-FR HUF code");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "code" }).format(1234.56), "1234,56" + NBSP + "HUF", "hu-HU HUF code");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "code" }).resolvedOptions().currencyDisplay, "code", "resolved currencyDisplay code");
    });
    test("minimumIntegerDigits pads before grouping", function () {
        assertEquals(new Intl.NumberFormat("en-US", { minimumIntegerDigits: 3 }).format(7), "007", "decimal integer padding");
        assertEquals(new Intl.NumberFormat("de-DE", { minimumIntegerDigits: 3 }).format(7.5), "007,5", "decimal padding with fraction");
        assertEquals(new Intl.NumberFormat("hu-HU", { minimumIntegerDigits: 6 }).format(1234), "001" + NBSP + "234", "hu-HU padding before grouping");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent", minimumIntegerDigits: 3 }).format(0.12), "012%", "percent integer padding");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", minimumIntegerDigits: 3 }).format(1), "\u20AC001.00", "currency integer padding");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "name", minimumIntegerDigits: 3 }).format(1), "001 magyar forint", "currency name integer padding");
        assertEquals(new Intl.NumberFormat("en-US", { minimumIntegerDigits: 3.9 }).resolvedOptions().minimumIntegerDigits, 3, "minimumIntegerDigits truncates");
        assertEquals(new Intl.NumberFormat("en-US", { minimumIntegerDigits: "3" }).format(7), "007", "minimumIntegerDigits string coerces");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { minimumIntegerDigits: 0 });
        }, "RangeError", "minimumIntegerDigits too small");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { minimumIntegerDigits: 22 });
        }, "RangeError", "minimumIntegerDigits too large");
    });

    test("signDisplay controls positive and negative signs", function () {
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "auto" }).format(-2), "-2", "auto keeps negative sign");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "auto" }).format(2), "2", "auto omits positive sign");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "always" }).format(-2), "-2", "always keeps negative sign");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "always" }).format(0), "+0", "always adds positive zero sign");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "always" }).format(2), "+2", "always adds positive sign");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "exceptZero" }).format(-2), "-2", "exceptZero keeps negative sign");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "exceptZero" }).format(0), "0", "exceptZero omits zero sign");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "exceptZero" }).format(2), "+2", "exceptZero adds positive sign");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "never" }).format(-2), "2", "never strips negative sign");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "percent", signDisplay: "always" }).format(2), "+200%", "percent signDisplay");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", signDisplay: "always" }).format(-1), "-\u20AC1.00", "currency signDisplay negative");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "name", signDisplay: "always" }).format(1), "+1 magyar forint", "currency name signDisplay positive");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "always" }).resolvedOptions().signDisplay, "always", "resolved signDisplay");
        if (isNodeRuntime) {
            assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "always" }).format(-0), "-0", "negative zero follows Node for signDisplay always");
            assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "exceptZero" }).format(-0), "0", "negative zero exceptZero follows Node");
        }

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { signDisplay: "bad" });
        }, "RangeError", "unsupported signDisplay value");
    });

    test("currencySign accounting formats supported currency negatives", function () {
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "accounting" }).format(-1234.56), "(\u20AC1,234.56)", "en-US accounting EUR");
        assertEquals(new Intl.NumberFormat("en-GB", { style: "currency", currency: "USD", currencySign: "accounting" }).format(-1234.56), "(US$1,234.56)", "en-GB accounting USD");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GBP", currencySign: "accounting" }).format(-1234.56), "(1" + NBSP + "234,56" + NBSP + "\u00A3GB)", "fr-FR accounting GBP");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", currencySign: "accounting" }).format(-1234.56), "-1.234,56" + NBSP + "\u20AC", "de-DE accounting remains standard shape");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencySign: "accounting" }).format(-1234.56), "-1234,56" + NBSP + "Ft", "hu-HU accounting remains standard shape");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "accounting" }).format(1234.56), "\u20AC1,234.56", "positive accounting is unchanged");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "accounting", signDisplay: "always" }).format(1), "+\u20AC1.00", "accounting with signDisplay always positive");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "accounting", signDisplay: "never" }).format(-1), "\u20AC1.00", "signDisplay never wins over accounting");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "accounting" }).resolvedOptions().currencySign, "accounting", "resolved currencySign accounting");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "bad" });
        }, "RangeError", "unsupported currencySign value");
    });

    test("currencyDisplay name uses the minimal currency name table", function () {
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencyDisplay: "name" }).format(1), "1.00 euros", "en-US EUR name");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "HUF", currencyDisplay: "name" }).format(1), "1 Hungarian forint", "en-US HUF singular name");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "HUF", currencyDisplay: "name" }).format(2), "2 Hungarian forints", "en-US HUF plural name");
        assertEquals(new Intl.NumberFormat("en-GB", { style: "currency", currency: "USD", currencyDisplay: "name" }).format(2), "2.00 US dollars", "en-GB USD name");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", currencyDisplay: "name" }).format(1234.56), "1.234,56 Euro", "de-DE EUR name");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "currency", currency: "HUF", currencyDisplay: "name" }).format(1), "1 Ungarischer Forint", "de-DE HUF singular name");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "currency", currency: "HUF", currencyDisplay: "name" }).format(2), "2 Ungarische Forint", "de-DE HUF plural name");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD", currencyDisplay: "name" }).format(1), "1,00 dollar des \u00C9tats-Unis", "fr-FR USD singular name");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD", currencyDisplay: "name" }).format(2), "2,00 dollars des \u00C9tats-Unis", "fr-FR USD plural name");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", currencyDisplay: "name" }).format(0), "0,00 euro", "fr-FR zero uses singular name");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "EUR", currencyDisplay: "name" }).format(1234.56), "1234,56 eur\u00F3", "hu-HU EUR name");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "USD", currencyDisplay: "name" }).format(2), "2,00 USA-doll\u00E1r", "hu-HU USD name");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "name" }).format(2), "2 magyar forint", "hu-HU HUF name");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "name" }).resolvedOptions().currencyDisplay, "name", "resolved currencyDisplay name");
    });
    test("trailingZeroDisplay strips integer fraction zeros", function () {
        assertEquals(new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger" }).format(1), "1", "decimal integer strips zeros");
        assertEquals(new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger" }).format(1.5), "1.50", "decimal non-integer keeps zeros");
        assertEquals(new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger" }).format(1), "1", "de-DE integer strips zeros");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger" }).format(0.1), "10%", "percent integer strips zeros");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger" }).format(0.105), "10.50%", "percent non-integer keeps zeros");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", trailingZeroDisplay: "stripIfInteger" }).format(1), "\u20AC1", "currency integer strips zeros");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", trailingZeroDisplay: "stripIfInteger" }).format(1.5), "\u20AC1.50", "currency non-integer keeps zeros");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "name", minimumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger" }).format(1), "1 magyar forint", "currency name integer strips zeros");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "name", minimumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger" }).format(1.5), "1,50 magyar forint", "currency name non-integer keeps zeros");
        assertEquals(new Intl.NumberFormat("en-US", { trailingZeroDisplay: "stripIfInteger" }).resolvedOptions().trailingZeroDisplay, "stripIfInteger", "resolved trailingZeroDisplay");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { trailingZeroDisplay: "bad" });
        }, "RangeError", "unsupported trailingZeroDisplay value");
    });

    test("formatRange joins formatted endpoints with an en dash", function () {
        assertEquals(new Intl.NumberFormat("en-US").formatRange(1, 2), "1\u20132", "en-US decimal range");
        assertEquals(new Intl.NumberFormat("de-DE").formatRange(1234.5, 2345.6), "1.234,5\u20132.345,6", "de-DE decimal range");
        assertEquals(new Intl.NumberFormat("hu-HU").formatRange(1, 2), "1\u20132", "hu-HU range uses en dash without spaces");
        assertEquals(new Intl.NumberFormat("hu-HU").formatRange(1, 1), "~1", "same formatted endpoints use approximate marker");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "percent" }).formatRange(0.1, 0.2), "10%\u201320%", "hu-HU percent range");
        assertEquals(new Intl.NumberFormat("de-DE", { style: "percent" }).formatRange(0.1, 0.2), "10" + NBSP + "%\u201320" + NBSP + "%", "de-DE percent range");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).formatRange(1, 2), "\u20AC1.00\u2013\u20AC2.00", "en-US currency range");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF" }).formatRange(1, 2), "1" + NBSP + "Ft\u20132" + NBSP + "Ft", "hu-HU currency range");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "code" }).formatRange(1, 2), "1" + NBSP + "HUF\u20132" + NBSP + "HUF", "hu-HU currency code range");
        assertEquals(new Intl.NumberFormat("en-US").formatRange(Infinity, 2), INFINITY + "\u20132", "Infinity range endpoint");
        assertEquals(new Intl.NumberFormat("en-US").formatRange(1.2344, 1.23449), "~1.234", "same rounded decimal endpoints use approximate marker");
        assertEquals(new Intl.NumberFormat("en-US", { style: "percent" }).formatRange(0.101, 0.104), "~10%", "same rounded percent endpoints use approximate marker");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF" }).formatRange(1.001, 1.004), "~1" + NBSP + "Ft", "same rounded currency endpoints use approximate marker");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US").formatRange(NaN, 2);
        }, "RangeError", "NaN range endpoint should throw");
    });
    test("combined option edge cases remain stable", function () {
        assertEquals(new Intl.NumberFormat("en-US", { minimumIntegerDigits: 3, signDisplay: "always" }).format(7), "+007", "minimumIntegerDigits combines with signDisplay");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "accounting", trailingZeroDisplay: "stripIfInteger" }).format(-1), "(\u20AC1)", "accounting combines with trailingZeroDisplay");
        assertEquals(new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "accounting", signDisplay: "never", trailingZeroDisplay: "stripIfInteger" }).format(-1), "\u20AC1", "signDisplay never wins in combined currency options");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "name", minimumIntegerDigits: 3, trailingZeroDisplay: "stripIfInteger" }).format(1), "001 magyar forint", "currency name combines padding and stripped zeros");
        assertEquals(new Intl.NumberFormat("hu-HU", { style: "percent", signDisplay: "always", minimumIntegerDigits: 3 }).format(0.12), "+012%", "percent combines signDisplay and padding");
        assertEquals(new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, trailingZeroDisplay: "stripIfInteger" }).formatRange(1, 1.004), "~1", "formatRange uses stripped formatted endpoints");
        assertEquals(new Intl.NumberFormat("en-US", { signDisplay: "always" }).formatRange(1, 2), "+1\u2013+2", "formatRange keeps signDisplay on both endpoints");
        assertEquals(new Intl.NumberFormat("en-US", { minimumIntegerDigits: 3 }).formatRange("1", "2"), "001\u2013002", "formatRange coerces string endpoints");
        assertEquals(new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD", currencyDisplay: "name", signDisplay: "always" }).format(-2), "-2,00 dollars des \u00C9tats-Unis", "fr-FR currency name combines signDisplay");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { style: "unit" });
        }, "RangeError", "unit remains unsupported");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencyDisplay: "narrowSymbol" });
        }, "RangeError", "unsupported currencyDisplay remains rejected");
    });

    test("unsupported options throw RangeError", function () {


        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { style: "unit" });
        }, "RangeError", "unit style is not supported yet");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { numberingSystem: "arab" });
        }, "RangeError", "non-latn numbering system is not supported");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { minimumFractionDigits: 101 });
        }, "RangeError", "minimumFractionDigits out of range");

        assertThrowsWith(function () {
            new Intl.NumberFormat("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 2 });
        }, "RangeError", "maximumFractionDigits below minimumFractionDigits");
    });

    writeLine("Passed: " + passed);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.NumberFormat tests failed: " + failed);
    }
}());
