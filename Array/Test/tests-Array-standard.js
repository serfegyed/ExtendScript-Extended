/*
 * Standard Array polyfill reference and compatibility tests.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeAt = isNodeRuntime ? Array.prototype.at : null;
var nativeCopyWithin = isNodeRuntime ? Array.prototype.copyWithin : null;
var nativeFill = isNodeRuntime ? Array.prototype.fill : null;
var nativeEntries = isNodeRuntime ? Array.prototype.entries : null;
var nativeKeys = isNodeRuntime ? Array.prototype.keys : null;
var nativeValues = isNodeRuntime ? Array.prototype.values : null;
var nativeEvery = isNodeRuntime ? Array.prototype.every : null;
var nativeSome = isNodeRuntime ? Array.prototype.some : null;
var nativeForEach = isNodeRuntime ? Array.prototype.forEach : null;
var nativeMap = isNodeRuntime ? Array.prototype.map : null;
var nativeFilter = isNodeRuntime ? Array.prototype.filter : null;
var nativeFind = isNodeRuntime ? Array.prototype.find : null;
var nativeFindIndex = isNodeRuntime ? Array.prototype.findIndex : null;
var nativeFindLast = isNodeRuntime ? Array.prototype.findLast : null;
var nativeFindLastIndex = isNodeRuntime ? Array.prototype.findLastIndex : null;
var nativeIncludes = isNodeRuntime ? Array.prototype.includes : null;
var nativeIndexOf = isNodeRuntime ? Array.prototype.indexOf : null;
var nativeLastIndexOf = isNodeRuntime ? Array.prototype.lastIndexOf : null;
var nativeFlat = isNodeRuntime ? Array.prototype.flat : null;
var nativeFlatMap = isNodeRuntime ? Array.prototype.flatMap : null;
var nativeFrom = isNodeRuntime ? Array.from : null;
var nativeOf = isNodeRuntime ? Array.of : null;
var nativeIsArray = isNodeRuntime ? Array.isArray : null;
var nativeReduce = isNodeRuntime ? Array.prototype.reduce : null;
var nativeReduceRight = isNodeRuntime ? Array.prototype.reduceRight : null;
var nativeToReversed = isNodeRuntime ? Array.prototype.toReversed : null;
var nativeToSorted = isNodeRuntime ? Array.prototype.toSorted : null;
var nativeToSpliced = isNodeRuntime ? Array.prototype.toSpliced : null;
var nativeWith = isNodeRuntime ? Array.prototype.with : null;

//@include "../Lib/at.js"
//@include "../Lib/copyWithin.js"
//@include "../Lib/fill.js"
//@include "../Lib/entries.js"
//@include "../Lib/keys.js"
//@include "../Lib/values.js"
//@include "../Lib/every.js"
//@include "../Lib/some.js"
//@include "../Lib/forEach.js"
//@include "../Lib/map.js"
//@include "../Lib/filter.js"
//@include "../Lib/find.js"
//@include "../Lib/findIndex.js"
//@include "../Lib/findLast.js"
//@include "../Lib/findLastIndex.js"
//@include "../Lib/includes.js"
//@include "../Lib/indexOf.js"
//@include "../Lib/lastIndexOf.js"
//@include "../Lib/flat.js"
//@include "../Lib/flatMap.js"
//@include "../Lib/from.js"
//@include "../Lib/of.js"
//@include "../Lib/isArray.js"
//@include "../Lib/reduce.js"
//@include "../Lib/reduceRight.js"
//@include "../Lib/toReversed.js"
//@include "../Lib/toSorted.js"
//@include "../Lib/toSpliced.js"
//@include "../Lib/with.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            "../Lib/arrayInternals.js",
            "../Lib/at.js",
            "../Lib/copyWithin.js",
            "../Lib/fill.js",
            "../Lib/entries.js",
            "../Lib/keys.js",
            "../Lib/values.js",
            "../Lib/every.js",
            "../Lib/some.js",
            "../Lib/forEach.js",
            "../Lib/map.js",
            "../Lib/filter.js",
            "../Lib/find.js",
            "../Lib/findIndex.js",
            "../Lib/findLast.js",
            "../Lib/findLastIndex.js",
            "../Lib/includes.js",
            "../Lib/indexOf.js",
            "../Lib/lastIndexOf.js",
            "../Lib/flat.js",
            "../Lib/flatMap.js",
            "../Lib/from.js",
            "../Lib/of.js",
            "../Lib/isArray.js",
            "../Lib/reduce.js",
            "../Lib/reduceRight.js",
            "../Lib/toReversed.js",
            "../Lib/toSorted.js",
            "../Lib/toSpliced.js",
            "../Lib/with.js"
        ];
        var i;
        var sources = [];

        for (i = 0; i < filenames.length; i++) {
            sources[i] = fs.readFileSync(
                path.join(__dirname, filenames[i]), "utf8"
            ).replace(/^\s*#include[^\r\n]*$/gm, "");
        }

        Array.prototype.at = undefined;
        Array.prototype.copyWithin = undefined;
        Array.prototype.fill = undefined;
        Array.prototype.entries = undefined;
        Array.prototype.keys = undefined;
        Array.prototype.values = undefined;
        Array.prototype.every = undefined;
        Array.prototype.some = undefined;
        Array.prototype.forEach = undefined;
        Array.prototype.map = undefined;
        Array.prototype.filter = undefined;
        Array.prototype.find = undefined;
        Array.prototype.findIndex = undefined;
        Array.prototype.findLast = undefined;
        Array.prototype.findLastIndex = undefined;
        Array.prototype.includes = undefined;
        Array.prototype.indexOf = undefined;
        Array.prototype.lastIndexOf = undefined;
        Array.prototype.flat = undefined;
        Array.prototype.flatMap = undefined;
        Array.from = undefined;
        Array.of = undefined;
        Array.isArray = undefined;
        Array.prototype.reduce = undefined;
        Array.prototype.reduceRight = undefined;
        Array.prototype.toReversed = undefined;
        Array.prototype.toSorted = undefined;
        Array.prototype.toSpliced = undefined;
        Array.prototype.with = undefined;

        for (i = 0; i < sources.length; i++) {
            (0, eval)(sources[i]);
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

    function assertIndexedEqual(actual, expected, message) {
        var length = Number(expected.length);
        var i;

        assertEqual(Number(actual.length), length, message + " length");
        for (i = 0; i < length; i++) {
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

    function assertArrayEqual(actual, expected, message) {
        var i;

        assertEqual(actual.length, expected.length, message + " length");
        for (i = 0; i < expected.length; i++) {
            assertEqual(actual[i], expected[i], message + " row " + i);
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

    test("Array at, copyWithin, and fill are installed", function () {
        assertEqual(typeof Array.prototype.at, "function", "Array.prototype.at");
        assertEqual(typeof Array.prototype.copyWithin, "function",
            "Array.prototype.copyWithin");
        assertEqual(typeof Array.prototype.fill, "function", "Array.prototype.fill");
    });

    test("Array.prototype.at handles indices and generic receivers", function () {
        function ArrayLike() {}
        var arrayLike;

        ArrayLike.prototype[1] = "inherited";
        arrayLike = new ArrayLike();
        arrayLike[0] = "a";
        arrayLike[2] = "c";
        arrayLike.length = "3";

        assertEqual(["a", "b", "c"].at(-1), "c", "negative index");
        assertEqual(["a", "b", "c"].at(-1.8), "c", "negative fraction");
        assertEqual(["a", "b", "c"].at(NaN), "a", "NaN index");
        assertEqual(["a"].at(Infinity), undefined, "infinite index");
        assertEqual(Array.prototype.at.call(arrayLike, 1), "inherited",
            "inherited array-like index");
        assertEqual(Array.prototype.at.call(arrayLike, -1), "c",
            "string length conversion");
        assertThrowsTypeError(function () {
            Array.prototype.at.call(null, 0);
        }, "null receiver");
        if (nativeAt) {
            assertEqual(Array.prototype.at.call(arrayLike, -1),
                nativeAt.call(arrayLike, -1), "Node generic reference");
        }
    });

    test("Array.prototype.copyWithin preserves holes and supports array-like objects", function () {
        function ArrayLike() {}
        var array = new Array(4);
        var expected = new Array(4);
        var arrayLike;
        var expectedLike;

        array[0] = 1;
        array[2] = 3;
        array[3] = 4;
        expected[0] = 1;
        expected[1] = 1;
        expected[3] = 3;

        array.copyWithin(1, 0, 3);
        assertIndexedEqual(array, expected, "sparse copy");

        ArrayLike.prototype[1] = "inherited";
        arrayLike = new ArrayLike();
        arrayLike[0] = "a";
        arrayLike[2] = "c";
        arrayLike.length = 3;
        expectedLike = new ArrayLike();
        expectedLike[0] = "inherited";
        expectedLike[1] = "c";
        expectedLike[2] = "c";
        expectedLike.length = 3;
        assertEqual(Array.prototype.copyWithin.call(arrayLike, 0, 1, 3), arrayLike,
            "generic return receiver");
        assertIndexedEqual(arrayLike, expectedLike, "generic inherited copy");
        assertThrowsTypeError(function () {
            Array.prototype.copyWithin.call(null, 0, 0);
        }, "copyWithin null receiver");
    });

    test("Array.prototype.fill fills holes and supports array-like objects", function () {
        var array = new Array(4);
        var expected = new Array(4);
        var arrayLike = {0: "a", length: "3"};
        var expectedLike = {0: "a", 1: "x", 2: "x", length: "3"};

        expected[1] = 9;
        expected[2] = 9;

        array.fill(9, 1, -1);
        assertIndexedEqual(array, expected, "sparse fill");
        assertEqual(Array.prototype.fill.call(arrayLike, "x", -2), arrayLike,
            "generic return receiver");
        assertIndexedEqual(arrayLike, expectedLike, "generic fill");
        assertThrowsTypeError(function () {
            Array.prototype.fill.call(null, 0);
        }, "fill null receiver");
    });

    test("Array iterator methods are installed", function () {
        assertEqual(typeof Array.prototype.entries, "function",
            "Array.prototype.entries");
        assertEqual(typeof Array.prototype.keys, "function", "Array.prototype.keys");
        assertEqual(typeof Array.prototype.values, "function",
            "Array.prototype.values");
    });

    test("Array iterators visit holes and inherited array-like values", function () {
        function ArrayLike() {}
        var array = new Array(3);
        var arrayLike;
        var entries;

        array[0] = "a";
        array[2] = "c";

        ArrayLike.prototype[1] = "inherited";
        arrayLike = new ArrayLike();
        arrayLike[0] = "a";
        arrayLike.length = 3;

        assertArrayEqual(iteratorValues(array.keys()), [0, 1, 2],
            "sparse keys");
        assertArrayEqual(iteratorValues(array.values()), ["a", undefined, "c"],
            "sparse values");
        entries = iteratorValues(Array.prototype.entries.call(arrayLike));
        assertArrayEqual(entries[0], [0, "a"], "generic first entry");
        assertArrayEqual(entries[1], [1, "inherited"], "generic inherited entry");
        assertArrayEqual(entries[2], [2, undefined], "generic missing entry");
        assertThrowsTypeError(function () {
            Array.prototype.values.call(null);
        }, "values null receiver");
    });

    test("Array iterators read length live", function () {
        var array = ["a"];
        var values = array.values();
        var keys = array.keys();

        assertEqual(values.next().value, "a", "first value");
        assertEqual(keys.next().value, 0, "first key");
        array.push("b");
        assertEqual(values.next().value, "b", "appended value");
        assertEqual(keys.next().value, 1, "appended key");
        array.length = 1;
        assertEqual(values.next().done, true, "shortened values iterator");
        assertEqual(keys.next().done, true, "shortened keys iterator");

        if (nativeEntries && nativeKeys && nativeValues) {
            assertEqual(typeof nativeEntries.call([]).next, "function",
                "Node iterator reference");
        }
    });

    test("Array predicate and forEach methods are installed", function () {
        assertEqual(typeof Array.prototype.every, "function",
            "Array.prototype.every");
        assertEqual(typeof Array.prototype.some, "function", "Array.prototype.some");
        assertEqual(typeof Array.prototype.forEach, "function",
            "Array.prototype.forEach");
    });

    test("Array every and some handle holes, inheritance, and short-circuiting", function () {
        function ArrayLike() {}
        var object;
        var context = {limit: 3};
        var everyRows = [];
        var someCalls = 0;

        ArrayLike.prototype[1] = 2;
        object = new ArrayLike();
        object[0] = 1;
        object[2] = 3;
        object.length = 4;

        assertEqual(Array.prototype.every.call(object, function (value, index, receiver) {
            assertEqual(this, context, "every thisArg");
            assertEqual(receiver, object, "every receiver");
            everyRows.push(index + ":" + value);
            return value <= this.limit;
        }, context), true, "generic every result");
        assertEqual(everyRows.join(","), "0:1,1:2,2:3",
            "hole skipped and inherited index visited");
        assertEqual(Array.prototype.some.call(object, function (value) {
            someCalls++;
            return value === 2;
        }), true, "generic some result");
        assertEqual(someCalls, 2, "some short-circuit count");
        assertThrowsTypeError(function () {
            Array.prototype.every.call(object, null);
        }, "every callback");
        assertThrowsTypeError(function () {
            Array.prototype.some.call(null, function () {});
        }, "some null receiver");
    });

    test("Array forEach captures length and observes deletions", function () {
        var array = [1, 2, 3];
        var rows = [];
        var context = {sum: 0};
        var returned = array.forEach(function (value, index, receiver) {
            assertEqual(this, context, "forEach thisArg");
            assertEqual(receiver, array, "forEach receiver");
            rows.push(index + ":" + value);
            this.sum += value;
            if (index === 0) {
                delete array[2];
                array.push(4);
            }
        }, context);

        assertEqual(returned, undefined, "forEach return value");
        assertEqual(rows.join(","), "0:1,1:2", "captured length and deletion");
        assertEqual(context.sum, 3, "forEach values");
        assertThrowsTypeError(function () {
            [].forEach(null);
        }, "forEach callback");
        if (nativeEvery && nativeSome && nativeForEach) {
            assertEqual(nativeEvery.call([1, 2], function (value) { return value > 0; }),
                true, "Node predicate reference");
        }
    });

    test("Array map and filter are installed", function () {
        assertEqual(typeof Array.prototype.map, "function", "Array.prototype.map");
        assertEqual(typeof Array.prototype.filter, "function",
            "Array.prototype.filter");
    });

    test("Array map preserves holes and maps inherited array-like indices", function () {
        function ArrayLike() {}
        var sparse = new Array(3);
        var mapped;
        var object;
        var generic;

        sparse[0] = 1;
        sparse[2] = 3;
        mapped = sparse.map(function (value) { return value * 2; });

        assertEqual(mapped.length, 3, "sparse mapped length");
        assertEqual(0 in mapped, true, "first mapped presence");
        assertEqual(1 in mapped, false, "mapped empty slot preserved");
        assertEqual(mapped[2], 6, "last mapped value");

        ArrayLike.prototype[1] = 2;
        object = new ArrayLike();
        object[0] = 1;
        object.length = 3;
        generic = Array.prototype.map.call(object, function (value, index, receiver) {
            assertEqual(receiver, object, "map receiver");
            return value + index;
        });
        assertEqual(generic instanceof Array, true, "generic map returns Array");
        assertEqual(generic[0], 1, "generic own value");
        assertEqual(generic[1], 3, "generic inherited value");
        assertEqual(2 in generic, false, "generic missing index preserved");
        assertThrowsTypeError(function () {
            sparse.map(null);
        }, "map callback");
    });

    test("Array filter skips holes and returns a dense Array", function () {
        function ArrayLike() {}
        var object;
        var result;
        var context = {minimum: 2};
        var nodeSparse;

        ArrayLike.prototype[1] = 2;
        object = new ArrayLike();
        object[0] = 1;
        object[2] = 3;
        object.length = 4;
        result = Array.prototype.filter.call(object, function (value, index, receiver) {
            assertEqual(this, context, "filter thisArg");
            assertEqual(receiver, object, "filter receiver");
            if (index === 0) object[4] = 5;
            return value >= this.minimum;
        }, context);

        assertEqual(result instanceof Array, true, "generic filter returns Array");
        assertArrayEqual(result, [2, 3], "dense filtered values");
        assertThrowsTypeError(function () {
            Array.prototype.filter.call(null, function () {});
        }, "filter null receiver");
        if (nativeMap && nativeFilter) {
            nodeSparse = new Array(3);
            nodeSparse[0] = 1;
            nodeSparse[2] = 2;
            assertArrayEqual(nativeFilter.call(nodeSparse, function () { return true; }),
                [1, 2], "Node sparse filter reference");
        }
    });

    test("Array find methods are installed", function () {
        assertEqual(typeof Array.prototype.find, "function", "Array.prototype.find");
        assertEqual(typeof Array.prototype.findIndex, "function",
            "Array.prototype.findIndex");
        assertEqual(typeof Array.prototype.findLast, "function",
            "Array.prototype.findLast");
        assertEqual(typeof Array.prototype.findLastIndex, "function",
            "Array.prototype.findLastIndex");
    });

    test("Array find and findIndex visit holes and support array-like objects", function () {
        function ArrayLike() {}
        var sparse = new Array(3);
        var visited = [];
        var object;
        var context = {wanted: "inherited"};

        sparse[2] = "c";
        assertEqual(sparse.find(function (value, index, receiver) {
            assertEqual(receiver, sparse, "find receiver");
            visited.push(index + ":" + String(value));
            return index === 1;
        }), undefined, "find empty-slot value");
        assertEqual(visited.join(","), "0:undefined,1:undefined",
            "find visits empty slots");

        ArrayLike.prototype[1] = "inherited";
        object = new ArrayLike();
        object[0] = "a";
        object.length = "3";
        assertEqual(Array.prototype.find.call(object, function (value) {
            return value === this.wanted;
        }, context), "inherited", "generic inherited find");
        assertEqual(Array.prototype.findIndex.call(object, function (value) {
            return value === undefined;
        }), 2, "generic missing-index findIndex");
        assertThrowsTypeError(function () {
            Array.prototype.find.call(null, function () {});
        }, "find null receiver");
        assertThrowsTypeError(function () {
            sparse.findIndex(null);
        }, "findIndex callback");
    });

    test("Array findLast methods search backward and capture length", function () {
        var object = {0: "a", 2: "c", length: 4};
        var rows = [];
        var value = Array.prototype.findLast.call(object,
            function (item, index, receiver) {
                assertEqual(receiver, object, "findLast receiver");
                rows.push(index + ":" + String(item));
                if (index === 3) {
                    receiver[4] = "later";
                    receiver.length = 5;
                }
                return index === 1;
            });

        assertEqual(value, undefined, "findLast missing-index value");
        assertEqual(rows.join(","), "3:undefined,2:c,1:undefined",
            "findLast backward visits");
        assertEqual(Array.prototype.findLastIndex.call(object, function (item) {
            return item === "c";
        }), 2, "generic findLastIndex");
        assertThrowsTypeError(function () {
            Array.prototype.findLast.call(undefined, function () {});
        }, "findLast undefined receiver");
        assertThrowsTypeError(function () {
            Array.prototype.findLastIndex.call(object, false);
        }, "findLastIndex callback");

        if (nativeFind && nativeFindIndex && nativeFindLast && nativeFindLastIndex) {
            assertEqual(nativeFindIndex.call(new Array(1), function () { return true; }),
                0, "Node hole-visiting reference");
        }
    });

    test("Array value-search methods are installed", function () {
        assertEqual(typeof Array.prototype.includes, "function",
            "Array.prototype.includes");
        assertEqual(typeof Array.prototype.indexOf, "function",
            "Array.prototype.indexOf");
        assertEqual(typeof Array.prototype.lastIndexOf, "function",
            "Array.prototype.lastIndexOf");
    });

    test("Array includes distinguishes holes from indexOf behavior", function () {
        var sparse = new Array(3);
        var object = {0: NaN, 1: "x", length: "3"};

        sparse[2] = "end";
        assertEqual(sparse.includes(undefined), true,
            "includes reads empty slot as undefined");
        assertEqual(sparse.indexOf(undefined), -1,
            "indexOf skips empty slots");
        assertEqual(Array.prototype.includes.call(object, NaN), true,
            "generic SameValueZero NaN");
        assertEqual(Array.prototype.includes.call(object, "x", -2), true,
            "generic negative fromIndex");
        assertEqual(Array.prototype.includes.call(object, "x", Infinity), false,
            "infinite fromIndex");
        assertThrowsTypeError(function () {
            Array.prototype.includes.call(null, 1);
        }, "includes null receiver");
    });

    test("Array indexOf methods search present array-like indices", function () {
        function ArrayLike() {}
        var object;

        ArrayLike.prototype[1] = "inherited";
        object = new ArrayLike();
        object[0] = "first";
        object[2] = "last";
        object[3] = "last";
        object.length = 4;

        assertEqual(Array.prototype.indexOf.call(object, "inherited"), 1,
            "indexOf inherited index");
        assertEqual(Array.prototype.indexOf.call(object, "last", -2), 2,
            "indexOf negative fromIndex");
        assertEqual(Array.prototype.indexOf.call(object, "last", Infinity), -1,
            "indexOf positive infinity");
        assertEqual(Array.prototype.lastIndexOf.call(object, "last"), 3,
            "lastIndexOf omitted fromIndex");
        assertEqual(Array.prototype.lastIndexOf.call(object, "last", undefined), -1,
            "lastIndexOf explicit undefined starts at zero");
        assertEqual(Array.prototype.lastIndexOf.call(object, "inherited", -2), 1,
            "lastIndexOf inherited negative fromIndex");
        assertThrowsTypeError(function () {
            Array.prototype.indexOf.call(undefined, 1);
        }, "indexOf undefined receiver");
        assertThrowsTypeError(function () {
            Array.prototype.lastIndexOf.call(null, 1);
        }, "lastIndexOf null receiver");

        if (nativeIncludes && nativeIndexOf && nativeLastIndexOf) {
            assertEqual(nativeIncludes.call(new Array(1), undefined), true,
                "Node includes hole reference");
            assertEqual(nativeLastIndexOf.call(["a", "b"], "b", undefined), -1,
                "Node explicit undefined reference");
        }
    });

    test("Array flattening methods are installed", function () {
        assertEqual(typeof Array.prototype.flat, "function", "Array.prototype.flat");
        assertEqual(typeof Array.prototype.flatMap, "function",
            "Array.prototype.flatMap");
    });

    test("Array flat handles depth, holes, and array-like receivers", function () {
        function ArrayLike() {}
        var nested = new Array(3);
        var object;
        var sparse = new Array(3);
        var fractional;
        var nanDepth;

        nested[0] = 2;
        nested[2] = 3;
        ArrayLike.prototype[1] = nested;
        object = new ArrayLike();
        object[0] = [1];
        object[2] = 4;
        object.length = "3";

        assertArrayEqual(Array.prototype.flat.call(object), [1, 2, 3, 4],
            "generic inherited flattening");
        fractional = [1, [2, [3]]].flat(1.8);
        assertEqual(fractional.length, 3, "fractional depth length");
        assertEqual(fractional[0], 1, "fractional depth first value");
        assertEqual(fractional[1], 2, "fractional depth second value");
        assertArrayEqual(fractional[2], [3], "fractional depth nested value");
        nanDepth = [1, [2]].flat(NaN);
        assertEqual(nanDepth.length, 2, "NaN depth length");
        assertEqual(nanDepth[0], 1, "NaN depth first value");
        assertArrayEqual(nanDepth[1], [2], "NaN depth preserves nesting");
        sparse[0] = 1;
        sparse[2] = 3;
        assertArrayEqual(sparse.flat(0), [1, 3], "depth zero removes root holes");
        assertThrowsTypeError(function () {
            Array.prototype.flat.call(null);
        }, "flat null receiver");
    });

    test("Array flatMap maps present indices and flattens one level", function () {
        function ArrayLike() {}
        var object;
        var rows = [];
        var context = {offset: 10};
        var result;

        ArrayLike.prototype[1] = 2;
        object = new ArrayLike();
        object[0] = 1;
        object.length = 3;
        result = Array.prototype.flatMap.call(object, function (value, index, receiver) {
            var pair = new Array(3);

            assertEqual(this, context, "flatMap thisArg");
            assertEqual(receiver, object, "flatMap receiver");
            rows.push(index);
            pair[0] = value;
            pair[2] = value + this.offset;
            return pair;
        }, context);

        assertArrayEqual(result, [1, 11, 2, 12], "generic flattened values");
        assertArrayEqual(rows, [0, 1], "flatMap skips missing source index");
        assertThrowsTypeError(function () {
            Array.prototype.flatMap.call(object, null);
        }, "flatMap callback");
        assertThrowsTypeError(function () {
            Array.prototype.flatMap.call(undefined, function () {});
        }, "flatMap undefined receiver");

        if (nativeFlat && nativeFlatMap) {
            assertArrayEqual(nativeFlat.call(new Array(2), 0), [],
                "Node root-hole reference");
        }
    });

    test("Static Array creation and type methods are installed", function () {
        assertEqual(typeof Array.from, "function", "Array.from");
        assertEqual(typeof Array.of, "function", "Array.of");
        assertEqual(typeof Array.isArray, "function", "Array.isArray");
    });

    test("Array.from reads array-like values and creates dense results", function () {
        function ArrayLike() {}
        function Box(length) { this.length = length; }
        var object;
        var context = {offset: 10};
        var result;
        var boxed;

        ArrayLike.prototype[1] = 2;
        object = new ArrayLike();
        object[0] = 1;
        object.length = "3.8";
        result = Array.from(object, function (value, index) {
            return value === undefined ? index : value + this.offset;
        }, context);
        assertArrayEqual(result, [11, 12, 2], "mapped array-like values");
        assertEqual(2 in result, true, "missing source index becomes present");

        boxed = Array.from.call(Box, {0: "a", length: 1});
        assertEqual(boxed instanceof Box, true, "custom result constructor");
        assertEqual(boxed[0], "a", "custom result value");
        assertThrowsTypeError(function () {
            Array.from(null);
        }, "Array.from null source");
        assertThrowsTypeError(function () {
            Array.from({length: 0}, null);
        }, "Array.from invalid mapper");
    });

    test("Array.of supports generic constructors without overriding semantics", function () {
        function Box(length) { this.length = length; }
        var result = Array.of(1, undefined, 3);
        var boxed = Array.of.call(Box, "a", "b");

        assertArrayEqual(result, [1, undefined, 3], "Array.of values");
        assertEqual(boxed instanceof Box, true, "Array.of custom constructor");
        assertEqual(boxed.length, 2, "Array.of custom length");
        assertEqual(boxed[1], "b", "Array.of custom value");
    });

    test("Array.isArray rejects objects that only inherit Array.prototype", function () {
        function FakeArray() {}
        var fake;

        FakeArray.prototype = Array.prototype;
        fake = new FakeArray();
        assertEqual(fake instanceof Array, true, "fake instanceof precondition");
        assertEqual(Array.isArray([]), true, "actual Array");
        assertEqual(Array.isArray(fake), false, "Array prototype inheritor");
        assertEqual(Array.isArray({length: 0}), false, "array-like object");

        if (nativeFrom && nativeOf && nativeIsArray) {
            assertEqual(nativeIsArray(fake), false, "Node fake Array reference");
        }
    });

    test("Array reduction methods are installed", function () {
        assertEqual(typeof Array.prototype.reduce, "function",
            "Array.prototype.reduce");
        assertEqual(typeof Array.prototype.reduceRight, "function",
            "Array.prototype.reduceRight");
    });

    test("Array reduce handles sparse array-like values and initial arguments", function () {
        function ArrayLike() {}
        var object;
        var rows = [];
        var result;

        ArrayLike.prototype[1] = "b";
        object = new ArrayLike();
        object[3] = "d";
        object.length = "5";
        result = Array.prototype.reduce.call(object,
            function (accumulator, value, index, receiver) {
                assertEqual(receiver, object, "reduce receiver");
                rows.push(index);
                return accumulator + value;
            });
        assertEqual(result, "bd", "inherited initial accumulator");
        assertArrayEqual(rows, [3], "reduce skips missing indices");
        assertEqual([].reduce(function () {}, undefined), undefined,
            "explicit undefined initial value");
        assertEqual([1, 2].reduce(function () { return undefined; }, 0), undefined,
            "undefined callback result is valid");
        assertThrowsTypeError(function () {
            new Array(3).reduce(function () {});
        }, "sparse reduce without initial value");
        assertThrowsTypeError(function () {
            Array.prototype.reduce.call(null, function () {}, 0);
        }, "reduce null receiver");
    });

    test("Array reduceRight selects the last present initial value", function () {
        function ArrayLike() {}
        var object;
        var rows = [];
        var result;

        ArrayLike.prototype[3] = "d";
        object = new ArrayLike();
        object[1] = "b";
        object.length = 5;
        result = Array.prototype.reduceRight.call(object,
            function (accumulator, value, index, receiver) {
                assertEqual(receiver, object, "reduceRight receiver");
                rows.push(index);
                return accumulator + value;
            });
        assertEqual(result, "db", "inherited last accumulator");
        assertArrayEqual(rows, [1], "reduceRight skips missing indices");
        assertEqual(Array.prototype.reduceRight.call({length: 0},
            function () {}, undefined), undefined,
            "reduceRight explicit undefined initial value");
        assertThrowsTypeError(function () {
            Array.prototype.reduceRight.call({length: 2}, function () {});
        }, "empty array-like reduceRight without initial value");
        assertThrowsTypeError(function () {
            [].reduceRight(null, 0);
        }, "reduceRight callback");

        if (nativeReduce && nativeReduceRight) {
            assertEqual(nativeReduce.call([], function () {}, undefined), undefined,
                "Node explicit undefined reference");
        }
    });

    test("Copying Array methods are installed", function () {
        assertEqual(typeof Array.prototype.toReversed, "function",
            "Array.prototype.toReversed");
        assertEqual(typeof Array.prototype.toSorted, "function",
            "Array.prototype.toSorted");
        assertEqual(typeof Array.prototype.toSpliced, "function",
            "Array.prototype.toSpliced");
        assertEqual(typeof Array.prototype.with, "function", "Array.prototype.with");
    });

    test("Array toReversed returns a dense shallow generic copy", function () {
        function ArrayLike() {}
        var reference = {name: "same"};
        var object;
        var result;

        ArrayLike.prototype[1] = reference;
        object = new ArrayLike();
        object[0] = "first";
        object.length = 3;
        result = Array.prototype.toReversed.call(object);
        assertEqual(result.length, 3, "toReversed length");
        assertEqual(0 in result, true, "missing source becomes dense");
        assertEqual(result[0], undefined, "reversed missing value");
        assertEqual(result[1], reference, "inherited shallow reference");
        assertEqual(result[2], "first", "reversed first value");
        assertEqual(object[0], "first", "source unchanged");
        assertThrowsTypeError(function () {
            Array.prototype.toReversed.call(null);
        }, "toReversed null receiver");
    });

    test("Array toSorted sorts a dense shallow copy", function () {
        var reference = {rank: 2};
        var array = [reference, {rank: 1}, undefined];
        var result = array.toSorted(function (a, b) {
            return a.rank - b.rank;
        });

        assertEqual(result[0].rank, 1, "sorted first rank");
        assertEqual(result[1], reference, "sorted shallow reference");
        assertEqual(result[2], undefined, "undefined sorted last");
        assertEqual(array[0], reference, "toSorted source unchanged");
        assertThrowsTypeError(function () {
            array.toSorted(null);
        }, "toSorted invalid comparator");
    });

    test("Array toSpliced handles argument count and densifies holes", function () {
        var sparse = new Array(4);
        var copied;

        sparse[0] = "a";
        sparse[2] = "c";
        sparse[3] = "d";
        copied = sparse.toSpliced();
        assertIndexedEqual(copied, ["a", undefined, "c", "d"],
            "toSpliced no-argument copy");
        assertArrayEqual(sparse.toSpliced(2), ["a", undefined],
            "toSpliced omitted deleteCount");
        assertArrayEqual(sparse.toSpliced(-2, 1, "x", "y"),
            ["a", undefined, "x", "y", "d"], "toSpliced insertion");
        assertEqual(1 in sparse, false, "toSpliced source hole preserved");
        assertThrowsTypeError(function () {
            Array.prototype.toSpliced.call(undefined, 0);
        }, "toSpliced undefined receiver");
    });

    test("Array with replaces one value and validates the index", function () {
        var sparse = new Array(3);
        var result;

        sparse[0] = "a";
        sparse[2] = "c";
        result = sparse.with(-1, "x");
        assertIndexedEqual(result, ["a", undefined, "x"], "with dense result");
        assertEqual(sparse[2], "c", "with source unchanged");
        assertThrowsRangeError(function () {
            sparse.with(3, "x");
        }, "with upper bound");
        assertThrowsRangeError(function () {
            Array.prototype.with.call({length: 2}, -3, "x");
        }, "with lower bound");

        if (nativeToReversed && nativeToSorted && nativeToSpliced && nativeWith) {
            assertEqual(0 in nativeToReversed.call(new Array(1)), true,
                "Node copying density reference");
        }
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " standard Array test(s) failed");
    }
}());
