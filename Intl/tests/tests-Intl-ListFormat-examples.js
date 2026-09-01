/*
 * Intl.ListFormat public examples for ESTK and Node.js.
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
    var failed = 0;
    var shown = 0;

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

    writeLine("Intl.ListFormat public examples");
    writeLine("-------------------------------");

    show("hu conjunction long", new Intl.ListFormat("hu-HU").format(["alma", "k\u00F6rte", "barack"]), "alma, k\u00F6rte \u00E9s barack");
    show("hu conjunction short", new Intl.ListFormat("hu-HU", { style: "short" }).format(["alma", "k\u00F6rte", "barack"]), "alma, k\u00F6rte & barack");
    show("hu conjunction narrow", new Intl.ListFormat("hu-HU", { style: "narrow" }).format(["alma", "k\u00F6rte", "barack"]), "alma, k\u00F6rte, barack");
    show("hu disjunction long", new Intl.ListFormat("hu-HU", { type: "disjunction" }).format(["alma", "k\u00F6rte", "barack"]), "alma, k\u00F6rte vagy barack");
    show("hu disjunction narrow", new Intl.ListFormat("hu-HU", { type: "disjunction", style: "narrow" }).format(["alma", "k\u00F6rte", "barack"]), "alma/k\u00F6rte/barack");
    show("hu unit long", new Intl.ListFormat("hu-HU", { type: "unit" }).format(["1 m", "20 cm", "3 mm"]), "1 m, 20 cm \u00E9s 3 mm");
    show("hu unit short", new Intl.ListFormat("hu-HU", { type: "unit", style: "short" }).format(["1 m", "20 cm", "3 mm"]), "1 m, 20 cm, 3 mm");
    show("hu unit narrow", new Intl.ListFormat("hu-HU", { type: "unit", style: "narrow" }).format(["1 m", "20 cm", "3 mm"]), "1 m 20 cm 3 mm");
    show("en-US conjunction long", new Intl.ListFormat("en-US").format(["A", "B", "C"]), "A, B, and C");
    show("en-US conjunction short", new Intl.ListFormat("en-US", { style: "short" }).format(["A", "B", "C"]), "A, B, & C");
    show("en-GB conjunction long", new Intl.ListFormat("en-GB").format(["A", "B", "C"]), "A, B and C");
    show("de-DE conjunction", new Intl.ListFormat("de-DE").format(["A", "B", "C"]), "A, B und C");
    show("fr-FR conjunction", new Intl.ListFormat("fr-FR").format(["A", "B", "C"]), "A, B et C");
    show("string input", new Intl.ListFormat("hu-HU").format("abc"), "a, b \u00E9s c");
    show("empty list", new Intl.ListFormat("hu-HU").format([]), "");
    show("single item", new Intl.ListFormat("hu-HU").format(["A"]), "A");
    show("pair", new Intl.ListFormat("hu-HU").format(["A", "B"]), "A \u00E9s B");
    show("fallback locale", new Intl.ListFormat("banana").resolvedOptions().locale, "en-US");
    show("legacy locale alias", new Intl.ListFormat("en-UK").resolvedOptions().locale, "en-GB");
    show("supported locales", Intl.ListFormat.supportedLocalesOf(["fr-fr", "banana", "hu-hu"]).join("|"), "fr-FR|hu-HU");

    writeLine("-------------------------------");
    writeLine("Examples: " + shown);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.ListFormat examples failed: " + failed);
    }
}());
