/*
 * RegExp polyfill reference and compatibility tests.
 *
 * ExtendScript processes the include directive. Node.js ignores it, preserves
 * its native method as the reference, disables it, and then loads the project
 * polyfill.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeRegExpEscape = isNodeRuntime ? RegExp.escape : null;

RegExp.escape = undefined;

//@include "../Lib/escape.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(
            path.join(__dirname, "../Lib/escape.js"),
            "utf8"
        ));
    }());
}

(function () {
    var passed = 0;
    var failed = 0;

    function fail(message) {
        throw new Error(message);
    }

    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            fail((message ? message + ": " : "") +
                "expected " + String(expected) + ", got " + String(actual));
        }
    }

    function assertThrowsWith(callback, expectedName, message) {
        try {
            callback();
        } catch (error) {
            if (isNodeRuntime) {
                assertEqual(error.name, expectedName,
                    message || "Unexpected error name");
            } else if (expectedName === "TypeError") {
                assertEqual(error instanceof TypeError, true,
                    message || "Expected TypeError");
            } else {
                assertEqual(error instanceof Error, true,
                    message || "Expected Error");
            }
            return;
        }

        fail((message ? message + ": " : "") + "expected an exception");
    }

    function test(name, callback) {
        try {
            callback();
            passed++;
            console.log("PASS: " + name);
        } catch (error) {
            failed++;
            console.error("FAIL: " + name + "\n  " +
                (error.message || String(error)));
        }
    }

    function checkRows(name, rows) {
        test(name, function () {
            var row;
            var i;

            for (i = 0; i < rows.length; i++) {
                row = rows[i];

                if (nativeRegExpEscape) {
                    assertEqual(
                        nativeRegExpEscape(row.value),
                        row.expected,
                        "Node reference row " + i
                    );
                }

                assertEqual(
                    RegExp.escape(row.value),
                    row.expected,
                    "polyfill row " + i
                );
            }
        });
    }

    test("RegExp.escape is installed", function () {
        assertEqual(typeof RegExp.escape, "function", "polyfill method");
    });

    checkRows("escapes leading ASCII letters and digits", [
        { value: "foo", expected: "\\x66oo" },
        { value: "1foo", expected: "\\x31foo" },
        { value: "A-Z", expected: "\\x41\\x2dZ" }
    ]);

    checkRows("escapes regex syntax characters", [
        { value: "^$\\.*+?()[]{}|/", expected: "\\^\\$\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\/" },
        { value: "[x]/{y}", expected: "\\[x\\]\\/\\{y\\}" }
    ]);

    checkRows("escapes other punctuators with hex escapes", [
        { value: "hello-world", expected: "\\x68ello\\x2dworld" },
        { value: ",-=<>#&!%:;@~'`\"", expected: "\\x2c\\x2d\\x3d\\x3c\\x3e\\x23\\x26\\x21\\x25\\x3a\\x3b\\x40\\x7e\\x27\\x60\\x22" }
    ]);

    checkRows("escapes whitespace and line terminators", [
        { value: "a b", expected: "\\x61\\x20b" },
        { value: "\n\t\r\v\f", expected: "\\n\\t\\r\\v\\f" },
        { value: "\u2028\u2029", expected: "\\u2028\\u2029" },
        { value: "\u00a0", expected: "\\xa0" }
    ]);

    checkRows("preserves non-special unicode text and surrogate pairs", [
        { value: "\u00e9", expected: "\u00e9" },
        { value: "\uD83D\uDE00", expected: "\uD83D\uDE00" }
    ]);

    checkRows("escapes lone surrogates", [
        { value: "\uD83D", expected: "\\ud83d" },
        { value: "\uDE00", expected: "\\ude00" }
    ]);

    test("RegExp.escape rejects non-string values", function () {
        assertThrowsWith(function () {
            RegExp.escape(1);
        }, "TypeError", "number");

        assertThrowsWith(function () {
            RegExp.escape(new String("x"));
        }, "TypeError", "String object");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (nativeRegExpEscape) {
        RegExp.escape = nativeRegExpEscape;
    }

    if (failed > 0) {
        throw new Error(failed + " RegExp test(s) failed");
    }
}());
