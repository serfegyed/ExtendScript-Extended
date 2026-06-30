//@include "../Tools/Console/console.js"

var TemporalAllTests = (function () {
    var originalLog = console.log;
    var records = [];
    var currentName = "";
    var currentLines = [];

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

    console.log = function () {
        var message = joinArguments(arguments);
        currentLines.push(message);
        originalLog.apply(console, arguments);
    };

    return {
        begin: function (name) {
            currentName = name;
            currentLines = [];
            originalLog("========================================");
            originalLog("Running: " + name);
        },

        end: function (error) {
            var text = currentLines.join("\n");
            var passed = readLastNumber(text, "Passed");
            var failed = readLastNumber(text, "Failed");
            var skipped = readLastNumber(text, "Skipped");
            var auditExpression;
            var auditMatch;

            if (passed === null && failed === null) {
                passed = 0;
                failed = 0;
                skipped = 0;
                auditExpression = /(?:ISO_PARSE|EPOCH_CONSTRUCTOR)_SUMMARY:\s*(\d+)\/(\d+)/g;

                while ((auditMatch = auditExpression.exec(text)) !== null) {
                    passed += Number(auditMatch[1]);
                    failed += Number(auditMatch[2]) - Number(auditMatch[1]);
                }
            }

            if (passed === null) passed = 0;
            if (failed === null) failed = 0;
            if (skipped === null) skipped = 0;
            if (error && failed === 0) failed = 1;

            records.push({
                name: currentName,
                passed: passed,
                failed: failed,
                skipped: skipped,
                error: error ? String(error) : ""
            });
        },

        printSummary: function () {
            var totalPassed = 0;
            var totalFailed = 0;
            var totalSkipped = 0;
            var record;
            var i;

            console.log = originalLog;
            originalLog("");
            originalLog("Temporal all tests summary");
            originalLog("========================================");

            for (i = 0; i < records.length; i++) {
                record = records[i];
                totalPassed += record.passed;
                totalFailed += record.failed;
                totalSkipped += record.skipped;
                originalLog(
                    record.name + ": Passed=" + record.passed +
                    ", Failed=" + record.failed +
                    ", Skipped=" + record.skipped
                );

                if (record.error) {
                    originalLog("  Error: " + record.error);
                }
            }

            originalLog("----------------------------------------");
            originalLog("Total: Passed=" + totalPassed +
                ", Failed=" + totalFailed +
                ", Skipped=" + totalSkipped);
        }
    };
}());

var temporalAllTestsError;

TemporalAllTests.begin("tests-Temporal-core.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-Temporal-core.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-Duration.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-Duration.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-Instant.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-Instant.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("Date/Test/tests-Date.js");
temporalAllTestsError = null;
try {
    //@include "../Date/Test/tests-Date.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-PlainDate.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-PlainDate.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-PlainTime.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-PlainTime.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-PlainDateTime.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-PlainDateTime.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-PlainYearMonth.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-PlainYearMonth.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-PlainMonthDay.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-PlainMonthDay.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-Now.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-Now.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-UTCProjection.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-UTCProjection.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-LocaleDate.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-LocaleDate.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.begin("tests-LocaleString.js");
temporalAllTestsError = null;
try {
    //@include "Test/tests-LocaleString.js"
} catch (error) {
    temporalAllTestsError = error;
}
TemporalAllTests.end(temporalAllTestsError);

TemporalAllTests.printSummary();
