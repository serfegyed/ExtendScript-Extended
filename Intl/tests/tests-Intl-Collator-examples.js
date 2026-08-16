/*
 * Intl.Collator public examples for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.Collator.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;

if (isNodeRuntime) {
    Intl = undefined;

    (function () {
        global.require = require;
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.Collator.js"), "utf8"));
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

    function signOf(value) {
        return value < 0 ? "<" : (value > 0 ? ">" : "=");
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

    function showCompare(label, collator, left, right, expectedSign) {
        var actualSign = signOf(collator.compare(left, right));

        show(label, left + " " + actualSign + " " + right, left + " " + expectedSign + " " + right);
    }

    function joinValues(values) {
        var text = "";
        var index;

        for (index = 0; index < values.length; index++) {
            text += (index > 0 ? ", " : "") + values[index];
        }
        return text;
    }

    writeLine("Intl.Collator public examples");
    writeLine("-----------------------------");

    showCompare("default compare", new Intl.Collator("en-US"), "a", "b", "<");
    showCompare("sensitivity base", new Intl.Collator("en-US", { sensitivity: "base" }), "resume", "r\u00E9sum\u00E9", "=");
    showCompare("sensitivity accent", new Intl.Collator("en-US", { sensitivity: "accent" }), "resume", "r\u00E9sum\u00E9", "<");
    showCompare("accent ignores case", new Intl.Collator("en-US", { sensitivity: "accent" }), "a", "A", "=");
    showCompare("case ignores accents", new Intl.Collator("fr-FR", { sensitivity: "case" }), "e", "\u00E9", "=");
    showCompare("case keeps case", new Intl.Collator("fr-FR", { sensitivity: "case" }), "\u00E9", "\u00C9", "<");
    showCompare("caseFirst upper", new Intl.Collator("hu-HU", { sensitivity: "case", caseFirst: "upper" }), "\u0171", "\u0170", ">");
    showCompare("caseFirst lower", new Intl.Collator("hu-HU", { sensitivity: "case", caseFirst: "lower" }), "\u0171", "\u0170", "<");
    showCompare("Hungarian base keeps o-umlaut distinct", new Intl.Collator("hu-HU", { sensitivity: "base" }), "o", "\u00F6", "<");
    showCompare("Hungarian base groups double acute", new Intl.Collator("hu-HU", { sensitivity: "base" }), "\u00F6", "\u0151", "=");
    showCompare("German umlaut accent", new Intl.Collator("de-DE", { sensitivity: "accent" }), "u", "\u00FC", "<");
    showCompare("ignorePunctuation", new Intl.Collator("en-US", { ignorePunctuation: true }), "a-b", "ab", "=");
    showCompare("numeric sort", new Intl.Collator("en-US", { numeric: true }), "file2", "file10", "<");
    showCompare("numeric leading zeros", new Intl.Collator("en-US", { numeric: true }), "file02", "file2", "=");
    show("usage search", new Intl.Collator("fr-FR", { usage: "search" }).resolvedOptions().usage, "search");
    show("standard collation alias", new Intl.Collator("de-DE", { collation: "standard" }).resolvedOptions().collation, "default");
    show("numeric resolved", new Intl.Collator("hu-HU", { numeric: true }).resolvedOptions().numeric, true);
    show("caseFirst resolved", new Intl.Collator("hu-HU", { caseFirst: "upper" }).resolvedOptions().caseFirst, "upper");
    show("fallback locale", new Intl.Collator("banana").resolvedOptions().locale, "en-US");
    show("legacy locale alias", new Intl.Collator("en-UK").resolvedOptions().locale, "en-GB");

    var files = ["file10", "file2", "file1"];
    var fileCollator = new Intl.Collator("en-US", { numeric: true });
    files.sort(function (a, b) {
        return fileCollator.compare(a, b);
    });
    show("Array.sort numeric", joinValues(files), "file1, file2, file10");

    writeLine("-----------------------------");
    writeLine("Examples: " + shown);
    writeLine("Failed: " + failed);

    if (failed > 0) {
        throw new Error("Intl.Collator examples failed: " + failed);
    }
}());
