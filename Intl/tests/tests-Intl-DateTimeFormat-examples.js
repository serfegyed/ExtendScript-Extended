/*
 * Intl.DateTimeFormat public examples for ESTK and Node.js.
 */
//@include "../../Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.DateTimeFormat.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.DateTimeFormat.js"), "utf8"));
    }());
}

(function () {
    var failed = 0;
    var shown = 0;
    var sample = new Date(2026, 6, 15, 5, 6, 7, 123);
    var noon = new Date(2026, 6, 15, 12, 34, 56, 987);
    var midnight = new Date(2026, 6, 15, 0, 5, 6, 9);

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

    function partsText(parts) {
        var text = "";
        var index;

        for (index = 0; index < parts.length; index++) {
            text += parts[index].type + "=" + parts[index].value;
            if (index < parts.length - 1) {
                text += "|";
            }
        }
        return text;
    }

    writeLine("Intl.DateTimeFormat public examples");
    writeLine("-----------------------------------");

    show("default en-US", new Intl.DateTimeFormat("en-US").format(noon), "7/15/2026");
    show("default en-GB", new Intl.DateTimeFormat("en-GB").format(noon), "15/07/2026");
    show("default de-DE", new Intl.DateTimeFormat("de-DE").format(noon), "15.7.2026");
    show("default fr-FR", new Intl.DateTimeFormat("fr-FR").format(noon), "15/07/2026");
    show("default hu-HU", new Intl.DateTimeFormat("hu-HU").format(noon), "2026. 07. 15.");
    show("long month hu-HU", new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", day: "numeric" }).format(noon), "2026. j\u00FAlius 15.");
    show("weekday de-DE", new Intl.DateTimeFormat("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(noon), "Mittwoch, 15. Juli 2026");
    show("time en-US", new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", second: "numeric" }).format(sample), "5:06:07 AM");
    show("time hu-HU", new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", second: "numeric" }).format(sample), "5:06:07");
    show("date and time fr-FR", new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).format(noon), "15/07/2026 12:34:56");
    show("hour12 en-GB", new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", hour12: true }).format(sample), "5:06 am");
    show("hour12 hu-HU", new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", hour12: true }).format(sample), "de. 5:06");
    show("hourCycle h11", new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hourCycle: "h11" }).format(midnight), "0:05 AM");
    show("hourCycle h24", new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", hourCycle: "h24" }).format(midnight), "24:05");
    show("fractional en-US", new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: 3 }).format(sample), "5:06:07.123 AM");
    show("fractional hu-HU", new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: 2 }).format(noon), "12:34:56,98");
    show("second only fr-FR", new Intl.DateTimeFormat("fr-FR", { second: "numeric", fractionalSecondDigits: 3 }).format(sample), "7,123");
    show("Temporal-like date", new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" }).format({ year: 2026, month: 1, day: 2 }), "Jan 02");
    show("Temporal-like time", new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", second: "numeric" }).format({ hour: 5, minute: 6, second: 7 }), "5:06:07");
    show("formatRange hu-HU", new Intl.DateTimeFormat("hu-HU").formatRange(noon, new Date(2026, 6, 16, 12, 34, 56, 987)), "2026. 07. 15.\u20132026. 07. 16.");
    show("formatRange time", new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric" }).formatRange({ hour: 5, minute: 6 }, { hour: 7, minute: 8 }), "5:06\u20137:08");
    show("formatToParts YearMonth", partsText(new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "2-digit" }).formatToParts({ year: 2026, month: 7, day: 1 })), "year=2026|literal=. |month=07|literal=.");
    show("legacy locale alias", new Intl.DateTimeFormat("en-UK").resolvedOptions().locale, "en-GB");

    writeLine("-----------------------------------");
    writeLine("Examples: " + shown);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.DateTimeFormat examples failed: " + failed);
    }
}());
