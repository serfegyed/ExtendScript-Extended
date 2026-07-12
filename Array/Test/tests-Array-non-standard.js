/*
 * Non-standard Array extension tests.
 */
//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;

//@include "../Lib/append.js"
//@include "../Lib/clear.js"
//@include "../Lib/compact.js"
//@include "../Lib/first.js"
//@include "../Lib/last.js"
//@include "../Lib/isEmpty.js"
//@include "../Lib/min.js"
//@include "../Lib/max.js"
//@include "../Lib/sum.js"
//@include "../Lib/indexAfter.js"
//@include "../Lib/rotate.js"
//@include "../Lib/insert.js"
//@include "../Lib/remove.js"
//@include "../Lib/pluck.js"
//@include "../Lib/reject.js"
//@include "../Lib/unique.js"
//@include "../Lib/isSorted.js"
//@include "../Lib/merge.js"
//@include "../Lib/random.js"
//@include "../Lib/shuffle.js"
//@include "../Lib/toShuffled.js"
//@include "../Lib/dim.js"
//@include "../Lib/info.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            "../Lib/isArray.js",
            "../Lib/flat.js",
            "../Lib/append.js",
            "../Lib/clear.js",
            "../Lib/compact.js",
            "../Lib/first.js",
            "../Lib/last.js",
            "../Lib/isEmpty.js",
            "../Lib/map.js",
            "../Lib/filter.js",
            "../Lib/reduce.js",
            "../Lib/min.js",
            "../Lib/max.js",
            "../Lib/sum.js",
            "../Lib/indexOf.js",
            "../Lib/indexAfter.js",
            "../Lib/rotate.js",
            "../Lib/insert.js",
            "../Lib/remove.js",
            "../Lib/pluck.js",
            "../Lib/reject.js",
            "../Lib/unique.js",
            "../Lib/isSorted.js",
            "../Lib/merge.js",
            "../Lib/random.js",
            "../Lib/shuffle.js",
            "../Lib/toShuffled.js",
            "../Lib/dim.js",
            "../Lib/info.js"
        ];
        var sources = [];
        var i;

        for (i = 0; i < filenames.length; i++) {
            sources[i] = fs.readFileSync(
                path.join(__dirname, filenames[i]), "utf8"
            ).replace(/^\s*#include[^\r\n]*$/gm, "");
        }

        Array.prototype.append = undefined;
        Array.prototype.clear = undefined;
        Array.prototype.compact = undefined;
        Array.prototype.first = undefined;
        Array.prototype.last = undefined;
        Array.isEmpty = undefined;
        Array.prototype.min = undefined;
        Array.prototype.max = undefined;
        Array.prototype.sum = undefined;
        Array.prototype.indexAfter = undefined;
        Array.prototype.rotate = undefined;
        Array.prototype.insert = undefined;
        Array.prototype.remove = undefined;
        Array.prototype.pluck = undefined;
        Array.prototype.reject = undefined;
        Array.prototype.unique = undefined;
        Array.isSorted = undefined;
        Array.prototype.merge = undefined;
        Array.prototype.random = undefined;
        Array.prototype.shuffle = undefined;
        Array.prototype.toShuffled = undefined;
        Array.prototype.dim = undefined;
        Array.info = undefined;

        for (i = 0; i < sources.length; i++) (0, eval)(sources[i]);
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

    function assertIndexedEqual(actual, expected, message) {
        var i;

        assertEqual(actual.length, expected.length, message + " length");
        for (i = 0; i < expected.length; i++) {
            assertEqual(i in actual, i in expected, message + " presence " + i);
            if (i in expected) {
                assertEqual(actual[i], expected[i], message + " value " + i);
            }
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

    function assertThrowsRangeError(callback, message) {
        try {
            callback();
            fail(message + ": expected an exception");
        } catch (error) {
            assertEqual(error instanceof RangeError, true, message + " RangeError");
        }
    }

    function withRandom(values, callback) {
        var original = Math.random;
        var index = 0;

        try {
            Math.random = function () {
                return values[index++];
            };
            return callback();
        } finally {
            Math.random = original;
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

    test("Basic non-standard Array methods are installed", function () {
        assertEqual(typeof Array.prototype.append, "function", "append");
        assertEqual(typeof Array.prototype.clear, "function", "clear");
        assertEqual(typeof Array.prototype.compact, "function", "compact");
        assertEqual(typeof Array.prototype.first, "function", "first");
        assertEqual(typeof Array.prototype.last, "function", "last");
        assertEqual(typeof Array.isEmpty, "function", "Array.isEmpty");
    });

    test("Array append mutates the receiver and optionally flattens", function () {
        var nested = [3];
        var target = [1];
        var returned = target.append([2, nested]);

        assertEqual(returned, target, "append return receiver");
        assertEqual(target[2], nested, "default append preserves nesting");
        target = [1];
        target.append([2, nested], 1);
        assertArrayEqual(target, [1, 2, 3], "depth-one append");
        assertThrowsTypeError(function () {
            target.append({0: 4, length: 1});
        }, "append non-Array");
    });

    test("Array clear, first, and last expose endpoint operations", function () {
        var array = [1, 2, 3];

        assertEqual(array.first(), 1, "first value");
        assertEqual(array.last(), 3, "last value");
        assertEqual(Array.prototype.last.call({0: "a", length: 1}), "a",
            "generic last");
        assertEqual(array.clear(), array, "clear return receiver");
        assertEqual(array.length, 0, "cleared length");
        assertEqual(array.first(), undefined, "empty first");
    });

    test("Array compact removes falsy values and isEmpty validates Arrays", function () {
        var compacted = [0, 1, false, 2, "", null, undefined, NaN].compact();

        assertArrayEqual(compacted, [1, 2], "compacted values");
        assertEqual(Array.isEmpty([]), true, "empty Array");
        assertEqual(Array.isEmpty([undefined]), false, "present undefined value");
        assertThrowsTypeError(function () {
            Array.isEmpty({length: 0});
        }, "array-like is not Array");
    });

    test("Array min and max skip holes and support mapped keys", function () {
        function ArrayLike() {}
        var object;
        var low = {name: "low", rank: 1};
        var high = {name: "high", rank: 9};

        ArrayLike.prototype[1] = high;
        object = new ArrayLike();
        object[3] = low;
        object.length = 5;
        assertEqual(Array.prototype.min.call(object, "rank"), low,
            "minimum mapped object");
        assertEqual(Array.prototype.max.call(object, function (item) {
            return item.rank;
        }), high, "maximum inherited mapped object");
        assertEqual(new Array(3).min(), undefined, "all-hole minimum");
        assertEqual([5, 2, 8].max(), 8, "numeric maximum");
        assertThrowsTypeError(function () {
            [1].min({});
        }, "invalid min mapper");
    });

    test("Array sum handles sparse values and property mapping", function () {
        function ArrayLike() {}
        var object;

        ArrayLike.prototype[1] = 2;
        object = new ArrayLike();
        object[3] = 4;
        object.length = 5;
        assertEqual(Array.prototype.sum.call(object), 6,
            "sparse inherited sum");
        assertEqual([{value: 2}, {value: 3}].sum("value"), 5,
            "property sum");
        assertEqual(["a", "b", "c"].sum(), "abc", "string concatenation");
        assertThrowsTypeError(function () {
            [].sum();
        }, "empty sum");
    });

    test("Array indexAfter and rotate are installed", function () {
        assertEqual(typeof Array.prototype.indexAfter, "function", "indexAfter");
        assertEqual(typeof Array.prototype.rotate, "function", "rotate");
    });

    test("Array indexAfter supports fromIndex and array-like receivers", function () {
        function ArrayLike() {}
        var object;

        ArrayLike.prototype[1] = "b";
        object = new ArrayLike();
        object[0] = "a";
        object[3] = "b";
        object[4] = "last";
        object.length = 5;
        assertEqual(Array.prototype.indexAfter.call(object, "b"), 2,
            "after inherited match");
        assertEqual(Array.prototype.indexAfter.call(object, "b", 2), 4,
            "after later match");
        assertEqual(Array.prototype.indexAfter.call(object, "last"), -1,
            "match at final index");
        assertEqual(Array.prototype.indexAfter.call(object, "missing"), -1,
            "missing value");
        assertThrowsTypeError(function () {
            Array.prototype.indexAfter.call(null, "x");
        }, "indexAfter null receiver");
    });

    test("Array rotate follows documented direction and preserves holes", function () {
        var array = [1, 2, 3, 4];
        var sparse = new Array(3);
        var rotated;

        assertArrayEqual(array.rotate(1), [4, 1, 2, 3], "positive rotates right");
        assertArrayEqual(array.rotate(-1), [2, 3, 4, 1], "negative rotates left");
        assertArrayEqual(array, [1, 2, 3, 4], "rotate source unchanged");
        sparse[0] = "a";
        sparse[2] = "c";
        rotated = sparse.rotate(1);
        assertEqual(rotated[0], "c", "rotated final value");
        assertEqual(rotated[1], "a", "rotated first value");
        assertEqual(2 in rotated, false, "rotated hole preserved");
        assertEqual([].rotate(5).length, 0, "empty rotation");
    });

    test("Array insert and remove are installed", function () {
        assertEqual(typeof Array.prototype.insert, "function", "insert");
        assertEqual(typeof Array.prototype.remove, "function", "remove");
    });

    test("Array insert returns a shallow copy and accepts endpoint insertion", function () {
        var reference = {name: "same"};
        var array = [reference, "b"];
        var middle = array.insert(null, -1);
        var end = array.insert("c", array.length);

        assertArrayEqual(middle, [reference, null, "b"], "negative insertion");
        assertEqual(middle[0], reference, "insert shallow reference");
        assertArrayEqual(end, [reference, "b", "c"], "endpoint insertion");
        assertArrayEqual(array, [reference, "b"], "insert source unchanged");
        assertThrowsRangeError(function () {
            array.insert("x", 3);
        }, "insert upper bound");
        assertThrowsTypeError(function () {
            Array.prototype.insert.call(null, "x", 0);
        }, "insert null receiver");
    });

    test("Array remove returns a shallow copy and preserves shifted holes", function () {
        var sparse = new Array(4);
        var expected = new Array(3);
        var result;

        sparse[0] = "a";
        sparse[2] = "c";
        sparse[3] = "d";
        expected[0] = "a";
        expected[1] = "c";
        expected[2] = "d";
        result = sparse.remove(1);
        assertIndexedEqual(result, expected, "remove hole");
        assertEqual(1 in sparse, false, "remove source unchanged");
        assertArrayEqual([1, 2, 3].remove(-1), [1, 2], "negative removal");
        assertEqual([].remove(0), undefined, "empty removal");
        assertThrowsRangeError(function () {
            [1].remove(1);
        }, "remove upper bound");
    });

    test("Array pluck, reject, and unique are installed", function () {
        assertEqual(typeof Array.prototype.pluck, "function", "pluck");
        assertEqual(typeof Array.prototype.reject, "function", "reject");
        assertEqual(typeof Array.prototype.unique, "function", "unique");
    });

    test("Array pluck maps properties while preserving source holes", function () {
        var sparse = new Array(3);
        var expected = new Array(3);
        var result;

        sparse[0] = {name: "a"};
        sparse[2] = {name: "c"};
        expected[0] = "a";
        expected[2] = "c";
        result = sparse.pluck("name");
        assertIndexedEqual(result, expected, "sparse pluck");
        assertArrayEqual(Array.prototype.pluck.call({
            0: {value: 2}, 1: {value: 3}, length: 2
        }, "value"), [2, 3], "generic pluck");
    });

    test("Array reject returns a dense inverse-filter result", function () {
        function ArrayLike() {}
        var object;
        var context = {limit: 2};
        var result;

        ArrayLike.prototype[1] = 2;
        object = new ArrayLike();
        object[0] = 1;
        object[3] = 4;
        object.length = 5;
        result = Array.prototype.reject.call(object, function (value, index, receiver) {
            assertEqual(this, context, "reject thisArg");
            assertEqual(receiver, object, "reject receiver");
            return value > this.limit;
        }, context);
        assertArrayEqual(result, [1, 2], "rejected dense values");
        assertThrowsTypeError(function () {
            [1].reject(null);
        }, "reject callback");
    });

    test("Array unique keeps distinct typed and SameValueZero keys", function () {
        var values = [1, "1", NaN, NaN, false, 0, false, "__proto__", "toString"];
        var result = values.unique();
        var context = {key: false};
        var keyed;

        assertEqual(result.length, 7, "unique result length");
        assertEqual(result[0], 1, "numeric one");
        assertEqual(result[1], "1", "string one remains distinct");
        assertEqual(result[2] !== result[2], true, "single NaN");
        assertEqual(result[3], false, "false key");
        assertEqual(result[4], 0, "zero distinct from false");
        assertEqual(result[5], "__proto__", "prototype-like key");
        assertEqual(result[6], "toString", "inherited-name-like key");
        keyed = ["first", "second"].unique(function () {
            return this.key;
        }, context);
        assertArrayEqual(keyed, ["first"], "falsy callback key respected");
        assertThrowsTypeError(function () {
            values.unique("key");
        }, "unique invalid callback");
    });

    test("Array isSorted and merge are installed", function () {
        assertEqual(typeof Array.isSorted, "function", "Array.isSorted");
        assertEqual(typeof Array.prototype.merge, "function", "merge");
    });

    test("Array isSorted uses consistent default and custom comparators", function () {
        var sparse = new Array(2);

        sparse[0] = 1;
        assertEqual(Array.isSorted([]), true, "empty Array");
        assertEqual(Array.isSorted([1, 2, 10]), true, "numeric ascending");
        assertEqual(Array.isSorted([1, 10, 2]), false, "numeric unsorted");
        assertEqual(Array.isSorted([3, 2, 1], function (a, b) {
            return b - a;
        }), true, "custom descending");
        assertEqual(Array.isSorted(sparse), true, "hole as trailing undefined");
        assertEqual(Array.isSorted([undefined, 1]), false,
            "undefined before value is unsorted");
        assertThrowsTypeError(function () {
            Array.isSorted({length: 0});
        }, "isSorted non-Array");
        assertThrowsTypeError(function () {
            Array.isSorted([], null);
        }, "isSorted invalid comparator");
    });

    test("Array merge mutates and returns the sorted receiver", function () {
        var left = [1, 3, 5];
        var right = [2, 4, 6];
        var returned = left.merge(right);
        var sparse = new Array(2);
        var denseResult;

        assertEqual(returned, left, "merge return receiver");
        assertArrayEqual(left, [1, 2, 3, 4, 5, 6], "merged values");
        assertArrayEqual(right, [2, 4, 6], "merged source unchanged");
        assertArrayEqual([5, 3, 1].merge([6, 4, 2], function (a, b) {
            return b - a;
        }), [6, 5, 4, 3, 2, 1], "custom descending merge");
        sparse[0] = 1;
        denseResult = sparse.merge([2]);
        assertIndexedEqual(denseResult, [1, 2, undefined],
            "merge densifies holes as undefined");
        assertThrowsTypeError(function () {
            [1].merge({0: 2, length: 1});
        }, "merge non-Array input");
    });

    test("Array randomization methods are installed", function () {
        assertEqual(typeof Array.prototype.random, "function", "random");
        assertEqual(typeof Array.prototype.shuffle, "function", "shuffle");
        assertEqual(typeof Array.prototype.toShuffled, "function", "toShuffled");
    });

    test("Array random selects an index and handles empty receivers", function () {
        withRandom([0.6], function () {
            assertEqual(["a", "b", "c"].random(), "b", "selected value");
        });
        assertEqual([].random(), undefined, "empty random value");
        withRandom([0.9], function () {
            assertEqual(Array.prototype.random.call({0: "a", 1: "b", length: 2}),
                "b", "generic random");
        });
        assertThrowsTypeError(function () {
            Array.prototype.random.call(null);
        }, "random null receiver");
    });

    test("Array shuffle mutates by a deterministic Fisher-Yates sequence", function () {
        var array = [1, 2, 3, 4];
        var returned;
        var sparse = new Array(3);

        returned = withRandom([0, 0, 0], function () {
            return array.shuffle();
        });
        assertEqual(returned, array, "shuffle return receiver");
        assertArrayEqual(array, [2, 3, 4, 1], "deterministic shuffle");
        sparse[0] = "a";
        sparse[2] = "c";
        withRandom([0, 0], function () { sparse.shuffle(); });
        assertEqual(0 in sparse, false, "shuffle moved hole");
        assertEqual(sparse[1], "c", "shuffle sparse middle");
        assertEqual(sparse[2], "a", "shuffle sparse end");
    });

    test("Array toShuffled returns a deterministic hole-preserving copy", function () {
        var array = [1, 2, 3, 4];
        var result = withRandom([0, 0, 0, 0], function () {
            return array.toShuffled();
        });
        var sparse = new Array(3);
        var sparseResult;

        assertArrayEqual(result, [4, 1, 2, 3], "inside-out shuffle");
        assertArrayEqual(array, [1, 2, 3, 4], "toShuffled source unchanged");
        sparse[0] = "a";
        sparse[2] = "c";
        sparseResult = withRandom([0, 0, 0], function () {
            return sparse.toShuffled();
        });
        assertEqual(sparseResult[0], "c", "toShuffled sparse first");
        assertEqual(sparseResult[1], "a", "toShuffled sparse middle");
        assertEqual(2 in sparseResult, false, "toShuffled preserves hole count");
    });

    test("Array structural inspection methods are installed", function () {
        assertEqual(typeof Array.prototype.dim, "function", "dim");
        assertEqual(typeof Array.info, "function", "Array.info");
    });

    test("Array dim reports maximum depth for every indexed slot", function () {
        var sparse = new Array(3);
        var values = [1, [2], [3, [4]], [[5, [6]]]];

        assertArrayEqual(values.dim(), [0, 1, 2, 3], "nested dimensions");
        sparse[1] = [[1]];
        assertArrayEqual(sparse.dim(), [0, 2, 0], "sparse dimensions");
        assertArrayEqual(Array.prototype.dim.call({0: [1], length: 2}), [1, 0],
            "generic dimensions");
        assertThrowsTypeError(function () {
            Array.prototype.dim.call(null);
        }, "dim null receiver");
    });

    test("Array info reports uniformity, depth, lengths, and leaf types", function () {
        var uniform = Array.info([[1, 2], [3, 4]]);
        var irregular = Array.info([[1, "two"], [3]]);
        var sparse = new Array(2);
        var sparseInfo;

        assertEqual(uniform.isUniform, true, "uniform matrix");
        assertEqual(uniform.maxDepth, 1, "uniform maximum depth");
        assertArrayEqual(uniform.lengthsAtDepth[0], [2], "root lengths");
        assertArrayEqual(uniform.lengthsAtDepth[1], [2, 2], "child lengths");
        assertEqual(uniform.typeOfElements, "number", "uniform leaf type");
        assertEqual(irregular.isUniform, false, "irregular matrix");
        assertEqual(irregular.typeOfElements, "mixed", "mixed leaf types");
        sparse[0] = null;
        sparseInfo = Array.info(sparse);
        assertEqual(sparseInfo.typeOfElements, "undefined",
            "null and hole type classification");
        assertThrowsTypeError(function () {
            Array.info({length: 0});
        }, "info non-Array");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " non-standard Array test(s) failed");
    }
}());
