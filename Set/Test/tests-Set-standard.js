/*
 * Standard Set polyfill reference and compatibility tests.
 */
//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeSet = isNodeRuntime ? Set : null;

if (isNodeRuntime) {
    Set = undefined;
}

//@include "../Set_standard.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            path.join(__dirname, "../Set_basic.js"),
            path.join(__dirname, "../Lib/clear.js"),
            path.join(__dirname, "../Lib/values.js"),
            path.join(__dirname, "../Lib/keys.js"),
            path.join(__dirname, "../Lib/entries.js"),
            path.join(__dirname, "../Lib/forEach.js"),
            path.join(__dirname, "../Lib/getSetRecord.js"),
            path.join(__dirname, "../Lib/union.js"),
            path.join(__dirname, "../Lib/intersection.js"),
            path.join(__dirname, "../Lib/difference.js"),
            path.join(__dirname, "../Lib/symmetricDifference.js"),
            path.join(__dirname, "../Lib/isDisjointFrom.js"),
            path.join(__dirname, "../Lib/isSubsetOf.js"),
            path.join(__dirname, "../Lib/isSupersetOf.js")
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

    function setLike(values) {
        return {
            size: values.length,
            has: function (value) {
                var i;
                for (i = 0; i < values.length; i++) {
                    if (values[i] === value) return true;
                }
                return false;
            },
            keys: function () {
                var index = 0;
                return {
                    next: function () {
                        if (index < values.length) {
                            return {value: values[index++], done: false};
                        }
                        return {value: undefined, done: true};
                    }
                };
            }
        };
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

    test("Set constructor and core methods are installed", function () {
        var set = new Set();

        assertEqual(typeof Set, "function", "Set constructor");
        assertEqual(typeof set.add, "function", "Set.prototype.add");
        assertEqual(typeof set.has, "function", "Set.prototype.has");
        assertEqual(typeof set.delete, "function", "Set.prototype.delete");
        assertEqual(typeof set.clear, "function", "Set.prototype.clear");
        assertEqual(set.size, 0, "initial size");
        try {
            Set();
            fail("constructor without new: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true,
                "constructor without new TypeError");
        }
    });

    test("Set constructor initializes arrays and project Sets", function () {
        var set = new Set([1, 2, 1, 3]);
        var copy = new Set(set);

        assertEqual(set.size, 3, "array duplicates removed");
        assertEqual(copy.size, 3, "Set copy size");
        assertEqual(copy.has(2), true, "Set copy value");
        set.add(4);
        assertEqual(copy.has(4), false, "Set copy is independent");
        if (nativeSet) {
            assertEqual(new nativeSet([1, 2, 1, 3]).size, 3,
                "Node reference size");
        }
    });

    test("Set add and has use SameValueZero and object identity", function () {
        var set = new Set();
        var object = {};
        var returned = set.add(NaN).add(NaN).add(-0).add(0).add(object);

        assertEqual(returned, set, "add returns receiver");
        assertEqual(set.size, 3, "unique value count");
        assertEqual(set.has(NaN), true, "NaN value");
        assertEqual(set.has(0), true, "signed-zero value");
        assertEqual(set.has(object), true, "object identity value");
        assertEqual(set.has({}), false, "different object value");
    });

    test("Set delete, clear, and size follow standard results", function () {
        var set = new Set([1, 2, 3]);

        assertEqual(set.delete(2), true, "existing delete result");
        assertEqual(set.delete(2), false, "missing delete result");
        assertEqual(set.size, 2, "size after delete");
        assertEqual(set.clear(), undefined, "clear result");
        assertEqual(set.size, 0, "size after clear");
        assertEqual(set.has(1), false, "cleared value absent");
    });

    test("Set iterator and forEach methods are installed", function () {
        var set = new Set();

        assertEqual(typeof set.values, "function", "Set.prototype.values");
        assertEqual(typeof set.keys, "function", "Set.prototype.keys");
        assertEqual(typeof set.entries, "function", "Set.prototype.entries");
        assertEqual(typeof set.forEach, "function", "Set.prototype.forEach");
        assertEqual(set.keys, set.values, "keys aliases values");
    });

    test("Set iterators preserve insertion order and independent pairs", function () {
        var set = new Set(["a", "b", "c"]);
        var entries = iteratorValues(set.entries());

        assertArrayEqual(iteratorValues(set.values()), ["a", "b", "c"],
            "values order");
        assertArrayEqual(iteratorValues(set.keys()), ["a", "b", "c"],
            "keys order");
        assertArrayEqual(entries[0], ["a", "a"], "first entry");
        assertArrayEqual(entries[2], ["c", "c"], "last entry");
        entries[0][0] = "changed";
        assertEqual(set.has("a"), true, "entry pair is independent");
    });

    test("Set iteration follows live deletion and insertion", function () {
        var set = new Set(["a", "b"]);
        var iterator = set.values();
        var context = {rows: []};

        assertEqual(iterator.next().value, "a", "first iterator value");
        set.delete("a");
        set.delete("b");
        set.add("c");
        assertEqual(iterator.next().value, "c", "new value observed");
        set.clear();
        set.add("d");
        assertEqual(iterator.next().value, "d", "post-clear value observed");
        assertEqual(iterator.next().done, true, "iterator completed");

        set = new Set([1, 2]);
        set.forEach(function (value, key, receiver) {
            assertEqual(this, context, "forEach thisArg");
            assertEqual(key, value, "Set callback key equals value");
            assertEqual(receiver, set, "forEach receiver");
            this.rows.push(value);
            if (value === 1) {
                set.delete(1);
                set.add(3);
            }
        }, context);
        assertArrayEqual(context.rows, [1, 2, 3], "forEach live order");
        try {
            new Set().forEach(null);
            fail("invalid callback: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true,
                "invalid callback TypeError");
        }
    });

    test("Set result composition methods are installed", function () {
        var set = new Set();

        assertEqual(typeof set.union, "function", "Set.prototype.union");
        assertEqual(typeof set.intersection, "function",
            "Set.prototype.intersection");
        assertEqual(typeof set.difference, "function", "Set.prototype.difference");
        assertEqual(typeof set.symmetricDifference, "function",
            "Set.prototype.symmetricDifference");
    });

    test("Set result compositions return ordered independent Sets", function () {
        var left = new Set([1, 2, 3]);
        var right = new Set([3, 4, 2]);

        assertArrayEqual(iteratorValues(left.union(right).values()), [1, 2, 3, 4],
            "union order");
        assertArrayEqual(iteratorValues(left.intersection(right).values()), [2, 3],
            "intersection order");
        assertArrayEqual(iteratorValues(left.difference(right).values()), [1],
            "difference order");
        assertArrayEqual(
            iteratorValues(left.symmetricDifference(right).values()),
            [1, 4], "symmetric difference order"
        );
        assertEqual(left.size, 3, "left source unchanged");
        assertEqual(right.size, 3, "right source unchanged");
    });

    test("Set result compositions accept validated Set-like objects", function () {
        var left = new Set([1, 2, 3, 4]);
        var other = setLike([3, 2]);

        assertArrayEqual(iteratorValues(left.intersection(other).values()), [3, 2],
            "smaller Set-like intersection order");
        assertArrayEqual(iteratorValues(left.difference(other).values()), [1, 4],
            "Set-like difference");
        assertArrayEqual(iteratorValues(left.union(setLike([4, 5])).values()),
            [1, 2, 3, 4, 5], "Set-like union");
        assertArrayEqual(
            iteratorValues(left.symmetricDifference(setLike([2, 5])).values()),
            [1, 3, 4, 5], "Set-like symmetric difference"
        );
        try {
            left.union({size: 1, has: function () { return false; }});
            fail("invalid Set-like value: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true,
                "invalid Set-like TypeError");
        }
    });

    test("Set relation composition methods are installed", function () {
        var set = new Set();

        assertEqual(typeof set.isDisjointFrom, "function",
            "Set.prototype.isDisjointFrom");
        assertEqual(typeof set.isSubsetOf, "function",
            "Set.prototype.isSubsetOf");
        assertEqual(typeof set.isSupersetOf, "function",
            "Set.prototype.isSupersetOf");
    });

    test("Set relation compositions return standard booleans", function () {
        var set = new Set([1, 2, 3]);

        assertEqual(set.isSubsetOf(new Set([0, 1, 2, 3])), true,
            "subset true");
        assertEqual(set.isSubsetOf(new Set([1, 2])), false,
            "subset false");
        assertEqual(set.isSupersetOf(new Set([2, 3])), true,
            "superset true");
        assertEqual(set.isSupersetOf(new Set([2, 4])), false,
            "superset false");
        assertEqual(set.isDisjointFrom(new Set([4, 5])), true,
            "disjoint true");
        assertEqual(set.isDisjointFrom(new Set([3, 4])), false,
            "disjoint false");
        assertEqual(new Set().isSubsetOf(new Set()), true,
            "empty subset");
        assertEqual(new Set().isDisjointFrom(set), true,
            "empty disjoint");
    });

    test("Set relation compositions accept Set-like objects", function () {
        var set = new Set([1, 2, 3, 4]);

        assertEqual(set.isSubsetOf(setLike([1, 2, 3, 4, 5])), true,
            "Set-like subset");
        assertEqual(set.isSupersetOf(setLike([4, 2])), true,
            "Set-like superset");
        assertEqual(set.isDisjointFrom(setLike([6, 7])), true,
            "Set-like disjoint");
        assertEqual(set.isDisjointFrom(setLike([7, 2])), false,
            "Set-like overlap");
        try {
            set.isSubsetOf({size: -1, has: function () {}, keys: function () {}});
            fail("negative Set-like size: expected an exception");
        } catch (error) {
            assertEqual(error instanceof RangeError, true,
                "negative size RangeError");
        }
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " standard Set test(s) failed");
    }
}());
