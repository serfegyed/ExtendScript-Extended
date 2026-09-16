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
            path.join(__dirname, "../Lib/setIterator.js"),
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


    test("Set physically removes deleted and cleared records", function () {
        var set = new Set();
        var object;
        var i;
        for (i = 0; i < 1000; i++) {
            object = {index: i};
            set.add(object);
            set.delete(object);
            assertEqual(set._records.length, 0, "no deleted records retained");
        }
        set.add(1).add(2).add(3);
        set.delete(2);
        assertEqual(set._records.length, set.size, "dense record count");
        assertEqual(set._records[1].value, 3, "record order after deletion");
        set.clear();
        assertEqual(set._records.length, 0, "clear releases records");
        assertEqual(set._data.length, 0, "clear releases values");
    });

    test("Set iterators survive compaction and clear independently", function () {
        var set = new Set([1, 2, 3]);
        var first = set.values();
        var second = set.values();
        var entries = set.entries();
        assertEqual(first.next().value, 1, "first cursor");
        assertEqual(first.next().value, 2, "first cursor advanced");
        assertEqual(second.next().value, 1, "second cursor");
        assertArrayEqual(entries.next().value, [1, 1], "entry cursor");
        set.delete(1);
        set.delete(2);
        set.add(1);
        assertEqual(first.next().value, 3, "first survives shifts");
        assertEqual(second.next().value, 3, "second skips deleted value");
        assertArrayEqual(entries.next().value, [3, 3], "entries survive shifts");
        assertEqual(first.next().value, 1, "reinserted value at end");
        set.clear();
        set.add(4);
        assertEqual(first.next().value, 4, "first sees post-clear value");
        assertEqual(second.next().value, 4, "second sees post-clear value");
        assertArrayEqual(entries.next().value, [4, 4], "entries see post-clear value");
    });

    test("Set iterator completion is permanent", function () {
        var methods = ["values", "keys", "entries"];
        var i;
        var set;
        var iterator;
        for (i = 0; i < methods.length; i++) {
            set = new Set([1]);
            iterator = set[methods[i]]();
            iterator.next();
            assertEqual(iterator.next().done, true, "completed");
            set.clear();
            set.add(2);
            assertEqual(iterator.next().done, true, "stays completed");
            assertEqual(iterator.next().value, undefined, "completed value");
            set = new Set();
            iterator = set[methods[i]]();
            set.clear();
            set.add(3);
            assertEqual(iterator.next().done, false, "unstarted iterator stays live");
            set = new Set();
            iterator = set[methods[i]]();
            assertEqual(iterator.next().done, true, "empty iterator completes");
            set.add(1);
            assertEqual(iterator.next().done, true, "empty iterator stays completed");
        }
    });

    test("Set forEach supports clear and nested iteration", function () {
        var set = new Set([1, 2, 3]);
        var outer = [];
        var inner = [];
        var threw = false;
        set.forEach(function (value) {
            outer.push(value);
            if (value === 1) {
                set.forEach(function (nested) {
                    inner.push(nested);
                    if (nested === 1) {
                        set.clear();
                        set.add(4);
                    }
                });
            }
        });
        assertArrayEqual(outer, [1, 4], "outer live iteration");
        assertArrayEqual(inner, [1, 4], "inner live iteration");
        try {
            set.forEach(function () { throw new Error("stop"); });
        } catch (error) {
            threw = true;
            assertEqual(error.message, "stop", "callback error propagates");
        }
        assertEqual(threw, true, "callback error is not swallowed");
        set.clear();
        assertEqual(set._records.length, 0, "no iterator cleanup blocks clear");
    });


    test("Set compositions handle mutations in other.has", function () {
        var methods = ["intersection", "difference", "isSubsetOf", "isDisjointFrom"];
        var actions = ["deleteCurrent", "deleteNext", "clearAdd", "reinsert", "add"];
        var liveVisits = [[1, 2], [1], [1, 3], [1, 2, 1], [1, 2, 3]];
        var intersections = [[1, 2], [1], [1, 3], [1, 2], [1, 2, 3]];
        var relations = [true, true, false, true, false];
        var m;
        var a;

        function check(Constructor, method, action, expectedVisits, expectedResult) {
            var set = new Constructor([1, 2]);
            var visited = [];
            var changed = false;
            var other = {
                size: 10,
                keys: function () { fail("unexpected keys branch"); },
                has: function (value) {
                    visited.push(value);
                    if (!changed) {
                        changed = true;
                        if (action === "deleteCurrent") set.delete(1);
                        if (action === "deleteNext") set.delete(2);
                        if (action === "clearAdd") {
                            set.clear();
                            set.add(3);
                        }
                        if (action === "reinsert") {
                            set.delete(1);
                            set.add(1);
                        }
                        if (action === "add") set.add(3);
                    }
                    if (method === "isSubsetOf") return value !== 3;
                    if (method === "isDisjointFrom") return value === 3;
                    return true;
                }
            };
            var result = set[method](other);
            var label = method + " / " + action;
            assertArrayEqual(visited, expectedVisits, label + " visits");
            if (typeof expectedResult === "boolean") {
                assertEqual(result, expectedResult, label + " result");
            } else {
                assertArrayEqual(iteratorValues(result.values()), expectedResult,
                    label + " result");
            }
        }

        for (m = 0; m < methods.length; m++) {
            for (a = 0; a < actions.length; a++) {
                check(Set, methods[m], actions[a],
                    m === 1 ? [1, 2] : liveVisits[a],
                    m === 0 ? intersections[a] : (m === 1 ? [] : relations[a]));
                if (nativeSet) {
                    check(nativeSet, methods[m], actions[a],
                        m === 1 ? [1, 2] : liveVisits[a],
                        m === 0 ? intersections[a] : (m === 1 ? [] : relations[a]));
                }
            }
        }
    });

    test("Set difference preserves unmatched snapshot values after clear", function () {
        var set = new Set([1, 2]);
        var visited = [];
        var result = set.difference({
            size: 10,
            keys: function () { fail("unexpected keys branch"); },
            has: function (value) {
                visited.push(value);
                if (value === 1) {
                    set.clear();
                    set.add(3);
                }
                return value === 1;
            }
        });
        assertArrayEqual(visited, [1, 2], "original snapshot visited");
        assertArrayEqual(iteratorValues(result.values()), [2], "unmatched original kept");
        assertArrayEqual(iteratorValues(set.values()), [3], "source mutation retained");
    });


    test("Set normalizes negative zero on every insertion", function () {
        function check(Constructor) {
            var set = new Constructor([-0]);
            var pair;
            assertEqual(1 / set.values().next().value, Infinity, "constructor positive zero");
            set.clear();
            set.add(-0).add(0);
            assertEqual(set.size, 1, "signed zeros share one entry");
            assertEqual(set.has(-0), true, "negative zero membership");
            assertEqual(set.has(0), true, "positive zero membership");
            assertEqual(1 / set.values().next().value, Infinity, "values positive zero");
            assertEqual(1 / set.keys().next().value, Infinity, "keys positive zero");
            pair = set.entries().next().value;
            assertEqual(1 / pair[0], Infinity, "entry key positive zero");
            assertEqual(1 / pair[1], Infinity, "entry value positive zero");
            set.forEach(function (value, key) {
                assertEqual(1 / value, Infinity, "callback value positive zero");
                assertEqual(1 / key, Infinity, "callback key positive zero");
            });
            assertEqual(set.delete(-0), true, "negative zero deletes positive zero");
            set.add(-0);
            assertEqual(1 / set.values().next().value, Infinity, "reinsertion positive zero");
            set.clear();
            set.add(0).add(-0);
            assertEqual(set.size, 1, "reverse insertion order deduplicates");
            assertEqual(1 / set.values().next().value, Infinity, "positive zero remains positive");
            set.add("0").add(false).add(null);
            assertEqual(set.size, 4, "zero-like values are not coerced");
        }
        check(Set);
        if (nativeSet) check(nativeSet);
    });


    test("Set-like iterators capture next and preserve its receiver", function () {
        var methods = ["union", "intersection", "difference", "symmetricDifference", "isSupersetOf", "isDisjointFrom"];
        var constructors = [Set];
        var c;
        var m;
        if (nativeSet) constructors.push(nativeSet);
        for (c = 0; c < constructors.length; c++) {
            for (m = 0; m < methods.length; m++) {
                var calls = 0;
                var closes = 0;
                var value = methods[m] === "isDisjointFrom" ? 3 : 1;
                var iterator = {
                    next: function () {
                        assertEqual(this, iterator, "next receiver");
                        this.next = null;
                        calls++;
                        return calls === 1 ? {value: value, done: false} : {done: true};
                    }
                };
                iterator["return"] = function () { closes++; return {}; };
                var result = new constructors[c]([1, 2])[methods[m]]({
                    size: 1,
                    has: function () { return false; },
                    keys: function () { return iterator; }
                });
                assertEqual(calls, 2, methods[m] + " captured next");
                assertEqual(closes, 0, "normal completion does not close");
                if (typeof result === "boolean") assertEqual(result, true, "relation result");
                else assertArrayEqual(iteratorValues(result.values()),
                    methods[m] === "intersection" ? [1] :
                        (methods[m] === "union" ? [1, 2] : [2]), methods[m] + " result");
            }
        }
    });

    test("Set-like next results must be objects", function () {
        var methods = ["union", "intersection", "difference", "symmetricDifference", "isSupersetOf", "isDisjointFrom"];
        var invalid = [undefined, null, 5, false, "text"];
        var constructors = [Set];
        var c;
        var m;
        var v;
        if (nativeSet) constructors.push(nativeSet);
        for (c = 0; c < constructors.length; c++) {
            for (m = 0; m < methods.length; m++) {
                for (v = 0; v < invalid.length; v++) {
                    var calls = 0;
                    var closes = 0;
                    var threw = false;
                    var iterator = {next: function () {
                        calls++;
                        return calls === 1 ? invalid[v] : {done: true};
                    }};
                    iterator["return"] = function () { closes++; return {}; };
                    try {
                        new constructors[c]([1, 2])[methods[m]]({
                            size: 1,
                            has: function () { return false; },
                            keys: function () { return iterator; }
                        });
                    } catch (error) {
                        threw = true;
                        assertEqual(error instanceof TypeError, true, "invalid next result TypeError");
                    }
                    assertEqual(threw, true, methods[m] + " rejects primitive result");
                    assertEqual(closes, 0, "invalid next result does not close");
                }
            }
        }
    });

    test("Set relation early exits close Set-like iterators", function () {
        var methods = ["isSupersetOf", "isDisjointFrom"];
        var modes = ["object", "function", "absent", "null", "primitive", "noncallable", "throw"];
        var constructors = [Set];
        var c;
        var m;
        var v;
        if (nativeSet) constructors.push(nativeSet);
        for (c = 0; c < constructors.length; c++) {
            for (m = 0; m < methods.length; m++) {
                for (v = 0; v < modes.length; v++) {
                    var mode = modes[v];
                    var closes = 0;
                    var calls = 0;
                    var caught = null;
                    var marker = new Error("close failed");
                    var iterator = {next: function () {
                        calls++;
                        if (calls > 1) fail("early exit requested another item");
                        return {value: m === 0 ? 9 : 1, done: false};
                    }};
                    if (mode === "null") iterator["return"] = null;
                    else if (mode === "noncallable") iterator["return"] = 5;
                    else if (mode !== "absent") iterator["return"] = function () {
                        assertEqual(this, iterator, "return receiver");
                        closes++;
                        if (mode === "throw") throw marker;
                        if (mode === "primitive") return 5;
                        if (mode === "function") return function () {};
                        return {};
                    };
                    try {
                        var result = new constructors[c]([1, 2])[methods[m]]({
                            size: 1,
                            has: function () { return false; },
                            keys: function () { return iterator; }
                        });
                        assertEqual(result, false, "early result");
                    } catch (error) { caught = error; }
                    if (mode === "throw") assertEqual(caught, marker, "return error propagates");
                    else if (mode === "primitive" || mode === "noncallable") {
                        assertEqual(caught instanceof TypeError, true, "invalid return TypeError");
                    } else assertEqual(caught, null, "successful close");
                    assertEqual(closes, mode === "absent" || mode === "null" || mode === "noncallable" ? 0 : 1,
                        "return call count");
                }
            }
        }
    });

    test("Set-like next errors propagate without closing", function () {
        var methods = ["union", "intersection", "difference", "symmetricDifference", "isSupersetOf", "isDisjointFrom"];
        var constructors = [Set];
        var c;
        var m;
        if (nativeSet) constructors.push(nativeSet);
        for (c = 0; c < constructors.length; c++) {
            for (m = 0; m < methods.length; m++) {
                var marker = new Error("next failed");
                var caught = null;
                var closes = 0;
                var iterator = {next: function () { throw marker; }};
                iterator["return"] = function () { closes++; return {}; };
                try {
                    new constructors[c]([1, 2])[methods[m]]({
                        size: 1,
                        has: function () { return false; },
                        keys: function () { return iterator; }
                    });
                } catch (error) { caught = error; }
                assertEqual(caught, marker, "next error identity");
                assertEqual(closes, 0, "next error does not close");
            }
        }
    });


    test("Set compositions keep captured Set-like methods", function () {
        var seen = [];
        var other = {
            size: 3,
            has: function (value) {
                assertEqual(this, other, "has receiver");
                seen.push(value);
                other.has = function () { fail("replacement has called"); };
                return true;
            },
            keys: function () { fail("unexpected keys branch"); }
        };
        assertEqual(new Set([1, 2]).isSubsetOf(other), true, "captured has result");
        assertArrayEqual(seen, [1, 2], "captured has used throughout");
        var originalHas = function () { return true; };
        var originalKeys = function () { return {next: function () { return {done: true}; }}; };
        other = {size: 1, has: originalHas, keys: originalKeys};
        var record = __getSetRecord__(other);
        other.has = null;
        other.keys = null;
        assertEqual(record.object, other, "captured receiver");
        assertEqual(record.has, originalHas, "captured has identity");
        assertEqual(record.keys, originalKeys, "captured keys identity");
    });

    if (nativeSet) {
        test("Set-like accessors are read once in order (Node)", function () {
            var constructors = [Set, nativeSet];
            var c;
            var invalid;
            for (c = 0; c < constructors.length; c++) {
                for (invalid = 0; invalid < 2; invalid++) {
                    var reads = [];
                    var hasReads = 0;
                    var keysReads = 0;
                    var other = {};
                    var caught = null;
                    Object.defineProperty(other, "size", {get: function () {
                        reads.push("size");
                        return 0;
                    }});
                    Object.defineProperty(other, "has", {get: function () {
                        reads.push("has");
                        hasReads++;
                        return invalid || hasReads > 1 ? null : function () { return false; };
                    }});
                    Object.defineProperty(other, "keys", {get: function () {
                        reads.push("keys");
                        keysReads++;
                        return keysReads > 1 ? null : function () {
                            assertEqual(this, other, "keys receiver");
                            return {next: function () { return {done: true}; }};
                        };
                    }});
                    try { new constructors[c]().union(other); }
                    catch (error) { caught = error; }
                    if (invalid) {
                        assertEqual(caught instanceof TypeError, true, "invalid has rejected");
                        assertArrayEqual(reads, ["size", "has"], "keys not read after invalid has");
                    } else {
                        assertEqual(caught, null, "first method values captured");
                        assertArrayEqual(reads, ["size", "has", "keys"], "one read in order");
                    }
                }
            }
        });
    } else {
        console.log("SKIP: Set-like accessor read-count test requires native Node getters.");
    }

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " standard Set test(s) failed");
    }
}());
