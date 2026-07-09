/*
 * Non-standard Set extension tests.
 */
//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;

if (isNodeRuntime) {
    Set = undefined;
}

//@include "../Set_standard.js"
//@include "../Lib/isSet.js"
//@include "../Lib/isEmpty.js"
//@include "../Lib/toArray.js"
//@include "../Lib/toString.js"
//@include "../Lib/join.js"
//@include "../Lib/every.js"
//@include "../Lib/some.js"
//@include "../Lib/find.js"
//@include "../Lib/filter.js"
//@include "../Lib/map.js"
//@include "../Lib/reduce.js"
//@include "../Lib/addAll.js"
//@include "../Lib/addEach.js"
//@include "../Lib/deleteAll.js"
//@include "../Lib/deleteEach.js"
//@include "../Lib/from.js"
//@include "../Lib/isEqual.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            "../external.js",
            "../Set_basic.js",
            "../Lib/clear.js",
            "../Lib/values.js",
            "../Lib/keys.js",
            "../Lib/entries.js",
            "../Lib/forEach.js",
            "../Lib/getSetRecord.js",
            "../Lib/union.js",
            "../Lib/intersection.js",
            "../Lib/difference.js",
            "../Lib/symmetricDifference.js",
            "../Lib/isDisjointFrom.js",
            "../Lib/isSubsetOf.js",
            "../Lib/isSupersetOf.js",
            "../Lib/isSet.js",
            "../Lib/isEmpty.js",
            "../Lib/toArray.js",
            "../Lib/toString.js",
            "../Lib/join.js",
            "../Lib/every.js",
            "../Lib/some.js",
            "../Lib/find.js",
            "../Lib/filter.js",
            "../Lib/map.js",
            "../Lib/reduce.js",
            "../Lib/addAll.js",
            "../Lib/addEach.js",
            "../Lib/deleteAll.js",
            "../Lib/deleteEach.js",
            "../Lib/from.js",
            "../Lib/isEqual.js"
        ];
        var i;
        var source;

        for (i = 0; i < filenames.length; i++) {
            source = fs.readFileSync(path.join(__dirname, filenames[i]), "utf8");
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

    test("Set query and output extensions are installed", function () {
        var set = new Set();

        assertEqual(typeof Set.isSet, "function", "Set.isSet");
        assertEqual(typeof Set.isEmpty, "function", "Set.isEmpty");
        assertEqual(typeof set.toArray, "function", "Set.prototype.toArray");
        assertEqual(typeof set.toString, "function", "Set.prototype.toString");
        assertEqual(typeof set.join, "function", "Set.prototype.join");
    });

    test("Set.isSet and Set.isEmpty classify project Sets", function () {
        assertEqual(Set.isSet(new Set()), true, "Set instance");
        assertEqual(Set.isSet({}), false, "plain object");
        assertEqual(Set.isSet(null), false, "null");
        assertEqual(Set.isEmpty(new Set()), true, "empty Set");
        assertEqual(Set.isEmpty(new Set([1])), false, "non-empty Set");
        assertThrowsTypeError(function () {
            Set.isEmpty(null);
        }, "null value");
        assertThrowsTypeError(function () {
            Set.isEmpty({});
        }, "plain object");
    });

    test("Set toArray, toString, and join expose independent output", function () {
        var set = new Set([1, "two", 3]);
        var array = set.toArray();

        assertEqual(array.length, 3, "array length");
        assertEqual(array[1], "two", "array value");
        array[0] = 99;
        assertEqual(set.has(1), true, "array is independent");
        assertEqual(set.toString(), '{1, "two", 3}', "Set string");
        assertEqual(set.join(), "1,two,3", "default join");
        assertEqual(set.join(" | "), "1 | two | 3", "custom join");
        assertEqual(new Set().toString(), "{}", "empty Set string");
    });

    test("Set predicate and search extensions are installed", function () {
        var set = new Set();

        assertEqual(typeof set.every, "function", "Set.prototype.every");
        assertEqual(typeof set.some, "function", "Set.prototype.some");
        assertEqual(typeof set.find, "function", "Set.prototype.find");
    });

    test("Set predicates and find use value-value-set callbacks", function () {
        var set = new Set([1, 2, 3]);
        var context = {limit: 3};

        assertEqual(set.every(function (value, key, receiver) {
            assertEqual(this, context, "every thisArg");
            assertEqual(key, value, "every key equals value");
            assertEqual(receiver, set, "every receiver");
            return value <= this.limit;
        }, context), true, "every result");
        assertEqual(set.some(function (value, key, receiver) {
            assertEqual(key, value, "some key equals value");
            assertEqual(receiver, set, "some receiver");
            return value === 2;
        }), true, "some result");
        assertEqual(set.find(function (value, key, receiver) {
            assertEqual(key, value, "find key equals value");
            assertEqual(receiver, set, "find receiver");
            return value > 1;
        }), 2, "find result");
        assertEqual(set.find(function () { return false; }), undefined,
            "find missing result");
    });

    test("Set predicates short-circuit and follow live values", function () {
        var set = new Set([1, 2, 3]);
        var calls = 0;
        var visited = [];

        assertEqual(set.some(function (value) {
            calls++;
            return value === 2;
        }), true, "some short-circuit result");
        assertEqual(calls, 2, "some callback count");

        set.every(function (value) {
            visited.push(value);
            if (value === 1) {
                set.delete(1);
                set.add(4);
            }
            return true;
        });
        assertEqual(visited.join(","), "1,2,3,4", "live iteration order");
        assertThrowsTypeError(function () {
            set.every(null);
        }, "every callback");
        assertThrowsTypeError(function () {
            set.some(null);
        }, "some callback");
        assertThrowsTypeError(function () {
            set.find(null);
        }, "find callback");
    });

    test("Set transformation extensions are installed", function () {
        var set = new Set();

        assertEqual(typeof set.filter, "function", "Set.prototype.filter");
        assertEqual(typeof set.map, "function", "Set.prototype.map");
        assertEqual(typeof set.reduce, "function", "Set.prototype.reduce");
    });

    test("Set filter and map use value-value-set callbacks", function () {
        var set = new Set([1, 2, 3]);
        var context = {factor: 10};
        var filtered = set.filter(function (value, key, receiver) {
            assertEqual(key, value, "filter key equals value");
            assertEqual(receiver, set, "filter receiver");
            return value % 2;
        });
        var mapped = set.map(function (value, key, receiver) {
            assertEqual(this, context, "map thisArg");
            assertEqual(key, value, "map key equals value");
            assertEqual(receiver, set, "map receiver");
            return value % 2 ? this.factor : 20;
        }, context);

        assertEqual(filtered.toArray().join(","), "1,3", "filtered values");
        assertEqual(mapped.toArray().join(","), "10,20", "mapped duplicates collapse");
        assertEqual(set.toArray().join(","), "1,2,3", "source unchanged");
        assertThrowsTypeError(function () {
            set.filter(null);
        }, "filter callback");
        assertThrowsTypeError(function () {
            set.map(null);
        }, "map callback");
    });

    test("Set reduce handles initial values and callback arguments", function () {
        var set = new Set([1, 2, 3]);
        var rows = [];

        assertEqual(set.reduce(function (accumulator, value, key, receiver) {
            assertEqual(key, value, "reduce key equals value");
            assertEqual(receiver, set, "reduce receiver");
            rows.push(value);
            return accumulator + value;
        }), 6, "reduce without initial value");
        assertEqual(rows.join(","), "2,3", "first value used as accumulator");
        assertEqual(set.reduce(function (accumulator, value) {
            return String(accumulator) + value;
        }, ""), "123", "empty-string initial value");
        assertEqual(new Set().reduce(function () {
            fail("empty reducer callback should not run");
        }, undefined), undefined, "explicit undefined initial value");
        assertEqual(new Set([1]).reduce(function () {
            return undefined;
        }, 0), undefined, "undefined callback result");
        assertThrowsTypeError(function () {
            new Set().reduce(function () {});
        }, "empty Set without initial value");
        assertThrowsTypeError(function () {
            set.reduce(null, 0);
        }, "reduce callback");
    });

    test("Set bulk mutation extensions are installed", function () {
        var set = new Set();

        assertEqual(typeof set.addAll, "function", "Set.prototype.addAll");
        assertEqual(typeof set.addEach, "function", "Set.prototype.addEach");
        assertEqual(typeof set.deleteAll, "function", "Set.prototype.deleteAll");
        assertEqual(typeof set.deleteEach, "function", "Set.prototype.deleteEach");
    });

    test("Set addAll and addEach follow project array rules", function () {
        var set = new Set([1]);
        var context = {minimum: 3};

        assertEqual(set.addAll([1, 2, 3]), set, "addAll receiver");
        assertEqual(set.toArray().join(","), "1,2,3", "addAll values");
        assertEqual(set.addEach([2, 3, 4, 5], function (value, index, receiver) {
            assertEqual(this, context, "addEach thisArg");
            assertEqual(receiver, set, "addEach receiver argument");
            return value >= this.minimum && index % 2 === 1;
        }, context), set, "addEach receiver");
        assertEqual(set.toArray().join(","), "1,2,3,5", "addEach values");
        assertThrowsTypeError(function () {
            set.addAll(null);
        }, "addAll values");
        assertThrowsTypeError(function () {
            set.addEach({}, function () {});
        }, "addEach values");
        assertThrowsTypeError(function () {
            set.addEach([], null);
        }, "addEach callback");
    });

    test("Set deleteAll and deleteEach mutate the receiver safely", function () {
        var set = new Set([1, 2, 3, 4]);
        var context = {limit: 4};
        var visited = [];

        assertEqual(set.deleteAll(2, "missing"), set, "deleteAll receiver");
        assertEqual(set.has(2), false, "deleteAll removed value");
        assertEqual(set.deleteEach(function (value, index, receiver) {
            assertEqual(this, context, "deleteEach thisArg");
            assertEqual(receiver, set, "deleteEach receiver argument");
            visited.push(value + ":" + index);
            if (value === 1) set.add(5);
            return value < this.limit;
        }, context), set, "deleteEach receiver");
        assertEqual(visited.join(","), "1:0,3:1,4:2", "snapshot callback rows");
        assertEqual(set.toArray().join(","), "4,5", "deleteEach result");
        assertThrowsTypeError(function () {
            set.deleteEach(null);
        }, "deleteEach callback");
    });

    test("Set aggregation and equality extensions are installed", function () {
        var set = new Set();

        assertEqual(typeof set.from, "function", "Set.prototype.from");
        assertEqual(typeof set.isEqual, "function", "Set.prototype.isEqual");
    });

    test("Set from aggregates project source forms", function () {
        var set = new Set([0]);
        var arrayLike = {0: "x", 1: "y", length: 2};

        assertEqual(set.from([1, 2], new Set([2, 3]), arrayLike,
            {first: 1, second: 2}, "text", null, undefined), set,
            "from receiver");
        assertEqual(set.toArray().join(","),
            "0,1,2,3,x,y,first,second,text,,",
            "aggregated values");
        assertEqual(set.has(null), true, "null primitive");
        assertEqual(set.has(undefined), true, "undefined primitive");

        set = new Set();
        set.from([], {});
        assertEqual(set.size, 0, "empty collections are no-ops");
    });

    test("Set isEqual compares membership with SameValueZero", function () {
        var object = {};
        var left = new Set([NaN, 0, object]);

        assertEqual(left.isEqual(new Set([object, -0, NaN])), true,
            "equal reordered Set");
        assertEqual(left.isEqual(new Set([NaN, 0, {}])), false,
            "different object identity");
        assertEqual(left.isEqual(new Set([NaN, 0])), false,
            "different size");
        assertThrowsTypeError(function () {
            left.isEqual({});
        }, "isEqual value");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " non-standard Set test(s) failed");
    }
}());
