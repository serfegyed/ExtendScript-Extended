/*
 * Intl.NumberFormat public examples for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.NumberFormat.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.NumberFormat.js"), "utf8"));
    }());
}

(function () {
    var failed = 0;
    var shown = 0;
    var NBSP = "\u00A0";

    function writeLine(message) {
        if (typeof console !== "undefined" && console.log) {
            console.log(message);
        } else if (typeof $ !== "undefined" && $.writeln) {
            $.writeln(message);
        }
    }

    function show(label, actual, expected) {
        shown++;
        if (actual !== expected) {
            failed++;
            writeLine("[FAIL] " + label);
            writeLine("       expected: " + expected);
            writeLine("       actual:   " + actual);
            return;
        }
        writeLine(label + ": " + actual);
    }

    writeLine("Intl.NumberFormat public examples");
    writeLine("---------------------------------");

    show("decimal en-US", new Intl.NumberFormat("en-US").format(1234.56), "1,234.56");
    show("decimal de-DE", new Intl.NumberFormat("de-DE").format(1234.56), "1.234,56");
    show("decimal fr-FR", new Intl.NumberFormat("fr-FR").format(1234.56), "1" + NBSP + "234,56");
    show("percent hu-HU", new Intl.NumberFormat("hu-HU", { style: "percent" }).format(0.12), "12%");
    show("percent fr-FR", new Intl.NumberFormat("fr-FR", { style: "percent" }).format(0.12), "12" + NBSP + "%");
    show("currency symbol hu-HU", new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF" }).format(1234.56), "1234,56" + NBSP + "Ft");
    show("currency code hu-HU", new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "code" }).format(1234.56), "1234,56" + NBSP + "HUF");
    show("currency name hu-HU", new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", currencyDisplay: "name" }).format(1234.56), "1234,56 magyar forint");
    show("minimumIntegerDigits", new Intl.NumberFormat("en-US", { minimumIntegerDigits: 3 }).format(7), "007");
    show("signDisplay always", new Intl.NumberFormat("en-US", { signDisplay: "always" }).format(12), "+12");
    show("signDisplay never", new Intl.NumberFormat("en-US", { signDisplay: "never" }).format(-12), "12");
    show("accounting en-US", new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", currencySign: "accounting" }).format(-1234.56), "($1,234.56)");
    show("trailingZeroDisplay", new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", trailingZeroDisplay: "stripIfInteger" }).format(1), "\u20AC1");
    show("formatRange hu-HU", new Intl.NumberFormat("hu-HU").formatRange(1, 2), "1\u20132");
    show("formatRange same rounded", new Intl.NumberFormat("en-US").formatRange(1.2344, 1.23449), "~1.234");
    show("combined options", new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", currencySign: "accounting", trailingZeroDisplay: "stripIfInteger" }).format(-1), "(\u20AC1)");

    writeLine("---------------------------------");
    writeLine("Examples: " + shown);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.NumberFormat examples failed: " + failed);
    }
}());
