/*
 * Intl.DurationFormat public examples for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.DurationFormat.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.DurationFormat.js"), "utf8"));
    }());
}

(function () {
    var failed = 0;
    var shown = 0;
    var NBSP = "\u00A0";
    var NNBSP = "\u202F";
    var full = { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6 };

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

    writeLine("Intl.DurationFormat public examples");
    writeLine("-----------------------------------");

    show("short en-US", new Intl.DurationFormat("en-US").format(full), "1 yr, 2 mths, 3 days, 4 hr, 5 min, 6 sec");
    show("short hu-HU", new Intl.DurationFormat("hu-HU").format(full), "1 \u00E9v, 2 h\u00F3nap, 3 nap, 4 \u00F3, 5 p \u00E9s 6 mp");
    show("long en-US", new Intl.DurationFormat("en-US", { style: "long" }).format(full), "1 year, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds");
    show("long hu-HU", new Intl.DurationFormat("hu-HU", { style: "long" }).format(full), "1 \u00E9v, 2 h\u00F3nap, 3 nap, 4 \u00F3ra, 5 perc \u00E9s 6 m\u00E1sodperc");
    show("narrow en-US", new Intl.DurationFormat("en-US", { style: "narrow" }).format(full), "1y 2m 3d 4h 5m 6s");
    show("narrow hu-HU", new Intl.DurationFormat("hu-HU", { style: "narrow" }).format(full), "1 \u00E9v, 2 h., 3 nap, 4 \u00F3, 5 p \u00E9s 6 mp");
    show("digital en-US", new Intl.DurationFormat("en-US", { style: "digital" }).format(full), "1 yr, 2 mths, 3 days, 4:05:06");
    show("digital hu-HU", new Intl.DurationFormat("hu-HU", { style: "digital" }).format(full), "1 \u00E9v, 2 h\u00F3nap, 3 nap \u00E9s 4:05:06");
    show("digital milliseconds", new Intl.DurationFormat("de-DE", { style: "digital" }).format({ hours: 4, minutes: 5, seconds: 6, milliseconds: 789 }), "4:05:06,789");
    show("milliseconds fr-FR", new Intl.DurationFormat("fr-FR").format({ seconds: 1, milliseconds: 234 }), "1" + NNBSP + "s et 234" + NNBSP + "ms");
    show("weeks hu-HU", new Intl.DurationFormat("hu-HU").format({ weeks: 2, days: 3 }), "2 h\u00E9t \u00E9s 3 nap");
    show("all zero short", new Intl.DurationFormat("en-US").format({ seconds: 0 }), "");
    show("all zero digital", new Intl.DurationFormat("en-US", { style: "digital" }).format({ seconds: 0 }), "0:00:00");
    show("negative", new Intl.DurationFormat("hu-HU").format({ seconds: -2 }), "-2 mp");
    show("ISO full", new Intl.DurationFormat("hu-HU").format("P1Y2M3DT4H5M6S"), "1 \u00E9v, 2 h\u00F3nap, 3 nap, 4 \u00F3, 5 p \u00E9s 6 mp");
    show("ISO digital", new Intl.DurationFormat("en-US", { style: "digital" }).format("PT1H2M"), "1:02:00");
    show("ISO fractional", new Intl.DurationFormat("fr-FR").format("PT0.123S"), "123" + NNBSP + "ms");
    show("ISO zero", new Intl.DurationFormat("hu-HU", { style: "digital" }).format("PT0S"), "0:00:00");
    show("resolved style", new Intl.DurationFormat("hu-HU", { style: "narrow" }).resolvedOptions().style, "narrow");
    show("fallback locale", new Intl.DurationFormat("banana").resolvedOptions().locale, "en-US");
    show("legacy locale alias", new Intl.DurationFormat("en-UK").resolvedOptions().locale, "en-GB");

    writeLine("-----------------------------------");
    writeLine("Examples: " + shown);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.DurationFormat examples failed: " + failed);
    }
}());
