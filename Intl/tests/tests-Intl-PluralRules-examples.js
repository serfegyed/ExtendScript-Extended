/*
 * Intl.PluralRules public examples for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.PluralRules.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.PluralRules.js"), "utf8"));
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

    writeLine("Intl.PluralRules public examples");
    writeLine("--------------------------------");

    show("en cardinal 1", new Intl.PluralRules("en-US").select(1), "one");
    show("en cardinal 2", new Intl.PluralRules("en-US").select(2), "other");
    show("en cardinal -1", new Intl.PluralRules("en-US").select(-1), "one");
    show("en ordinal 1", new Intl.PluralRules("en-US", { type: "ordinal" }).select(1), "one");
    show("en ordinal 2", new Intl.PluralRules("en-US", { type: "ordinal" }).select(2), "two");
    show("en ordinal 3", new Intl.PluralRules("en-US", { type: "ordinal" }).select(3), "few");
    show("en ordinal 11", new Intl.PluralRules("en-US", { type: "ordinal" }).select(11), "other");
    show("en ordinal 21", new Intl.PluralRules("en-US", { type: "ordinal" }).select(21), "one");
    show("de cardinal 1", new Intl.PluralRules("de-DE").select(1), "one");
    show("de ordinal 1", new Intl.PluralRules("de-DE", { type: "ordinal" }).select(1), "other");
    show("fr cardinal 0", new Intl.PluralRules("fr-FR").select(0), "one");
    show("fr cardinal 1.5", new Intl.PluralRules("fr-FR").select(1.5), "one");
    show("fr cardinal 2", new Intl.PluralRules("fr-FR").select(2), "other");
    show("fr cardinal million", new Intl.PluralRules("fr-FR").select(1000000), "many");
    show("fr ordinal 1", new Intl.PluralRules("fr-FR", { type: "ordinal" }).select(1), "one");
    show("hu cardinal 1", new Intl.PluralRules("hu-HU").select(1), "one");
    show("hu cardinal 2", new Intl.PluralRules("hu-HU").select(2), "other");
    show("hu ordinal 5", new Intl.PluralRules("hu-HU", { type: "ordinal" }).select(5), "one");
    show("hu ordinal 6", new Intl.PluralRules("hu-HU", { type: "ordinal" }).select(6), "other");
    show("string input", new Intl.PluralRules("hu-HU").select("1"), "one");
    show("NaN input", new Intl.PluralRules("hu-HU").select(NaN), "other");
    show("resolved categories", new Intl.PluralRules("en-US", { type: "ordinal" }).resolvedOptions().pluralCategories.join("|"), "one|two|few|other");
    show("fallback locale", new Intl.PluralRules("banana").resolvedOptions().locale, "en-US");
    show("legacy locale alias", new Intl.PluralRules("en-UK").resolvedOptions().locale, "en-GB");
    show("supported locales", Intl.PluralRules.supportedLocalesOf(["fr-fr", "banana", "hu-hu"]).join("|"), "fr-FR|hu-HU");

    writeLine("--------------------------------");
    writeLine("Examples: " + shown);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.PluralRules examples failed: " + failed);
    }
}());
