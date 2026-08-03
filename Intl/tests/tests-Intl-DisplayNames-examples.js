/*
 * Intl.DisplayNames public examples for ESTK and Node.js.
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

    writeLine("Intl.DisplayNames public examples");
    writeLine("---------------------------------");

    show("language hu-HU", new Intl.DisplayNames("hu-HU", { type: "language" }).of("en-US"), "amerikai angol");
    show("language standard hu-HU", new Intl.DisplayNames("hu-HU", { type: "language", languageDisplay: "standard" }).of("en-US"), "angol (Egyes\u00FClt \u00C1llamok)");
    show("language alias hu-HU", new Intl.DisplayNames("hu-HU", { type: "language" }).of("en-UK"), "brit angol");
    show("language uppercase hu-HU", new Intl.DisplayNames("hu-HU", { type: "language" }).of("DE"), "n\u00E9met");
    show("language fr-FR", new Intl.DisplayNames("fr-FR", { type: "language" }).of("hu-HU"), "hongrois (Hongrie)");
    show("language de-DE", new Intl.DisplayNames("de-DE", { type: "language" }).of("fr-FR"), "Franz\u00F6sisch (Frankreich)");
    show("region hu-HU", new Intl.DisplayNames("hu-HU", { type: "region" }).of("GB"), "Egyes\u00FClt Kir\u00E1lys\u00E1g");
    show("region lowercase hu-HU", new Intl.DisplayNames("hu-HU", { type: "region" }).of("us"), "Egyes\u00FClt \u00C1llamok");
    show("region fr-FR", new Intl.DisplayNames("fr-FR", { type: "region" }).of("US"), "\u00C9tats-Unis");
    show("region de-DE", new Intl.DisplayNames("de-DE", { type: "region" }).of("HU"), "Ungarn");
    show("currency hu-HU", new Intl.DisplayNames("hu-HU", { type: "currency" }).of("HUF"), "magyar forint");
    show("currency lowercase hu-HU", new Intl.DisplayNames("hu-HU", { type: "currency" }).of("eur"), "eur\u00F3");
    show("currency fr-FR", new Intl.DisplayNames("fr-FR", { type: "currency" }).of("USD"), "dollar des \u00C9tats-Unis");
    show("currency de-DE", new Intl.DisplayNames("de-DE", { type: "currency" }).of("GBP"), "Britisches Pfund");
    show("region fallback code", new Intl.DisplayNames("hu-HU", { type: "region" }).of("IT"), "IT");
    show("region fallback none", new Intl.DisplayNames("hu-HU", { type: "region", fallback: "none" }).of("IT"), undefined);
    show("currency fallback code", new Intl.DisplayNames("hu-HU", { type: "currency" }).of("JPY"), "JPY");
    show("currency fallback none", new Intl.DisplayNames("hu-HU", { type: "currency", fallback: "none" }).of("JPY"), undefined);
    show("language fallback code", new Intl.DisplayNames("hu-HU", { type: "language" }).of("it"), "it");
    show("language fallback none", new Intl.DisplayNames("hu-HU", { type: "language", fallback: "none" }).of("it"), undefined);
    show("resolved type", new Intl.DisplayNames("hu-HU", { type: "currency" }).resolvedOptions().type, "currency");
    show("resolved languageDisplay", new Intl.DisplayNames("hu-HU", { type: "language" }).resolvedOptions().languageDisplay, "dialect");
    show("resolved fallback", new Intl.DisplayNames("hu-HU", { type: "region", fallback: "none" }).resolvedOptions().fallback, "none");
    show("localeMatcher ignored", new Intl.DisplayNames("hu-HU", { type: "region", localeMatcher: "banana" }).of("DE"), "N\u00E9metorsz\u00E1g");
    show("fallback locale", new Intl.DisplayNames("banana", { type: "region" }).resolvedOptions().locale, "en-US");
    show("legacy locale alias", new Intl.DisplayNames("en-UK", { type: "region" }).resolvedOptions().locale, "en-GB");

    writeLine("---------------------------------");
    writeLine("Examples: " + shown);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.DisplayNames examples failed: " + failed);
    }
}());
