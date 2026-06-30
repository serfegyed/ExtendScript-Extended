/*
 * JSON integration tests for the active Date and Temporal polyfills.
 *
 * ExtendScript processes the include directives. Node.js ignores them and
 * loads the same files with vm.runInThisContext.
 */

//@include "../Tools/Console/console.js"

const isNodeRuntime = typeof process !== "undefined" && process.versions && process.versions.node;
const nativeJSON = isNodeRuntime ? JSON : null;
const nativeDateToISOString = Date.prototype.toISOString;
const nativeDateToJSON = Date.prototype.toJSON;

if (isNodeRuntime) {
    global.JSON = undefined;
}

Date.prototype.toISOString = undefined;
Date.prototype.toJSON = undefined;

//@include "./JSON.js"
//@include "../Date/Lib/Date.toISOString.js"
//@include "../Date/Lib/Date.toJSON.js"
//@include "../Temporal/Lib/Temporal-core.js"
//@include "../Temporal/Lib/Temporal.Duration.js"
//@include "../Temporal/Lib/Temporal.Instant.js"
//@include "../Temporal/Lib/Temporal.PlainDateTime.js"
//@include "../Temporal/Lib/Temporal.PlainDate.js"
//@include "../Temporal/Lib/Temporal.PlainTime.js"
//@include "../Temporal/Lib/Temporal.PlainYearMonth.js"
//@include "../Temporal/Lib/Temporal.PlainMonthDay.js"

if (isNodeRuntime) {
    (function () {
        const fs = require("fs");
        const vm = require("vm");
        const temporalRoot = __dirname + "/../Temporal/Lib/";
        const dateRoot = __dirname + "/../Date/Lib/";

        function load(filename) {
            const source = fs.readFileSync(filename, "utf8");
            vm.runInThisContext(source, {filename: filename});
        }

        load(__dirname + "/JSON.js");
        load(dateRoot + "Date.toISOString.js");
        load(dateRoot + "Date.toJSON.js");
        load(temporalRoot + "Temporal-core.js");
        load(temporalRoot + "Temporal.Duration.js");
        load(temporalRoot + "Temporal.Instant.js");
        load(temporalRoot + "Temporal.PlainDateTime.js");
        load(temporalRoot + "Temporal.PlainDate.js");
        load(temporalRoot + "Temporal.PlainTime.js");
        load(temporalRoot + "Temporal.PlainYearMonth.js");
        load(temporalRoot + "Temporal.PlainMonthDay.js");
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
            fail((message ? message + ": " : "") + "expected " + expected + ", got " + actual);
        }
    }

    function assertThrows(callback, expectedMessage, message) {
        var thrown = false;
        try {
            callback();
        } catch (error) {
            thrown = true;
            assertEqual(error.message, expectedMessage, message);
        }
        if (!thrown) {
            fail((message ? message + ": " : "") + "expected an exception");
        }
    }

    function test(name, callback) {
        try {
            callback();
            passed++;
            console.log("PASS: " + name);
        } catch (error) {
            failed++;
            console.error("FAIL: " + name + "\n  " + (error.message || String(error)));
        }
    }

    function checkStringify(name, valueFactory, expected) {
        test(name, function () {
            if (nativeJSON !== null) {
                assertEqual(nativeJSON.stringify(valueFactory()), expected, "Node native JSON reference");
            }
            assertEqual(JSON.stringify(valueFactory()), expected, "JSON polyfill");
        });
    }

    checkStringify("Date.toJSON valid date", function () {
        return new Date(Date.UTC(2026, 5, 30, 12, 34, 56, 789));
    }, "\"2026-06-30T12:34:56.789Z\"");

    checkStringify("Date.toJSON invalid date", function () {
        return new Date(NaN);
    }, "null");

    checkStringify("Temporal.Duration.toJSON", function () {
        return new Temporal.Duration(1, 2, 0, 3, 4, 5, 6, 7);
    }, "\"P1Y2M3DT4H5M6.007S\"");

    checkStringify("Temporal.Instant.toJSON", function () {
        return new Temporal.Instant(0);
    }, "\"1970-01-01T00:00:00Z\"");

    checkStringify("Temporal.PlainDateTime.toJSON", function () {
        return new Temporal.PlainDateTime(2026, 6, 30, 12, 34, 56, 789);
    }, "\"2026-06-30T12:34:56.789\"");

    checkStringify("Temporal.PlainDate.toJSON", function () {
        return new Temporal.PlainDate(2026, 6, 30);
    }, "\"2026-06-30\"");

    checkStringify("Temporal.PlainTime.toJSON", function () {
        return new Temporal.PlainTime(12, 34, 56, 789);
    }, "\"12:34:56.789\"");

    checkStringify("Temporal.PlainYearMonth.toJSON", function () {
        return new Temporal.PlainYearMonth(2026, 6);
    }, "\"2026-06\"");

    checkStringify("Temporal.PlainMonthDay.toJSON", function () {
        return new Temporal.PlainMonthDay(6, 30);
    }, "\"06-30\"");

    checkStringify("mixed Date and Temporal object graph", function () {
        return {
            date: new Date(Date.UTC(2026, 5, 30, 0, 0, 0, 0)),
            duration: new Temporal.Duration(0, 0, 0, 2),
            plainDate: new Temporal.PlainDate(2026, 6, 30),
            plainTime: new Temporal.PlainTime(8, 15)
        };
    }, "{\"date\":\"2026-06-30T00:00:00.000Z\",\"duration\":\"P2D\",\"plainDate\":\"2026-06-30\",\"plainTime\":\"08:15:00\"}");

    test("Temporal toJSON runs before replacer", function () {
        function replacer(key, value) {
            if (key === "date") {
                assertEqual(typeof value, "string", "replacer receives toJSON result");
                return "seen:" + value;
            }
            return value;
        }

        function valueFactory() {
            return {date: new Temporal.PlainDate(2026, 6, 30)};
        }

        const expected = "{\"date\":\"seen:2026-06-30\"}";
        if (nativeJSON !== null) {
            assertEqual(nativeJSON.stringify(valueFactory(), replacer), expected, "Node native JSON reference");
        }
        assertEqual(JSON.stringify(valueFactory(), replacer), expected, "JSON polyfill");
    });

    checkStringify("toJSON returning undefined is omitted from objects", function () {
        return {
            keep: 1,
            omit: {
                toJSON: function () {
                    return undefined;
                }
            }
        };
    }, "{\"keep\":1}");

    test("toJSON exceptions propagate", function () {
        function valueFactory() {
            return {
                toJSON: function () {
                    throw new Error("toJSON failure");
                }
            };
        }

        if (nativeJSON !== null) {
            assertThrows(function () {
                nativeJSON.stringify(valueFactory());
            }, "toJSON failure", "Node native JSON reference");
        }
        assertThrows(function () {
            JSON.stringify(valueFactory());
        }, "toJSON failure", "JSON polyfill");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (isNodeRuntime) {
        Date.prototype.toISOString = nativeDateToISOString;
        Date.prototype.toJSON = nativeDateToJSON;
    }

    if (failed > 0) {
        throw new Error(failed + " JSON integration test(s) failed");
    }
}());
