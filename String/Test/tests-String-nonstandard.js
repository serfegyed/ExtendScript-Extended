/*
 * Non-standard String extension tests.
 *
 * ExtendScript processes the include directives. Node.js loads the same
 * project files explicitly so this harness can be run in both environments.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;

String.prototype.contains = undefined;
String.prototype.format = undefined;
String.prototype.indexAfter = undefined;
String.prototype.insert = undefined;
String.isEmpty = undefined;
String.prototype.reverse = undefined;

//@include "../Lib/contains.js"
//@include "../Lib/format.js"
//@include "../Lib/indexAfter.js"
//@include "../Lib/insert.js"
//@include "../Lib/isEmpty.js"
//@include "../Lib/reverse.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            path.join(__dirname, "../Lib/contains.js"),
            path.join(__dirname, "../Lib/format.js"),
            path.join(__dirname, "../Lib/indexAfter.js"),
            path.join(__dirname, "../Lib/insert.js"),
            path.join(__dirname, "../Lib/isEmpty.js"),
            path.join(__dirname, "../Lib/reverse.js")
        ];
        var i;

        for (i = 0; i < filenames.length; i++) {
            (0, eval)(fs.readFileSync(filenames[i], "utf8"));
        }
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

    function assertThrows(callback, message) {
        try {
            callback();
        } catch (error) {
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

    test("String.prototype.contains is installed", function () {
        assertEqual(typeof String.prototype.contains, "function", "String.prototype.contains");
    });

    test("String.prototype.contains recognizes converted substrings", function () {
        assertEqual("abc".contains("b"), true, "present substring");
        assertEqual("abc".contains("d"), false, "missing substring");
        assertEqual("abc".contains(""), true, "empty substring");
        assertEqual("undefined".contains(undefined), true, "undefined conversion");
        assertEqual(String.prototype.contains.call(123, 2), true, "receiver conversion");
    });

    test("String.prototype.format is installed", function () {
        assertEqual(typeof String.prototype.format, "function", "String.prototype.format");
    });

    test("String.prototype.format handles positional and named placeholders", function () {
        assertEqual("Hello {}, {}!".format("Ada", 42), "Hello Ada, 42!",
            "positional placeholders");
        assertEqual("{} {}".format("one"), "one {}", "missing positional value");
        assertEqual("{}".format("$&"), "$&", "literal replacement markers");
        assertEqual("{name}: {name}".format({name: "Ada"}), "Ada: Ada",
            "repeated named placeholder");
        assertEqual("{a}-{b}".format({a: 1, b: null}), "1-null",
            "named value conversion");
        assertEqual(String.prototype.format.call(123), "123", "receiver conversion");
    });

    test("String.prototype.indexAfter is installed", function () {
        assertEqual(typeof String.prototype.indexAfter, "function", "String.prototype.indexAfter");
    });

    test("String.prototype.indexAfter returns the position after the first match", function () {
        assertEqual("hello world".indexAfter("hello"), 5, "match at start");
        assertEqual("hello world".indexAfter("world"), 11, "match at end");
        assertEqual("banana".indexAfter("an"), 3, "first match");
        assertEqual("abc".indexAfter("x"), -1, "missing match");
        assertEqual("abc".indexAfter(""), 0, "empty match");
        assertEqual("123".indexAfter(2), 2, "search conversion");
        assertEqual(String.prototype.indexAfter.call(12345, "34"), 4,
            "receiver conversion");
    });

    test("String.prototype.insert is installed", function () {
        assertEqual(typeof String.prototype.insert, "function", "String.prototype.insert");
    });

    test("String.prototype.insert inserts converted values", function () {
        assertEqual("abc".insert("X", 0), "Xabc", "insert at start");
        assertEqual("abc".insert("X", 2), "abXc", "insert in middle");
        assertEqual("abc".insert("X", 3), "abcX", "insert at end");
        assertEqual("abc".insert(12, "1"), "a12bc", "argument conversion");
        assertEqual("abc".insert("X", 1.9), "aXbc", "fractional index");
        assertEqual("abc".insert("", 1), "abc", "empty insertion");
        assertEqual(String.prototype.insert.call(123, "X", 1), "1X23",
            "receiver conversion");
    });

    test("String.prototype.insert rejects invalid indices", function () {
        assertThrows(function () {
            "abc".insert("X", -1);
        }, "negative index");
        assertThrows(function () {
            "abc".insert("X", 4);
        }, "index after end");
        assertThrows(function () {
            "abc".insert("X", NaN);
        }, "NaN index");
        assertThrows(function () {
            "abc".insert("X", Infinity);
        }, "infinite index");
    });

    test("String.isEmpty is installed", function () {
        assertEqual(typeof String.isEmpty, "function", "String.isEmpty");
    });

    test("String.isEmpty recognizes empty primitive strings", function () {
        assertEqual(String.isEmpty(""), true, "empty string");
        assertEqual(String.isEmpty(" "), false, "whitespace string");
        assertEqual(String.isEmpty("abc"), false, "non-empty string");
    });

    test("String.isEmpty rejects non-string values", function () {
        assertThrows(function () {
            String.isEmpty(null);
        }, "null value");
        assertThrows(function () {
            String.isEmpty(undefined);
        }, "undefined value");
        assertThrows(function () {
            String.isEmpty(0);
        }, "number value");
        assertThrows(function () {
            String.isEmpty(new String(""));
        }, "boxed string");
    });

    test("String.prototype.reverse is installed", function () {
        assertEqual(typeof String.prototype.reverse, "function", "String.prototype.reverse");
    });

    test("String.prototype.reverse preserves surrogate pairs", function () {
        assertEqual("abc".reverse(), "cba", "ASCII string");
        assertEqual("".reverse(), "", "empty string");
        assertEqual("A\ud83d\udc4bB".reverse(), "B\ud83d\udc4bA", "supplementary character");
        assertEqual("\ud83d\udc4b\ud83d\ude00".reverse(), "\ud83d\ude00\ud83d\udc4b",
            "multiple supplementary characters");
        assertEqual(String.prototype.reverse.call(123), "321", "receiver conversion");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " non-standard String test(s) failed");
    }
}());
