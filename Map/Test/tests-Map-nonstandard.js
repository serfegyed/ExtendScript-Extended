/*
 * Non-standard Map extension tests.
 */
//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;

if (isNodeRuntime) {
    Map = undefined;
}

//@include "../Map_standard.js"
//@include "../Lib/isMap.js"
//@include "../Lib/isEmpty.js"
//@include "../Lib/includes.js"
//@include "../Lib/keyOf.js"
//@include "../Lib/every.js"
//@include "../Lib/some.js"
//@include "../Lib/find.js"
//@include "../Lib/findKey.js"
//@include "../Lib/filter.js"
//@include "../Lib/mapKeys.js"
//@include "../Lib/mapValues.js"
//@include "../Lib/reduce.js"
//@include "../Lib/toArray.js"
//@include "../Lib/toString.js"
//@include "../Lib/deleteAll.js"
//@include "../Lib/deleteEach.js"
//@include "../Lib/setAll.js"
//@include "../Lib/setEach.js"
//@include "../Lib/from.js"
//@include "../Lib/merge.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            "../Map_basic.js",
            "../Lib/clear.js",
            "../Lib/forEach.js",
            "../Lib/keys.js",
            "../Lib/values.js",
            "../Lib/entries.js",
            "../Lib/groupBy.js",
            "../Lib/isMap.js",
            "../Lib/isEmpty.js",
            "../Lib/includes.js",
            "../Lib/keyOf.js",
            "../Lib/every.js",
            "../Lib/some.js",
            "../Lib/find.js",
            "../Lib/findKey.js",
            "../Lib/filter.js",
            "../Lib/mapKeys.js",
            "../Lib/mapValues.js",
            "../Lib/reduce.js",
            "../Lib/toArray.js",
            "../Lib/toString.js",
            "../Lib/deleteAll.js",
            "../Lib/deleteEach.js",
            "../Lib/setAll.js",
            "../Lib/setEach.js",
            "../Lib/from.js",
            "../Lib/merge.js"
        ];
        var i;
        var source;

        for (i = 0; i < filenames.length; i++) {
            source = fs.readFileSync(path.join(__dirname, filenames[i]), "utf8");
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

    function assertThrowsTypeError(callback, message) {
        try {
            callback();
            fail(message + ": expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true, message + " TypeError");
        }
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

    test("Map query extensions are installed", function () {
        var map = new Map();

        assertEqual(typeof Map.isMap, "function", "Map.isMap");
        assertEqual(typeof Map.isEmpty, "function", "Map.isEmpty");
        assertEqual(typeof map.includes, "function", "Map.prototype.includes");
        assertEqual(typeof map.keyOf, "function", "Map.prototype.keyOf");
    });

    test("Map.isMap and Map.isEmpty classify project Maps", function () {
        assertEqual(Map.isMap(new Map()), true, "Map instance");
        assertEqual(Map.isMap({}), false, "plain object");
        assertEqual(Map.isMap(null), false, "null");
        assertEqual(Map.isEmpty(new Map()), true, "empty Map");
        assertEqual(Map.isEmpty(new Map([["a", 1]])), false, "non-empty Map");
        assertThrowsTypeError(function () {
            Map.isEmpty(null);
        }, "null value");
    });

    test("Map includes and keyOf use SameValueZero values", function () {
        var map = new Map([["first", NaN], ["second", 0], ["third", undefined]]);

        assertEqual(map.includes(NaN), true, "includes NaN");
        assertEqual(map.includes(-0), true, "includes signed zero");
        assertEqual(map.includes("missing"), false, "missing value");
        assertEqual(map.keyOf(NaN), "first", "NaN key");
        assertEqual(map.keyOf(-0), "second", "signed-zero key");
        assertEqual(map.keyOf(undefined), "third", "undefined key");
        assertEqual(map.keyOf("missing"), undefined, "missing key");
        assertThrowsTypeError(function () {
            map.includes();
        }, "includes missing argument");
        assertThrowsTypeError(function () {
            map.keyOf();
        }, "keyOf missing argument");
    });

    test("Map predicate and search extensions are installed", function () {
        var map = new Map();

        assertEqual(typeof map.every, "function", "Map.prototype.every");
        assertEqual(typeof map.some, "function", "Map.prototype.some");
        assertEqual(typeof map.find, "function", "Map.prototype.find");
        assertEqual(typeof map.findKey, "function", "Map.prototype.findKey");
    });

    test("Map predicates and searches use value-key-map callbacks", function () {
        var map = new Map([["a", 1], ["b", 2], ["c", 3]]);
        var context = {limit: 3};

        assertEqual(map.every(function (value, key, receiver) {
            assertEqual(this, context, "every thisArg");
            assertEqual(receiver, map, "every receiver");
            return value <= this.limit && key.length === 1;
        }, context), true, "every result");
        assertEqual(map.some(function (value) {
            return value === 2;
        }), true, "some result");
        assertEqual(map.find(function (value) {
            return value > 1;
        }), 2, "find result");
        assertEqual(map.findKey(function (value) {
            return value > 1;
        }), "b", "findKey result");
        assertEqual(map.find(function () {
            return false;
        }), undefined, "find missing result");
    });

    test("Map predicates short-circuit and follow live entries", function () {
        var map = new Map([["a", 1], ["b", 2], ["c", 3]]);
        var calls = 0;
        var visited = [];

        assertEqual(map.some(function (value) {
            calls++;
            return value === 2;
        }), true, "some short-circuit result");
        assertEqual(calls, 2, "some callback count");

        map.every(function (value, key) {
            visited.push(key);
            if (key === "a") {
                map.delete("a");
                map.set("d", 4);
            }
            return true;
        });
        assertEqual(visited.join(","), "a,b,c,d", "live iteration order");

        assertThrowsTypeError(function () {
            map.every(null);
        }, "every callback");
        assertThrowsTypeError(function () {
            map.some(null);
        }, "some callback");
        assertThrowsTypeError(function () {
            map.find(null);
        }, "find callback");
        assertThrowsTypeError(function () {
            map.findKey(null);
        }, "findKey callback");
    });

    test("Map transformation extensions are installed", function () {
        var map = new Map();

        assertEqual(typeof map.filter, "function", "Map.prototype.filter");
        assertEqual(typeof map.mapKeys, "function", "Map.prototype.mapKeys");
        assertEqual(typeof map.mapValues, "function", "Map.prototype.mapValues");
    });

    test("Map filter and mapValues use value-key-map callbacks", function () {
        var map = new Map([["a", 1], ["b", 2], ["c", 3]]);
        var context = {factor: 10};
        var filtered = map.filter(function (value, key, receiver) {
            assertEqual(receiver, map, "filter receiver");
            return value % 2 && key !== "c";
        });
        var mapped = map.mapValues(function (value, key, receiver) {
            assertEqual(this, context, "mapValues thisArg");
            assertEqual(receiver, map, "mapValues receiver");
            return key + value * this.factor;
        }, context);

        assertEqual(filtered.size, 1, "filtered size");
        assertEqual(filtered.get("a"), 1, "filtered value");
        assertEqual(mapped.get("a"), "a10", "first mapped value");
        assertEqual(mapped.get("c"), "c30", "last mapped value");
        assertEqual(map.get("a"), 1, "source unchanged");
    });

    test("Map mapKeys preserves project callback order and resolves collisions", function () {
        var map = new Map([["a", 1], ["bb", 2], ["c", 3]]);
        var context = {prefix: "k"};
        var mapped = map.mapKeys(function (key, value, receiver) {
            assertEqual(this, context, "mapKeys thisArg");
            assertEqual(receiver, map, "mapKeys receiver");
            return this.prefix + key.length + value % 2;
        }, context);

        assertEqual(mapped.size, 2, "colliding key count");
        assertEqual(mapped.get("k11"), 3, "later collision overwrites value");
        assertEqual(mapped.get("k20"), 2, "unique transformed key");
        assertThrowsTypeError(function () {
            map.filter(null);
        }, "filter callback");
        assertThrowsTypeError(function () {
            map.mapKeys(null);
        }, "mapKeys callback");
        assertThrowsTypeError(function () {
            map.mapValues(null);
        }, "mapValues callback");
    });

    test("Map reduction and conversion extensions are installed", function () {
        var map = new Map();

        assertEqual(typeof map.reduce, "function", "Map.prototype.reduce");
        assertEqual(typeof map.toArray, "function", "Map.prototype.toArray");
        assertEqual(typeof map.toString, "function", "Map.prototype.toString");
    });

    test("Map reduce distinguishes missing and explicit initial values", function () {
        var map = new Map([["a", 1], ["b", 2], ["c", 3]]);
        var rows = [];

        assertEqual(map.reduce(function (accumulator, value, key, receiver) {
            assertEqual(receiver, map, "reduce receiver");
            rows.push(key);
            return accumulator + value;
        }), 6, "reduce without initial value");
        assertEqual(rows.join(","), "b,c", "first value used as accumulator");
        assertEqual(map.reduce(function (accumulator, value) {
            return accumulator + value;
        }, 0), 6, "zero initial value");
        assertEqual(new Map().reduce(function () {
            fail("empty reducer callback should not run");
        }, undefined), undefined, "explicit undefined initial value");
        assertEqual(new Map([["a", 1]]).reduce(function () {
            return undefined;
        }, 0), undefined, "undefined callback result");
        assertThrowsTypeError(function () {
            new Map().reduce(function () {});
        }, "empty Map without initial value");
        assertThrowsTypeError(function () {
            map.reduce(null, 0);
        }, "reduce callback");
    });

    test("Map toArray and toString expose readable independent output", function () {
        var map = new Map([["a", 1], ["b", "two"]]);
        var array = map.toArray();

        assertEqual(array.length, 2, "array length");
        assertEqual(array[0][0], "a", "first array key");
        assertEqual(array[1][1], "two", "second array value");
        array[0][1] = 99;
        assertEqual(map.get("a"), 1, "array pairs are independent");
        assertEqual(map.toString(), 'Map: <[a: 1], [b: "two"]>', "Map string");
        assertEqual(new Map().toString(), "Map: <>", "empty Map string");
    });

    test("Map bulk mutation extensions are installed", function () {
        var map = new Map();

        assertEqual(typeof map.deleteAll, "function", "Map.prototype.deleteAll");
        assertEqual(typeof map.deleteEach, "function", "Map.prototype.deleteEach");
        assertEqual(typeof map.setAll, "function", "Map.prototype.setAll");
        assertEqual(typeof map.setEach, "function", "Map.prototype.setEach");
    });

    test("Map deleteAll and deleteEach mutate and return the receiver", function () {
        var map = new Map([["a", 1], ["b", 2], ["c", 3], ["d", 4]]);
        var context = {limit: 4};

        assertEqual(map.deleteAll("missing", "d"), map, "deleteAll receiver");
        assertEqual(map.has("d"), false, "deleteAll removed key");
        assertEqual(map.deleteEach(function (value, key, receiver) {
            assertEqual(this, context, "deleteEach thisArg");
            assertEqual(receiver, map, "deleteEach callback receiver");
            return value < this.limit;
        }, context), map, "deleteEach receiver");
        assertEqual(map.size, 0, "adjacent matching entries deleted");
        assertThrowsTypeError(function () {
            map.deleteEach(null);
        }, "deleteEach callback");
    });

    test("Map setAll and setEach follow project array-pair rules", function () {
        var map = new Map([["a", 1]]);
        var pairs = [["a", 10], ["b", 2], ["ignored"], "invalid", ["c", 3]];
        var context = {minimum: 3};

        assertEqual(map.setAll([["b", 20], ["d", 4], ["bad"]]), map,
            "setAll receiver");
        assertEqual(map.get("b"), 20, "setAll updates key");
        assertEqual(map.get("d"), 4, "setAll adds key");
        assertEqual(map.setAll(), map, "setAll missing array is a no-op");

        assertEqual(map.setEach(pairs, function (value, key, receiver) {
            assertEqual(this, context, "setEach thisArg");
            assertEqual(receiver, map, "setEach callback receiver");
            return value >= this.minimum && key !== "a";
        }, context), map, "setEach receiver");
        assertEqual(map.get("a"), 1, "rejected update unchanged");
        assertEqual(map.has("b"), true, "existing key retained");
        assertEqual(map.get("c"), 3, "accepted pair added");
        assertThrowsTypeError(function () {
            map.setEach({}, function () {});
        }, "setEach entries");
        assertThrowsTypeError(function () {
            map.setEach([], null);
        }, "setEach callback");
    });

    test("Map construction and merge extensions are installed", function () {
        var map = new Map();

        assertEqual(typeof Map.from, "function", "Map.from");
        assertEqual(typeof map.merge, "function", "Map.prototype.merge");
    });

    test("Map.from supports project sources and mapping callbacks", function () {
        var source = new Map([["a", 1], ["b", 2]]);
        var context = {factor: 10};
        var copy = Map.from(source);
        var mapped = Map.from(source, function (value, key) {
            assertEqual(this, context, "Map.from thisArg");
            return [key.toUpperCase(), value * this.factor];
        }, context);
        var arrayLike = Map.from({0: "x", 1: "y", length: 2});
        var objectMap = Map.from({first: 1, second: 2});

        assertEqual(copy.get("a"), 1, "Map copy");
        assertEqual(mapped.get("A"), 10, "mapped first entry");
        assertEqual(mapped.get("B"), 20, "mapped second entry");
        assertEqual(arrayLike.get(0), "x", "array-like first entry");
        assertEqual(objectMap.get("second"), 2, "object property entry");
        assertEqual(Map.from([["a", 1], ["invalid"], ["b", 2]]).size, 2,
            "invalid array pairs skipped");
        assertThrowsTypeError(function () {
            Map.from(null);
        }, "Map.from source");
        assertThrowsTypeError(function () {
            Map.from([], null);
        }, "Map.from mapper");
        assertThrowsTypeError(function () {
            Map.from([["a", 1]], function () {
                return "invalid";
            });
        }, "Map.from mapper result");
    });

    test("Map merge updates the receiver in source order", function () {
        var map = new Map([["a", 1], ["b", 2]]);
        var other = new Map([["b", 20], ["c", 3]]);

        assertEqual(map.merge(other), map, "merge receiver");
        assertEqual(map.size, 3, "merged size");
        assertEqual(map.get("a"), 1, "original value retained");
        assertEqual(map.get("b"), 20, "overlapping value replaced");
        assertEqual(map.get("c"), 3, "new value added");
        assertThrowsTypeError(function () {
            map.merge({});
        }, "merge source");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " non-standard Map test(s) failed");
    }
}());
