/*
 * Standard String polyfill reference and compatibility tests.
 *
 * This harness is expanded in small validated batches. ExtendScript processes
 * the include directives; Node.js preserves native methods as references,
 * disables them, and loads the same project files explicitly.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeStringAt = isNodeRuntime ? String.prototype.at : null;
var nativeStringEndsWith = isNodeRuntime ? String.prototype.endsWith : null;
var nativeStringStartsWith = isNodeRuntime ? String.prototype.startsWith : null;
var nativeStringIncludes = isNodeRuntime ? String.prototype.includes : null;
var nativeStringRepeat = isNodeRuntime ? String.prototype.repeat : null;
var nativeStringPadStart = isNodeRuntime ? String.prototype.padStart : null;
var nativeStringPadEnd = isNodeRuntime ? String.prototype.padEnd : null;
var nativeStringTrim = isNodeRuntime ? String.prototype.trim : null;
var nativeStringTrimStart = isNodeRuntime ? String.prototype.trimStart : null;
var nativeStringTrimEnd = isNodeRuntime ? String.prototype.trimEnd : null;
var nativeStringCodePointAt = isNodeRuntime ? String.prototype.codePointAt : null;
var nativeStringFromCodePoint = isNodeRuntime ? String.fromCodePoint : null;
var nativeStringIsWellFormed = isNodeRuntime ? String.prototype.isWellFormed : null;
var nativeStringToWellFormed = isNodeRuntime ? String.prototype.toWellFormed : null;
var nativeStringMatchAll = isNodeRuntime ? String.prototype.matchAll : null;
var nativeStringReplaceAll = isNodeRuntime ? String.prototype.replaceAll : null;

String.prototype.at = undefined;
String.prototype.endsWith = undefined;
String.prototype.startsWith = undefined;
String.prototype.includes = undefined;
String.prototype.repeat = undefined;
String.prototype.padStart = undefined;
String.prototype.padEnd = undefined;
String.prototype.trim = undefined;
String.prototype.trimStart = undefined;
String.prototype.trimEnd = undefined;
String.prototype.codePointAt = undefined;
String.fromCodePoint = undefined;
String.prototype.isWellFormed = undefined;
String.prototype.toWellFormed = undefined;
String.prototype.matchAll = undefined;
String.prototype.replaceAll = undefined;

//@include "../String-standard.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            path.join(__dirname, "../Lib/at.js"),
            path.join(__dirname, "../Lib/endsWith.js"),
            path.join(__dirname, "../Lib/startsWith.js"),
            path.join(__dirname, "../Lib/includes.js"),
            path.join(__dirname, "../Lib/repeat.js"),
            path.join(__dirname, "../Lib/padStart.js"),
            path.join(__dirname, "../Lib/padEnd.js"),
            path.join(__dirname, "../Lib/trim.js"),
            path.join(__dirname, "../Lib/trimStart.js"),
            path.join(__dirname, "../Lib/trimEnd.js"),
            path.join(__dirname, "../Lib/codePointAt.js"),
            path.join(__dirname, "../Lib/fromCodePoint.js"),
            path.join(__dirname, "../Lib/isWellFormed.js"),
            path.join(__dirname, "../Lib/toWellFormed.js"),
            path.join(__dirname, "../../Array/Lib/from.js"),
            path.join(__dirname, "../../Array/Lib/values.js"),
            path.join(__dirname, "../Lib/matchAll.js"),
            path.join(__dirname, "../Lib/replaceAll.js")
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

    function assertThrowsWith(callback, expectedName, message) {
        try {
            callback();
        } catch (error) {
            if (isNodeRuntime) {
                assertEqual(error.name, expectedName, message || "Unexpected error name");
            } else if (expectedName === "TypeError") {
                assertEqual(error instanceof TypeError, true, message || "Unexpected error type");
            } else if (expectedName === "RangeError") {
                assertEqual(error instanceof RangeError, true, message || "Unexpected error type");
            } else {
                assertEqual(error.name, expectedName, message || "Unexpected error name");
            }
            return;
        }

        fail((message ? message + ": " : "") + "expected an exception");
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

    function checkAt(value, index, expected, row) {
        if (nativeStringAt) {
            assertEqual(nativeStringAt.call(value, index), expected, "Node reference row " + row);
        }
        assertEqual(String.prototype.at.call(value, index), expected, "polyfill row " + row);
    }

    function checkEndsWith(value, searchString, position, expected, row) {
        if (nativeStringEndsWith) {
            assertEqual(nativeStringEndsWith.call(value, searchString, position), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.endsWith.call(value, searchString, position), expected,
            "polyfill row " + row);
    }

    function checkStartsWith(value, searchString, position, expected, row) {
        if (nativeStringStartsWith) {
            assertEqual(nativeStringStartsWith.call(value, searchString, position), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.startsWith.call(value, searchString, position), expected,
            "polyfill row " + row);
    }

    function checkIncludes(value, searchString, position, expected, row) {
        if (nativeStringIncludes) {
            assertEqual(nativeStringIncludes.call(value, searchString, position), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.includes.call(value, searchString, position), expected,
            "polyfill row " + row);
    }

    function checkRepeat(value, count, expected, row) {
        if (nativeStringRepeat) {
            assertEqual(nativeStringRepeat.call(value, count), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.repeat.call(value, count), expected,
            "polyfill row " + row);
    }

    function checkPadStart(value, targetLength, padString, expected, row) {
        if (nativeStringPadStart) {
            assertEqual(nativeStringPadStart.call(value, targetLength, padString), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.padStart.call(value, targetLength, padString), expected,
            "polyfill row " + row);
    }

    function checkPadEnd(value, targetLength, padString, expected, row) {
        if (nativeStringPadEnd) {
            assertEqual(nativeStringPadEnd.call(value, targetLength, padString), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.padEnd.call(value, targetLength, padString), expected,
            "polyfill row " + row);
    }

    function checkTrim(value, expected, row) {
        if (nativeStringTrim) {
            assertEqual(nativeStringTrim.call(value), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.trim.call(value), expected,
            "polyfill row " + row);
    }

    function checkTrimStart(value, expected, row) {
        if (nativeStringTrimStart) {
            assertEqual(nativeStringTrimStart.call(value), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.trimStart.call(value), expected,
            "polyfill row " + row);
    }

    function checkTrimEnd(value, expected, row) {
        if (nativeStringTrimEnd) {
            assertEqual(nativeStringTrimEnd.call(value), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.trimEnd.call(value), expected,
            "polyfill row " + row);
    }

    function checkCodePointAt(value, position, expected, row) {
        if (nativeStringCodePointAt) {
            assertEqual(nativeStringCodePointAt.call(value, position), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.codePointAt.call(value, position), expected,
            "polyfill row " + row);
    }

    function checkFromCodePoint(values, expected, row) {
        if (nativeStringFromCodePoint) {
            assertEqual(nativeStringFromCodePoint.apply(String, values), expected,
                "Node reference row " + row);
        }
        assertEqual(String.fromCodePoint.apply(String, values), expected,
            "polyfill row " + row);
    }

    function checkIsWellFormed(value, expected, row) {
        if (nativeStringIsWellFormed) {
            assertEqual(nativeStringIsWellFormed.call(value), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.isWellFormed.call(value), expected,
            "polyfill row " + row);
    }

    function checkToWellFormed(value, expected, row) {
        if (nativeStringToWellFormed) {
            assertEqual(nativeStringToWellFormed.call(value), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.toWellFormed.call(value), expected,
            "polyfill row " + row);
    }

    function collectMatches(iterator) {
        var rows = [];
        var step;
        var match;

        while (!(step = iterator.next()).done) {
            match = step.value;
            rows.push({
                values: Array.from(match),
                index: match.index,
                input: match.input
            });
        }
        return rows;
    }

    function assertMatchRows(actual, expected, message) {
        var i;
        var j;

        assertEqual(actual.length, expected.length, message + " row count");
        for (i = 0; i < expected.length; i++) {
            assertEqual(actual[i].index, expected[i].index, message + " index row " + i);
            assertEqual(actual[i].input, expected[i].input, message + " input row " + i);
            assertEqual(actual[i].values.length, expected[i].values.length,
                message + " value count row " + i);
            for (j = 0; j < expected[i].values.length; j++) {
                assertEqual(actual[i].values[j], expected[i].values[j],
                    message + " value row " + i + ", column " + j);
            }
        }
    }

    function checkMatchAll(value, regexp, expected, row) {
        var originalLastIndex = regexp instanceof RegExp ? regexp.lastIndex : undefined;

        if (nativeStringMatchAll) {
            assertMatchRows(collectMatches(nativeStringMatchAll.call(value, regexp)), expected,
                "Node reference row " + row);
            if (regexp instanceof RegExp) {
                assertEqual(regexp.lastIndex, originalLastIndex,
                    "Node original lastIndex row " + row);
            }
        }
        assertMatchRows(collectMatches(String.prototype.matchAll.call(value, regexp)), expected,
            "polyfill row " + row);
        if (regexp instanceof RegExp) {
            assertEqual(regexp.lastIndex, originalLastIndex,
                "polyfill original lastIndex row " + row);
        }
    }

    function checkReplaceAll(value, searchValue, replaceValue, expected, row) {
        if (nativeStringReplaceAll) {
            assertEqual(nativeStringReplaceAll.call(value, searchValue, replaceValue), expected,
                "Node reference row " + row);
        }
        assertEqual(String.prototype.replaceAll.call(value, searchValue, replaceValue), expected,
            "polyfill row " + row);
    }

    test("String.prototype.at is installed", function () {
        assertEqual(typeof String.prototype.at, "function", "String.prototype.at");
    });

    test("String.prototype.at matches index coercion and range behavior", function () {
        checkAt("abc", 0, "a", 0);
        checkAt("abc", -1, "c", 1);
        checkAt("abc", 3, undefined, 2);
        checkAt("abc", -4, undefined, 3);
        checkAt("abc", "1", "b", 4);
        checkAt("abc", undefined, "a", 5);
        checkAt("abc", NaN, "a", 6);
        checkAt("abc", 1.9, "b", 7);
        checkAt("abc", -1.9, "c", 8);
        checkAt("abc", Infinity, undefined, 9);
    });

    test("String.prototype.at follows runtime nullish receiver behavior", function () {
        if (nativeStringAt) {
            assertThrowsWith(function () {
                nativeStringAt.call(null, 0);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.at.call(null, 0);
            }, "TypeError", "polyfill null receiver");
        } else {
            String.prototype.at.call(null, 0);
        }
    });

    test("String.prototype.endsWith is installed", function () {
        assertEqual(typeof String.prototype.endsWith, "function", "String.prototype.endsWith");
    });

    test("String.prototype.endsWith matches search and position behavior", function () {
        checkEndsWith("abc", "bc", undefined, true, 0);
        checkEndsWith("abc", "ab", 2, true, 1);
        checkEndsWith("abc", "bc", 2, false, 2);
        checkEndsWith("abc", "", 0, true, 3);
        checkEndsWith("abc", "a", 1.9, true, 4);
        checkEndsWith("abc", "a", NaN, false, 5);
        checkEndsWith("abc", "abc", Infinity, true, 6);
        checkEndsWith("abc", "a", -Infinity, false, 7);
        checkEndsWith(123, 23, undefined, true, 8);
    });

    test("String.prototype.endsWith rejects invalid arguments", function () {
        if (nativeStringEndsWith) {
            assertThrowsWith(function () {
                nativeStringEndsWith.call(null, "x");
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.endsWith.call(null, "x");
            }, "TypeError", "polyfill null receiver");
            assertThrowsWith(function () {
                nativeStringEndsWith.call("abc", /c/);
            }, "TypeError", "Node regular expression");
        } else {
            String.prototype.endsWith.call(null, "x");
        }
        assertThrowsWith(function () {
            String.prototype.endsWith.call("abc", /c/);
        }, "TypeError", "polyfill regular expression");
    });

    test("String.prototype.startsWith is installed", function () {
        assertEqual(typeof String.prototype.startsWith, "function", "String.prototype.startsWith");
    });

    test("String.prototype.startsWith matches search and position behavior", function () {
        checkStartsWith("abc", "ab", undefined, true, 0);
        checkStartsWith("abc", "bc", 1, true, 1);
        checkStartsWith("abc", "ab", 1, false, 2);
        checkStartsWith("abc", "", 3, true, 3);
        checkStartsWith("abc", "b", 1.9, true, 4);
        checkStartsWith("abc", "a", NaN, true, 5);
        checkStartsWith("abc", "", Infinity, true, 6);
        checkStartsWith("abc", "a", -Infinity, true, 7);
        checkStartsWith(123, 12, undefined, true, 8);
    });

    test("String.prototype.startsWith rejects invalid arguments", function () {
        if (nativeStringStartsWith) {
            assertThrowsWith(function () {
                nativeStringStartsWith.call(null, "x");
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.startsWith.call(null, "x");
            }, "TypeError", "polyfill null receiver");
            assertThrowsWith(function () {
                nativeStringStartsWith.call("abc", /a/);
            }, "TypeError", "Node regular expression");
        } else {
            String.prototype.startsWith.call(null, "x");
        }
        assertThrowsWith(function () {
            String.prototype.startsWith.call("abc", /a/);
        }, "TypeError", "polyfill regular expression");
    });

    test("String.prototype.includes is installed", function () {
        assertEqual(typeof String.prototype.includes, "function", "String.prototype.includes");
    });

    test("String.prototype.includes matches search and position behavior", function () {
        checkIncludes("abc", "b", undefined, true, 0);
        checkIncludes("abcabc", "a", 1, true, 1);
        checkIncludes("abc", "a", 1, false, 2);
        checkIncludes("abc", "", 99, true, 3);
        checkIncludes("abc", "b", 1.9, true, 4);
        checkIncludes("abc", "a", NaN, true, 5);
        checkIncludes("abc", "", Infinity, true, 6);
        checkIncludes("abc", "a", -Infinity, true, 7);
        checkIncludes(123, 2, undefined, true, 8);
    });

    test("String.prototype.includes rejects invalid arguments", function () {
        if (nativeStringIncludes) {
            assertThrowsWith(function () {
                nativeStringIncludes.call(null, "x");
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.includes.call(null, "x");
            }, "TypeError", "polyfill null receiver");
            assertThrowsWith(function () {
                nativeStringIncludes.call("abc", /b/);
            }, "TypeError", "Node regular expression");
        } else {
            String.prototype.includes.call(null, "x");
        }
        assertThrowsWith(function () {
            String.prototype.includes.call("abc", /b/);
        }, "TypeError", "polyfill regular expression");
    });

    test("String.prototype.repeat is installed", function () {
        assertEqual(typeof String.prototype.repeat, "function", "String.prototype.repeat");
    });

    test("String.prototype.repeat matches count coercion", function () {
        checkRepeat("ab", 3, "ababab", 0);
        checkRepeat("ab", 2.9, "abab", 1);
        checkRepeat("ab", -0.9, "", 2);
        checkRepeat("ab", NaN, "", 3);
        checkRepeat("ab", undefined, "", 4);
        checkRepeat("x", "3", "xxx", 5);
        checkRepeat("", 100, "", 6);
        checkRepeat(12, 2, "1212", 7);
    });

    test("String.prototype.repeat rejects invalid receivers and counts", function () {
        if (nativeStringRepeat) {
            assertThrowsWith(function () {
                nativeStringRepeat.call(null, 1);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.repeat.call(null, 1);
            }, "TypeError", "polyfill null receiver");
            assertThrowsWith(function () {
                nativeStringRepeat.call("x", -1);
            }, "RangeError", "Node negative count");
            assertThrowsWith(function () {
                nativeStringRepeat.call("x", Infinity);
            }, "RangeError", "Node infinite count");
        } else {
            String.prototype.repeat.call(null, 1);
        }
        assertThrowsWith(function () {
            String.prototype.repeat.call("x", -1);
        }, "RangeError", "polyfill negative count");
        assertThrowsWith(function () {
            String.prototype.repeat.call("x", Infinity);
        }, "RangeError", "polyfill infinite count");
    });

    test("String.prototype.padStart is installed", function () {
        assertEqual(typeof String.prototype.padStart, "function", "String.prototype.padStart");
    });

    test("String.prototype.padStart matches length and filler behavior", function () {
        checkPadStart("abc", 5, undefined, "  abc", 0);
        checkPadStart("abc", 6, "01", "010abc", 1);
        checkPadStart("abc", 2, "x", "abc", 2);
        checkPadStart("abc", 5.9, "x", "xxabc", 3);
        checkPadStart("abc", "5", "0", "00abc", 4);
        checkPadStart("abc", 5, "", "abc", 5);
        checkPadStart("abc", 5, 0, "00abc", 6);
        checkPadStart(12, 4, "0", "0012", 7);
    });

    test("String.prototype.padStart follows runtime nullish receiver behavior", function () {
        if (nativeStringPadStart) {
            assertThrowsWith(function () {
                nativeStringPadStart.call(null, 3);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.padStart.call(null, 3);
            }, "TypeError", "polyfill null receiver");
        } else {
            String.prototype.padStart.call(null, 3);
        }
    });

    test("String.prototype.padEnd is installed", function () {
        assertEqual(typeof String.prototype.padEnd, "function", "String.prototype.padEnd");
    });

    test("String.prototype.padEnd matches length and filler behavior", function () {
        checkPadEnd("abc", 5, undefined, "abc  ", 0);
        checkPadEnd("abc", 6, "01", "abc010", 1);
        checkPadEnd("abc", 2, "x", "abc", 2);
        checkPadEnd("abc", 5.9, "x", "abcxx", 3);
        checkPadEnd("abc", "5", "0", "abc00", 4);
        checkPadEnd("abc", 5, "", "abc", 5);
        checkPadEnd("abc", 5, 0, "abc00", 6);
        checkPadEnd(12, 4, "0", "1200", 7);
    });

    test("String.prototype.padEnd follows runtime nullish receiver behavior", function () {
        if (nativeStringPadEnd) {
            assertThrowsWith(function () {
                nativeStringPadEnd.call(null, 3);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.padEnd.call(null, 3);
            }, "TypeError", "polyfill null receiver");
        } else {
            String.prototype.padEnd.call(null, 3);
        }
    });

    test("String.prototype.trim is installed", function () {
        assertEqual(typeof String.prototype.trim, "function", "String.prototype.trim");
    });

    test("String.prototype.trim handles whitespace and custom characters", function () {
        checkTrim("  abc  ", "abc", 0);
        checkTrim("\t\r\nabc\n\t", "abc", 1);
        checkTrim("\u00a0abc\u00a0", "abc", 2);
        checkTrim(123, "123", 3);
        assertEqual(String.prototype.trim.call("xxhellox", "x"), "hello",
            "custom character trimming");
        assertEqual(String.prototype.trim.call("a-zvaluez-a", "a-z"), "value",
            "custom hyphen trimming");
        assertEqual(String.prototype.trim.call(".*value*.", ".*"), "value",
            "escaped custom characters");
    });

    test("String.prototype.trim rejects nullish receivers", function () {
        if (nativeStringTrim) {
            assertThrowsWith(function () {
                nativeStringTrim.call(null);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.trim.call(null);
            }, "TypeError", "polyfill null receiver");
        }
    });

    test("String.prototype.trimStart is installed", function () {
        assertEqual(typeof String.prototype.trimStart, "function", "String.prototype.trimStart");
    });

    test("String.prototype.trimStart handles whitespace and custom characters", function () {
        checkTrimStart("  abc  ", "abc  ", 0);
        checkTrimStart("\t\r\nabc\n\t", "abc\n\t", 1);
        checkTrimStart("\u00a0abc\u00a0", "abc\u00a0", 2);
        checkTrimStart(123, "123", 3);
        assertEqual(String.prototype.trimStart.call("xxhellox", "x"), "hellox",
            "custom character trimming");
        assertEqual(String.prototype.trimStart.call("a-zvaluez-a", "a-z"), "valuez-a",
            "custom hyphen trimming");
    });

    test("String.prototype.trimStart rejects nullish receivers", function () {
        if (nativeStringTrimStart) {
            assertThrowsWith(function () {
                nativeStringTrimStart.call(null);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.trimStart.call(null);
            }, "TypeError", "polyfill null receiver");
        }
    });

    test("String.prototype.trimEnd is installed", function () {
        assertEqual(typeof String.prototype.trimEnd, "function", "String.prototype.trimEnd");
    });

    test("String.prototype.trimEnd handles whitespace and custom characters", function () {
        checkTrimEnd("  abc  ", "  abc", 0);
        checkTrimEnd("\t\r\nabc\n\t", "\t\r\nabc", 1);
        checkTrimEnd("\u00a0abc\u00a0", "\u00a0abc", 2);
        checkTrimEnd(123, "123", 3);
        assertEqual(String.prototype.trimEnd.call("xxhellox", "x"), "xxhello",
            "custom character trimming");
        assertEqual(String.prototype.trimEnd.call("a-zvaluez-a", "a-z"), "a-zvalue",
            "custom hyphen trimming");
    });

    test("String.prototype.trimEnd rejects nullish receivers", function () {
        if (nativeStringTrimEnd) {
            assertThrowsWith(function () {
                nativeStringTrimEnd.call(null);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.trimEnd.call(null);
            }, "TypeError", "polyfill null receiver");
        }
    });

    test("String.prototype.codePointAt is installed", function () {
        assertEqual(typeof String.prototype.codePointAt, "function", "String.prototype.codePointAt");
    });

    test("String.prototype.codePointAt handles indices and surrogate pairs", function () {
        checkCodePointAt("ABC", 0, 65, 0);
        checkCodePointAt("ABC", undefined, 65, 1);
        checkCodePointAt("ABC", NaN, 65, 2);
        checkCodePointAt("ABC", "1", 66, 3);
        checkCodePointAt("ABC", 1.9, 66, 4);
        checkCodePointAt("ABC", -1, undefined, 5);
        checkCodePointAt("ABC", Infinity, undefined, 6);
        checkCodePointAt("\ud83d\udc4b", 0, 128075, 7);
        checkCodePointAt("\ud83d\udc4b", 1, 56395, 8);
        checkCodePointAt("\ud83dX", 0, 55357, 9);
        checkCodePointAt("\udc4b", 0, 56395, 10);
        checkCodePointAt(123, 1, 50, 11);
    });

    test("String.prototype.codePointAt rejects nullish receivers", function () {
        if (nativeStringCodePointAt) {
            assertThrowsWith(function () {
                nativeStringCodePointAt.call(null, 0);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.codePointAt.call(null, 0);
            }, "TypeError", "polyfill null receiver");
        }
    });

    test("String.fromCodePoint is installed", function () {
        assertEqual(typeof String.fromCodePoint, "function", "String.fromCodePoint");
    });

    test("String.fromCodePoint creates BMP and supplementary characters", function () {
        checkFromCodePoint([], "", 0);
        checkFromCodePoint([65], "A", 1);
        checkFromCodePoint(["66"], "B", 2);
        checkFromCodePoint([128075], "\ud83d\udc4b", 3);
        checkFromCodePoint([0x10ffff], "\udbff\udfff", 4);
        checkFromCodePoint([65, 128075, 66], "A\ud83d\udc4bB", 5);
    });

    test("String.fromCodePoint rejects invalid code points", function () {
        var invalidValues = [-1, 0x110000, 3.14, NaN, Infinity];
        var i;

        for (i = 0; i < invalidValues.length; i++) {
            if (nativeStringFromCodePoint) {
                assertThrowsWith(function (value) {
                    return function () {
                        nativeStringFromCodePoint(value);
                    };
                }(invalidValues[i]), "RangeError", "Node invalid row " + i);
            }
            assertThrows(function (value) {
                return function () {
                    String.fromCodePoint(value);
                };
            }(invalidValues[i]), "polyfill invalid row " + i);
        }
    });

    test("String.prototype.isWellFormed is installed", function () {
        assertEqual(typeof String.prototype.isWellFormed, "function",
            "String.prototype.isWellFormed");
    });

    test("String.prototype.isWellFormed recognizes surrogate structure", function () {
        checkIsWellFormed("", true, 0);
        checkIsWellFormed("abc", true, 1);
        checkIsWellFormed("\ud83d\udc4b", true, 2);
        checkIsWellFormed("A\ud83d\udc4bB", true, 3);
        checkIsWellFormed("\ud83d", false, 4);
        checkIsWellFormed("\udc4b", false, 5);
        checkIsWellFormed("\ud83dX", false, 6);
        checkIsWellFormed("\ud83d\ud83d", false, 7);
        checkIsWellFormed("\ud83d\udc4b\udc4b", false, 8);
        checkIsWellFormed(123, true, 9);
    });

    test("String.prototype.isWellFormed rejects nullish receivers", function () {
        if (nativeStringIsWellFormed) {
            assertThrowsWith(function () {
                nativeStringIsWellFormed.call(null);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.isWellFormed.call(null);
            }, "TypeError", "polyfill null receiver");
        }
    });

    test("String.prototype.toWellFormed is installed", function () {
        assertEqual(typeof String.prototype.toWellFormed, "function",
            "String.prototype.toWellFormed");
    });

    test("String.prototype.toWellFormed replaces only unpaired surrogates", function () {
        checkToWellFormed("", "", 0);
        checkToWellFormed("abc", "abc", 1);
        checkToWellFormed("\ud83d\udc4b", "\ud83d\udc4b", 2);
        checkToWellFormed("\ud83d", "\ufffd", 3);
        checkToWellFormed("\udc4b", "\ufffd", 4);
        checkToWellFormed("A\ud83dB", "A\ufffdB", 5);
        checkToWellFormed("\ud83d\udc4b\udc4b", "\ud83d\udc4b\ufffd", 6);
        checkToWellFormed("\ud83d\ud83d\udc4b", "\ufffd\ud83d\udc4b", 7);
        checkToWellFormed(123, "123", 8);
    });

    test("String.prototype.toWellFormed rejects nullish receivers", function () {
        if (nativeStringToWellFormed) {
            assertThrowsWith(function () {
                nativeStringToWellFormed.call(null);
            }, "TypeError", "Node null receiver");
            assertThrowsWith(function () {
                String.prototype.toWellFormed.call(null);
            }, "TypeError", "polyfill null receiver");
        }
    });

    test("String.prototype.matchAll is installed", function () {
        assertEqual(typeof String.prototype.matchAll, "function", "String.prototype.matchAll");
    });

    test("String.prototype.matchAll returns matches and capturing groups", function () {
        checkMatchAll("test1 test2", /t(e)(st\d)/g, [
            {values: ["test1", "e", "st1"], index: 0, input: "test1 test2"},
            {values: ["test2", "e", "st2"], index: 6, input: "test1 test2"}
        ], 0);
        checkMatchAll("aba", "a", [
            {values: ["a"], index: 0, input: "aba"},
            {values: ["a"], index: 2, input: "aba"}
        ], 1);
    });

    test("String.prototype.matchAll preserves RegExp state and handles empty matches", function () {
        var regexp = /a/gi;
        var emptyMatches = [
            {values: ["", ""], index: 0, input: "ab"},
            {values: ["", ""], index: 1, input: "ab"}
        ];

        regexp.lastIndex = 1;
        checkMatchAll("AaA", regexp, [
            {values: ["a"], index: 1, input: "AaA"},
            {values: ["A"], index: 2, input: "AaA"}
        ], 0);
        if (isNodeRuntime) {
            emptyMatches.push({values: ["", ""], index: 2, input: "ab"});
        }
        checkMatchAll("ab", /()/g, emptyMatches, 1);
    });

    test("String.prototype.matchAll rejects non-global regular expressions", function () {
        if (nativeStringMatchAll) {
            assertThrowsWith(function () {
                nativeStringMatchAll.call("abc", /a/);
            }, "TypeError", "Node non-global RegExp");
        }
        assertThrows(function () {
            String.prototype.matchAll.call("abc", /a/);
        }, "polyfill non-global RegExp");
    });

    test("String.prototype.replaceAll is installed", function () {
        assertEqual(typeof String.prototype.replaceAll, "function", "String.prototype.replaceAll");
    });

    test("String.prototype.replaceAll replaces strings and substitution patterns", function () {
        checkReplaceAll("aba", "a", "x", "xbx", 0);
        checkReplaceAll("a.a", ".", "-", "a-a", 1);
        checkReplaceAll("aba", "a", "[$&]", "[a]b[a]", 2);
        checkReplaceAll("aba", "a", "$$", "$b$", 3);
        checkReplaceAll("ab", "", "-", "-a-b-", 4);
        checkReplaceAll("", "", "-", "-", 5);
        checkReplaceAll(121, 1, 0, "020", 6);
    });

    test("String.prototype.replaceAll supports functions and global regular expressions", function () {
        checkReplaceAll("aba", "a", function (match, index, input) {
            return match + index + input.length;
        }, "a03ba23", 0);
        checkReplaceAll("a1 a2", /a(\d)/g, function (match, digit, index) {
            return digit + "@" + index;
        }, "1@0 2@3", 1);
    });

    test("String.prototype.replaceAll rejects non-global regular expressions", function () {
        if (nativeStringReplaceAll) {
            assertThrowsWith(function () {
                nativeStringReplaceAll.call("abc", /a/, "x");
            }, "TypeError", "Node non-global RegExp");
        }
        assertThrows(function () {
            String.prototype.replaceAll.call("abc", /a/, "x");
        }, "polyfill non-global RegExp");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " String test(s) failed");
    }
}());
