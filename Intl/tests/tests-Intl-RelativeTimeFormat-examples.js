/*
 * Intl.RelativeTimeFormat public examples for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.PluralRules.js"
//@include "../Intl.RelativeTimeFormat.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        global.require = require;
        var fs = require("fs");
        var path = require("path");
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.PluralRules.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.RelativeTimeFormat.js"), "utf8"));
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

    writeLine("Intl.RelativeTimeFormat public examples");
    writeLine("--------------------------------------");

    show("en long past", new Intl.RelativeTimeFormat("en-US").format(-3, "day"), "3 days ago");
    show("en long future", new Intl.RelativeTimeFormat("en-US").format(1, "year"), "in 1 year");
    show("en short", new Intl.RelativeTimeFormat("en-US", { style: "short" }).format(-2, "minute"), "2 min. ago");
    show("en narrow", new Intl.RelativeTimeFormat("en-US", { style: "narrow" }).format(2, "week"), "+2w");
    show("en auto yesterday", new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(-1, "day"), "yesterday");
    show("en auto tomorrow", new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(1, "day"), "tomorrow");
    show("en auto minus two stays numeric", new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(-2, "day"), "2 days ago");
    show("en-GB short", new Intl.RelativeTimeFormat("en-GB", { style: "short" }).format(-2, "second"), "2 sec ago");
    show("de long past", new Intl.RelativeTimeFormat("de-DE").format(-2, "month"), "vor 2 Monaten");
    show("de short future", new Intl.RelativeTimeFormat("de-DE", { style: "short" }).format(1, "second"), "in 1 Sek.");
    show("de auto vorgestern", new Intl.RelativeTimeFormat("de-DE", { numeric: "auto" }).format(-2, "day"), "vorgestern");
    show("de auto uebermorgen", new Intl.RelativeTimeFormat("de-DE", { numeric: "auto" }).format(2, "day"), "\u00FCbermorgen");
    show("fr long future", new Intl.RelativeTimeFormat("fr-FR").format(1, "hour"), "dans 1 heure");
    show("fr short NBSP", new Intl.RelativeTimeFormat("fr-FR", { style: "short" }).format(2, "hour"), "dans 2\u00A0h");
    show("fr narrow past", new Intl.RelativeTimeFormat("fr-FR", { style: "narrow" }).format(-2, "year"), "-2 a");
    show("fr auto avant-hier", new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" }).format(-2, "day"), "avant-hier");
    show("fr auto apres-demain", new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" }).format(2, "day"), "apr\u00E8s-demain");
    show("hu long past", new Intl.RelativeTimeFormat("hu-HU").format(-2, "second"), "2 m\u00E1sodperccel ezel\u0151tt");
    show("hu long future", new Intl.RelativeTimeFormat("hu-HU").format(2, "month"), "2 h\u00F3nap m\u00FAlva");
    show("hu short past", new Intl.RelativeTimeFormat("hu-HU", { style: "short" }).format(-2, "day"), "2 napja");
    show("hu narrow past", new Intl.RelativeTimeFormat("hu-HU", { style: "narrow" }).format(-2, "week"), "2 hete");
    show("hu narrow future", new Intl.RelativeTimeFormat("hu-HU", { style: "narrow" }).format(3, "hour"), "3 \u00F3 m\u00FAlva");
    show("hu auto tegnapelott", new Intl.RelativeTimeFormat("hu-HU", { numeric: "auto" }).format(-2, "day"), "tegnapel\u0151tt");
    show("hu auto holnaputan", new Intl.RelativeTimeFormat("hu-HU", { numeric: "auto" }).format(2, "day"), "holnaput\u00E1n");
    show("plural unit alias", new Intl.RelativeTimeFormat("en-US").format(2, "days"), "in 2 days");
    show("string number", new Intl.RelativeTimeFormat("hu-HU").format("1", "day"), "1 nap m\u00FAlva");
    show("negative zero", new Intl.RelativeTimeFormat("hu-HU").format("-0", "day"), "0 nappal ezel\u0151tt");
    show("fallback locale", new Intl.RelativeTimeFormat("banana").resolvedOptions().locale, "en-US");
    show("legacy locale alias", new Intl.RelativeTimeFormat("en-UK").resolvedOptions().locale, "en-GB");
    show("supported locales", Intl.RelativeTimeFormat.supportedLocalesOf(["fr-fr", "banana", "hu-hu"]).join("|"), "fr-FR|hu-HU");

    writeLine("--------------------------------");
    writeLine("Examples: " + shown);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.RelativeTimeFormat examples failed: " + failed);
    }
}());