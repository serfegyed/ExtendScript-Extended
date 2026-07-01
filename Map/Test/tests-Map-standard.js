/*
 * Standard Map polyfill reference and compatibility tests.
 *
 * ExtendScript processes include directives. Node.js preserves its native
 * Map as a behavior reference and loads the project implementation explicitly.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeMap = isNodeRuntime ? Map : null;

if (isNodeRuntime) {
    Map = undefined;
}

//@include "../Map_standard.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            path.join(__dirname, "../External/external.js"),
            path.join(__dirname, "../Map_basic.js"),
            path.join(__dirname, "../Lib/clear.js"),
            path.join(__dirname, "../Lib/forEach.js"),
            path.join(__dirname, "../Lib/keys.js"),
            path.join(__dirname, "../Lib/values.js"),
            path.join(__dirname, "../Lib/entries.js"),
            path.join(__dirname, "../Lib/groupBy.js"),
            path.join(__dirname, "../Lib/getOrInsert.js"),
            path.join(__dirname, "../Lib/getOrInsertComputed.js")
        ];
        var i;
        var source;

        for (i = 0; i < filenames.length; i++) {
            source = fs.readFileSync(filenames[i], "utf8");
            source = source.replace(/^\s*#include[^\r\n]*$/gm, "");
            (0, eval)(source);
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

    function assertArrayEqual(actual, expected, message) {
        var i;

        assertEqual(actual.length, expected.length, message + " length");
        for (i = 0; i < expected.length; i++) {
            assertEqual(actual[i], expected[i], message + " row " + i);
        }
    }

    function iteratorValues(iterator) {
        var values = [];
        var item = iterator.next();

        while (!item.done) {
            values.push(item.value);
            item = iterator.next();
        }
        assertEqual(item.value, undefined, "completed iterator value");
        return values;
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

    test("Map constructor and basic methods are installed", function () {
        var map = new Map();

        assertEqual(typeof Map, "function", "Map constructor");
        assertEqual(typeof map.set, "function", "Map.prototype.set");
        assertEqual(typeof map.get, "function", "Map.prototype.get");
        assertEqual(typeof map.has, "function", "Map.prototype.has");
        assertEqual(typeof map.delete, "function", "Map.prototype.delete");
        assertEqual(map.size, 0, "initial size");
        try {
            Map();
            fail("constructor without new: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true,
                "constructor without new TypeError");
        }
    });

    test("Map constructor initializes array entries", function () {
        var map = new Map([["a", 1], ["b", 2], ["a", 3], ["ignored"]]);

        assertEqual(map.size, 2, "project Map size");
        assertEqual(map.get("a"), 3, "duplicate key updated");
        assertEqual(map.get("b"), 2, "second entry");
        assertEqual(map.has("ignored"), false, "invalid row skipped");
        if (nativeMap) {
            assertEqual(new nativeMap([["a", 1], ["b", 2], ["a", 3]]).size, 2,
                "Node reference size");
        }
    });

    test("Map set, get, and has use SameValueZero keys", function () {
        var map = new Map();
        var object = {};
        var returned = map.set(NaN, "nan").set(-0, "zero").set(object, "object");

        assertEqual(returned, map, "set returns receiver");
        assertEqual(map.size, 3, "size after inserts");
        assertEqual(map.get(NaN), "nan", "NaN key");
        assertEqual(map.has(0), true, "signed-zero key");
        assertEqual(map.get(object), "object", "object identity key");
        assertEqual(map.has({}), false, "different object key");

        map.set(NaN, "updated");
        assertEqual(map.size, 3, "update keeps size");
        assertEqual(map.get(NaN), "updated", "updated value");
    });

    test("Map delete reports success and updates size", function () {
        var map = new Map([["a", 1], ["b", 2]]);

        assertEqual(map.delete("a"), true, "existing key");
        assertEqual(map.size, 1, "size after delete");
        assertEqual(map.has("a"), false, "deleted key absent");
        assertEqual(map.delete("a"), false, "missing key");
        assertEqual(map.size, 1, "missing delete keeps size");
    });

    test("Map clear and forEach are installed", function () {
        var map = new Map();

        assertEqual(typeof map.clear, "function", "Map.prototype.clear");
        assertEqual(typeof map.forEach, "function", "Map.prototype.forEach");
    });

    test("Map clear removes every entry", function () {
        var map = new Map([["a", 1], ["b", 2]]);
        var returned = map.clear();

        assertEqual(returned, undefined, "clear return value");
        assertEqual(map.size, 0, "cleared size");
        assertEqual(map.has("a"), false, "first key removed");
        assertEqual(map.has("b"), false, "second key removed");
    });

    test("Map forEach follows callback and live-entry behavior", function () {
        var map = new Map([["a", 1], ["b", 2]]);
        var context = {sum: 0};
        var rows = [];

        map.forEach(function (value, key, receiver) {
            assertEqual(this, context, "callback thisArg");
            assertEqual(receiver, map, "callback receiver");
            rows.push(key + value);
            this.sum += value;
            if (key === "a") {
                map.delete("a");
                map.set("c", 3);
            }
        }, context);

        assertEqual(rows.join(","), "a1,b2,c3", "callback order and added entry");
        assertEqual(context.sum, 6, "callback values");
        try {
            map.forEach(null);
            fail("invalid callback: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true, "invalid callback TypeError");
        }
    });

    test("Map iterator methods are installed", function () {
        var map = new Map();

        assertEqual(typeof map.keys, "function", "Map.prototype.keys");
        assertEqual(typeof map.values, "function", "Map.prototype.values");
        assertEqual(typeof map.entries, "function", "Map.prototype.entries");
    });

    test("Map keys and values preserve insertion order", function () {
        var map = new Map([["a", 1], ["b", 2], ["c", 3]]);

        assertArrayEqual(iteratorValues(map.keys()), ["a", "b", "c"], "keys");
        assertArrayEqual(iteratorValues(map.values()), [1, 2, 3], "values");
    });

    test("Map entries return independent key-value pairs", function () {
        var map = new Map([["a", 1], ["b", 2]]);
        var iterator = map.entries();
        var first = iterator.next();
        var second = iterator.next();
        var completed = iterator.next();

        assertEqual(first.done, false, "first entry done");
        assertArrayEqual(first.value, ["a", 1], "first entry");
        assertArrayEqual(second.value, ["b", 2], "second entry");
        assertEqual(completed.done, true, "completed entry iterator");
        assertEqual(completed.value, undefined, "completed entry value");

        first.value[1] = 99;
        assertEqual(map.get("a"), 1, "returned pair is independent");
    });

    test("Map iterators reflect deletions, updates, and additions", function () {
        var map = new Map([["a", 1], ["b", 2]]);
        var keys = map.keys();
        var values = map.values();

        assertEqual(keys.next().value, "a", "first key");
        assertEqual(values.next().value, 1, "first value");
        map.delete("b");
        map.set("c", 3);
        map.set("c", 4);

        assertEqual(keys.next().value, "c", "added key");
        assertEqual(keys.next().done, true, "deleted key skipped");
        assertEqual(values.next().value, 4, "updated value observed");
        assertEqual(values.next().done, true, "values completed");
    });

    test("Map.groupBy is installed", function () {
        assertEqual(typeof Map.groupBy, "function", "Map.groupBy");
    });

    test("Map.groupBy groups arrays and Map entries", function () {
        var arrayGroups = Map.groupBy([1, 2, 3, 4], function (value, index) {
            assertEqual(index, value - 1, "array callback index");
            return value % 2 ? "odd" : "even";
        });
        var sourceMap = new Map([["a", 1], ["b", 2], ["c", 3]]);
        var mapGroups = Map.groupBy(sourceMap, function (entry, index) {
            assertEqual(index, entry[1] - 1, "Map callback index");
            return entry[1] % 2 ? "odd" : "even";
        });

        assertArrayEqual(arrayGroups.get("odd"), [1, 3], "array odd group");
        assertArrayEqual(arrayGroups.get("even"), [2, 4], "array even group");
        assertEqual(mapGroups.get("odd").length, 2, "Map odd group length");
        assertArrayEqual(mapGroups.get("odd")[0], ["a", 1], "Map first odd entry");
        assertArrayEqual(mapGroups.get("odd")[1], ["c", 3], "Map second odd entry");
        assertArrayEqual(mapGroups.get("even")[0], ["b", 2], "Map even entry");
    });

    test("Map.groupBy supports forEach collections and validates arguments", function () {
        var collection = {
            forEach: function (callback) {
                callback("Ada", "ignored key");
                callback("Bob", "ignored key");
                callback("Amy", "ignored key");
            }
        };
        var groups = Map.groupBy(collection, function (value, index) {
            return value.charAt(0) + index % 2;
        });

        assertArrayEqual(groups.get("A0"), ["Ada", "Amy"], "forEach A group");
        assertArrayEqual(groups.get("B1"), ["Bob"], "forEach B group");
        try {
            Map.groupBy({}, function () {});
            fail("plain object: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true, "plain object TypeError");
        }
        try {
            Map.groupBy([], null);
            fail("invalid callback: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true, "callback TypeError");
        }
    });

    test("Map get-or-insert methods are installed", function () {
        var map = new Map();

        assertEqual(typeof map.getOrInsert, "function",
            "Map.prototype.getOrInsert");
        assertEqual(typeof map.getOrInsertComputed, "function",
            "Map.prototype.getOrInsertComputed");
    });

    test("Map getOrInsert returns existing values or inserts defaults", function () {
        var map = new Map([["existing", 1], ["undefined", undefined]]);

        assertEqual(map.getOrInsert("existing", 9), 1, "existing value");
        assertEqual(map.get("existing"), 1, "existing value unchanged");
        assertEqual(map.getOrInsert("missing", 2), 2, "inserted value");
        assertEqual(map.get("missing"), 2, "missing key inserted");
        assertEqual(map.getOrInsert("undefined", 3), undefined,
            "existing undefined value");
        assertEqual(map.get("undefined"), undefined,
            "existing undefined unchanged");
    });

    test("Map getOrInsertComputed follows callback and reentrant rules", function () {
        var map = new Map([["existing", 1]]);
        var calls = 0;
        var result;

        result = map.getOrInsertComputed("existing", function () {
            calls++;
            return 9;
        });
        assertEqual(result, 1, "existing result");
        assertEqual(calls, 0, "existing callback not called");

        result = map.getOrInsertComputed("missing", function (key) {
            calls++;
            assertEqual(arguments.length, 1, "callback argument count");
            assertEqual(key, "missing", "callback key");
            map.set(key, "intermediate");
            return "computed";
        });
        assertEqual(result, "computed", "computed result");
        assertEqual(map.get("missing"), "computed",
            "computed value replaces reentrant insertion");
        assertEqual(calls, 1, "missing callback called once");

        try {
            map.getOrInsertComputed("existing", null);
            fail("invalid callback: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true,
                "callback validated before lookup");
        }
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " standard Map test(s) failed");
    }
}());
