//@include "../Tools/Console/console.js"

var IntlAllTests = (function () {
    var originalLog = console.log;
    var records = [];
    var currentName = "";
    var currentLines = [];
    var isNodeRuntime = typeof require === "function" &&
        typeof process !== "undefined" && process.versions && process.versions.node;

    function joinArguments(args) {
        var message = "";
        var i;

        for (i = 0; i < args.length; i++) {
            message += (i > 0 ? " " : "") + String(args[i]);
        }

        return message;
    }

    function readLastNumber(text, label) {
        var expression = new RegExp(label + "\\s*:\\s*(\\d+)", "g");
        var match;
        var value = null;

        while ((match = expression.exec(text)) !== null) {
            value = Number(match[1]);
        }

        return value;
    }

    function recordResult(name, text, error) {
        var passed = readLastNumber(text, "Passed");
        var failed = readLastNumber(text, "Failed");
        var examples = readLastNumber(text, "Examples");
        var hasResult = passed !== null || failed !== null || examples !== null;

        if (passed === null && examples !== null) {
            passed = examples;
        }
        if (passed === null) passed = 0;
        if (failed === null) failed = 0;
        if (error && failed === 0) failed = 1;

        records.push({
            name: name,
            passed: passed,
            failed: failed,
            hasResult: hasResult,
            output: text,
            error: error ? String(error) : ""
        });
    }

    console.log = function () {
        var message = joinArguments(arguments);
        currentLines.push(message);
        originalLog.apply(console, arguments);
    };

    function runNodeTest(name, filename) {
        var childProcess = require("child_process");
        var path = require("path");
        var output = "";
        var errorText = "";

        originalLog("========================================");
        originalLog("Running: " + name);

        try {
            output = childProcess.execFileSync(process.execPath, [path.join(__dirname, "tests", filename)], { encoding: "utf8" });
            if (output) {
                originalLog(output.replace(/\s+$/, ""));
            }
            recordResult(name, output, null);
        } catch (error) {
            output = error.stdout ? String(error.stdout) : "";
            errorText = error.stderr ? String(error.stderr) : String(error);
            if (output) {
                originalLog(output.replace(/\s+$/, ""));
            }
            if (errorText) {
                originalLog(errorText.replace(/\s+$/, ""));
            }
            recordResult(name, output + "\n" + errorText, error);
        }
    }

    return {
        isNodeRuntime: isNodeRuntime,

        begin: function (name) {
            currentName = name;
            currentLines = [];
            originalLog("========================================");
            originalLog("Running: " + name);
        },

        end: function (error) {
            recordResult(currentName, currentLines.join("\n"), error);
        },

        runNodeTest: runNodeTest,

        printSummary: function () {
            var totalPassed = 0;
            var totalFailed = 0;
            var record;
            var lines;
            var start;
            var lineIndex;
            var i;

            console.log = originalLog;
            originalLog("");
            originalLog("Intl all tests summary");
            originalLog("========================================");

            for (i = 0; i < records.length; i++) {
                record = records[i];
                totalPassed += record.passed;
                totalFailed += record.failed;
                originalLog(
                    record.name + ": Passed=" + record.passed +
                    ", Failed=" + record.failed
                );

                if (!record.hasResult) {
                    originalLog("  NO RESULT: the harness did not print Passed/Failed or Examples/Failed.");
                }
                if (record.error) {
                    originalLog("  Error: " + record.error);
                }
                if (!record.hasResult || record.failed > 0 || record.error) {
                    lines = record.output.split("\n");
                    start = Math.max(0, lines.length - 8);
                    originalLog("  Last output lines:");
                    for (lineIndex = start; lineIndex < lines.length; lineIndex++) {
                        if (lines[lineIndex] !== "") {
                            originalLog("    " + lines[lineIndex]);
                        }
                    }
                }
            }

            originalLog("----------------------------------------");
            originalLog("Total: Passed=" + totalPassed +
                ", Failed=" + totalFailed);
        }
    };
}());

var intlAllTestsError;

if (IntlAllTests.isNodeRuntime) {
    IntlAllTests.runNodeTest("tests-Intl-core.js", "tests-Intl-core.js");
    IntlAllTests.runNodeTest("tests-Intl-NumberFormat.js", "tests-Intl-NumberFormat.js");
    IntlAllTests.runNodeTest("tests-Intl-NumberFormat-examples.js", "tests-Intl-NumberFormat-examples.js");
    IntlAllTests.runNodeTest("tests-Intl-Collator.js", "tests-Intl-Collator.js");
    IntlAllTests.runNodeTest("tests-Intl-Collator-examples.js", "tests-Intl-Collator-examples.js");
    IntlAllTests.runNodeTest("tests-Intl-DateTimeFormat.js", "tests-Intl-DateTimeFormat.js");
    IntlAllTests.runNodeTest("tests-Intl-DateTimeFormat-examples.js", "tests-Intl-DateTimeFormat-examples.js");
    IntlAllTests.runNodeTest("tests-Intl-DurationFormat.js", "tests-Intl-DurationFormat.js");
    IntlAllTests.runNodeTest("tests-Intl-DurationFormat-examples.js", "tests-Intl-DurationFormat-examples.js");
    IntlAllTests.runNodeTest("tests-Intl-DisplayNames.js", "tests-Intl-DisplayNames.js");
    IntlAllTests.runNodeTest("tests-Intl-DisplayNames-examples.js", "tests-Intl-DisplayNames-examples.js");
    IntlAllTests.runNodeTest("tests-Intl-ListFormat.js", "tests-Intl-ListFormat.js");
    IntlAllTests.runNodeTest("tests-Intl-ListFormat-examples.js", "tests-Intl-ListFormat-examples.js");
    IntlAllTests.runNodeTest("tests-Intl-PluralRules.js", "tests-Intl-PluralRules.js");
    IntlAllTests.runNodeTest("tests-Intl-PluralRules-examples.js", "tests-Intl-PluralRules-examples.js");
    IntlAllTests.runNodeTest("tests-Intl-RelativeTimeFormat.js", "tests-Intl-RelativeTimeFormat.js");
    IntlAllTests.runNodeTest("tests-Intl-RelativeTimeFormat-examples.js", "tests-Intl-RelativeTimeFormat-examples.js");
} else {
    IntlAllTests.begin("tests-Intl-core.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-core.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-NumberFormat.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-NumberFormat.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-NumberFormat-examples.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-NumberFormat-examples.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-Collator.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-Collator.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-Collator-examples.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-Collator-examples.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-DateTimeFormat.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-DateTimeFormat.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-DateTimeFormat-examples.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-DateTimeFormat-examples.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-DurationFormat.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-DurationFormat.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-DurationFormat-examples.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-DurationFormat-examples.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-DisplayNames.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-DisplayNames.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-DisplayNames-examples.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-DisplayNames-examples.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-ListFormat.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-ListFormat.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-ListFormat-examples.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-ListFormat-examples.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-PluralRules.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-PluralRules.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-PluralRules-examples.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-PluralRules-examples.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-RelativeTimeFormat.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-RelativeTimeFormat.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);

    IntlAllTests.begin("tests-Intl-RelativeTimeFormat-examples.js");
    intlAllTestsError = null;
    try {
        //@include "tests/tests-Intl-RelativeTimeFormat-examples.js"
    } catch (error) {
        intlAllTestsError = error;
    }
    IntlAllTests.end(intlAllTestsError);
}

IntlAllTests.printSummary();
