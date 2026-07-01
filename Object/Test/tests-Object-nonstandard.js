/*
 * Non-standard Object extension tests.
 *
 * ExtendScript processes include directives. Node.js disables the tested
 * extension and loads the same project file explicitly.
 */
//@debug 0

//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;

Object.isObject = undefined;
Object.isEmpty = undefined;
Object.isEquals = undefined;
Object.isCyclic = undefined;
Object.deepCopy = undefined;
Object.compact = undefined;
Object.flat = undefined;
Object.prototype.merge = undefined;
Object.prototype.toString = undefined;

//@include "../Lib/isObject.js"
//@include "../Lib/isEmpty.js"
//@include "../Lib/isEquals.js"
//@include "../Lib/isCyclic.js"
//@include "../Lib/deepCopy.js"
//@include "../Lib/compact.js"
//@include "../Lib/flat.js"
//@include "../Lib/merge.js"
//@include "../Lib/toString.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            path.join(__dirname, "../Lib/isObject.js"),
            path.join(__dirname, "../Lib/isEmpty.js"),
            path.join(__dirname, "../Lib/isEquals.js"),
            path.join(__dirname, "../Lib/isCyclic.js"),
            path.join(__dirname, "../Lib/deepCopy.js"),
            path.join(__dirname, "../Lib/compact.js"),
            path.join(__dirname, "../Lib/flat.js"),
            path.join(__dirname, "../Lib/merge.js"),
            path.join(__dirname, "../Lib/toString.js")
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

    test("Object.isObject is installed", function () {
        assertEqual(typeof Object.isObject, "function", "Object.isObject");
    });

    test("Object.isObject recognizes objects and functions", function () {
        assertEqual(Object.isObject({}), true, "plain object");
        assertEqual(Object.isObject([]), true, "array");
        assertEqual(Object.isObject(new Date(0)), true, "Date");
        assertEqual(Object.isObject(/x/), true, "RegExp");
        assertEqual(Object.isObject(function () {}), true, "function");
        assertEqual(Object.isObject(null), false, "null");
        assertEqual(Object.isObject(undefined), false, "undefined");
        assertEqual(Object.isObject(""), false, "string");
        assertEqual(Object.isObject(0), false, "number");
        assertEqual(Object.isObject(false), false, "boolean");
    });

    test("Object.isEmpty is installed", function () {
        assertEqual(typeof Object.isEmpty, "function", "Object.isEmpty");
    });

    test("Object.isEmpty checks enumerable own properties", function () {
        function EmptyFunction() {}
        function Child() {}
        var object;
        var shadowed = {hasOwnProperty: "shadow"};

        Child.prototype.inherited = true;
        object = new Child();

        assertEqual(Object.isEmpty({}), true, "empty object");
        assertEqual(Object.isEmpty([]), true, "empty array");
        assertEqual(Object.isEmpty(new Date(0)), true, "Date without enumerable properties");
        assertEqual(Object.isEmpty(EmptyFunction), !!isNodeRuntime,
            "runtime function properties");
        assertEqual(Object.isEmpty(object), true, "inherited property ignored");
        assertEqual(Object.isEmpty({value: 0}), false, "own property");
        assertEqual(Object.isEmpty([undefined]), false, "array element");
        assertEqual(Object.isEmpty(shadowed), false, "shadowing own property");
    });

    test("Object.isEmpty rejects non-objects", function () {
        var values = [null, undefined, "", 0, false];
        var i;

        for (i = 0; i < values.length; i++) {
            try {
                Object.isEmpty(values[i]);
            } catch (error) {
                continue;
            }
            fail("row " + i + ": expected an exception");
        }
    });

    test("Object.isEquals is installed", function () {
        assertEqual(typeof Object.isEquals, "function", "Object.isEquals");
    });

    test("Object.isEquals compares values and nested structures", function () {
        assertEqual(Object.isEquals(NaN, NaN), true, "NaN");
        assertEqual(Object.isEquals(0, -0), true, "signed zero");
        assertEqual(Object.isEquals(1, "1"), false, "different primitive types");
        assertEqual(Object.isEquals(new Date(10), new Date(10)), true, "equal dates");
        assertEqual(Object.isEquals(new Date(10), new Date(20)), false, "different dates");
        assertEqual(Object.isEquals(/ab/gi, /ab/gi), true, "equal regular expressions");
        assertEqual(Object.isEquals(/ab/g, /ab/i), false, "different regular expressions");
        assertEqual(Object.isEquals(
            {a: [2, {value: NaN}], b: null},
            {a: [2, {value: NaN}], b: null}
        ), true, "equal nested objects");
        assertEqual(Object.isEquals(
            {a: [2, {value: 3}]},
            {a: [2, {value: 4}]}
        ), false, "different nested objects");
        assertEqual(Object.isEquals([1, 2], {0: 1, 1: 2}), false,
            "array and object differ");
        assertEqual(Object.isEquals([], new Array(1)), false, "sparse array length");
    });

    test("Object.isEquals handles cycles and prototypes", function () {
        function A() { this.value = 1; }
        function B() { this.value = 1; }
        var left = {name: "Ada"};
        var right = {name: "Ada"};
        var different = {name: "Grace"};

        left.self = left;
        right.self = right;
        different.self = different;

        assertEqual(Object.isEquals(left, right), true, "equal cycles");
        assertEqual(Object.isEquals(left, different), false, "different cycles");
        assertEqual(Object.isEquals(new A(), new B()), false, "different prototypes");
    });

    test("Object.isCyclic is installed", function () {
        assertEqual(typeof Object.isCyclic, "function", "Object.isCyclic");
    });

    test("Object.isCyclic detects direct and nested cycles", function () {
        var direct = {};
        var nested = {child: {}};
        var array = [];

        direct.self = direct;
        nested.child.parent = nested;
        array.push(array);

        assertEqual(Object.isCyclic(direct), true, "direct cycle");
        assertEqual(Object.isCyclic(nested), true, "nested cycle");
        assertEqual(Object.isCyclic(array), true, "array cycle");
    });

    test("Object.isCyclic ignores shared references and primitives", function () {
        var shared = {value: 1};
        var object = {left: shared, right: shared};
        var shadowed = {hasOwnProperty: "shadow", child: {value: 1}};

        assertEqual(Object.isCyclic(object), false, "shared non-cyclic reference");
        assertEqual(Object.isCyclic(shadowed), false, "shadowing property");
        assertEqual(Object.isCyclic(null), false, "null");
        assertEqual(Object.isCyclic(1), false, "number");
        assertEqual(Object.isCyclic("text"), false, "string");
    });

    test("Object.deepCopy is installed", function () {
        assertEqual(typeof Object.deepCopy, "function", "Object.deepCopy");
    });

    test("Object.deepCopy clones supported values independently", function () {
        var original = {
            nested: {value: 1},
            array: [1, {value: 2}],
            date: new Date(1234),
            regexp: /ab/gi,
            hasOwnProperty: "shadow"
        };
        var copy = Object.deepCopy(original);

        assertEqual(Object.isEquals(copy, original), true, "equal content");
        assertEqual(copy === original, false, "root identity");
        assertEqual(copy.nested === original.nested, false, "nested identity");
        assertEqual(copy.array === original.array, false, "array identity");
        assertEqual(copy.array[1] === original.array[1], false, "array object identity");
        assertEqual(copy.date === original.date, false, "Date identity");
        assertEqual(copy.date.getTime(), 1234, "Date value");
        assertEqual(copy.regexp === original.regexp, false, "RegExp identity");
        assertEqual(String(copy.regexp), String(original.regexp), "RegExp value");

        copy.nested.value = 9;
        assertEqual(original.nested.value, 1, "mutation isolation");
    });

    test("Object.deepCopy rejects cycles but accepts shared references", function () {
        var cyclic = {};
        var shared = {value: 1};
        var copy;

        cyclic.self = cyclic;
        try {
            Object.deepCopy(cyclic);
            fail("cyclic object: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true, "cycle TypeError");
        }

        copy = Object.deepCopy({left: shared, right: shared});
        assertEqual(copy.left.value, 1, "shared left value");
        assertEqual(copy.right.value, 1, "shared right value");
        assertEqual(copy.left === copy.right, false, "shared references copied independently");
    });

    test("Object.compact is installed", function () {
        assertEqual(typeof Object.compact, "function", "Object.compact");
    });

    test("Object.compact recursively removes falsy values", function () {
        var original = {
            a: null,
            b: false,
            c: true,
            d: 0,
            e: undefined,
            f: "",
            g: "text",
            h: [null, false, "", true, 1, "a"],
            i: {j: 0, k: false, l: "a"},
            hasOwnProperty: "shadow"
        };
        var compacted = Object.compact(original);
        var array = Object.compact([1, null, "", {}, {name: null}, 0, {age: 28}]);

        assertEqual(compacted.c, true, "truthy boolean");
        assertEqual(compacted.g, "text", "truthy string");
        assertEqual(compacted.hasOwnProperty, "shadow", "shadowing property");
        assertEqual("a" in compacted, false, "null removed");
        assertEqual("d" in compacted, false, "zero removed");
        assertEqual(compacted.h.length, 3, "nested array length");
        assertEqual(compacted.h[0], true, "nested array first value");
        assertEqual(compacted.i.l, "a", "nested object value");
        assertEqual("j" in compacted.i, false, "nested zero removed");
        assertEqual(array.length, 4, "top-level array length");
        assertEqual(array[3].age, 28, "top-level nested object");
    });

    test("Object.compact rejects unsupported values", function () {
        var values = [null, undefined, "text", 1, false, /x/];
        var i;

        for (i = 0; i < values.length; i++) {
            try {
                Object.compact(values[i]);
            } catch (error) {
                continue;
            }
            fail("row " + i + ": expected an exception");
        }
    });

    test("Object.flat is installed", function () {
        assertEqual(typeof Object.flat, "function", "Object.flat");
    });

    test("Object.flat flattens own nested object properties", function () {
        function Parent() {}
        var inherited;
        var date = new Date(1234);
        var array = [1, {value: 2}];
        var object;
        var flattened;

        Parent.prototype.inherited = "ignored";
        inherited = new Parent();
        inherited.own = "kept";
        object = {
            name: "Ada",
            details: {address: {city: "London"}, empty: {}},
            list: array,
            date: date,
            inheritedObject: inherited
        };
        flattened = Object.flat(object);

        assertEqual(flattened.name, "Ada", "flat value");
        assertEqual(flattened.details_address_city, "London", "nested value");
        assertEqual(flattened.details_empty === object.details.empty, true,
            "empty object preserved");
        assertEqual(flattened.list === array, true, "array preserved");
        assertEqual(flattened.date === date, true, "Date preserved");
        assertEqual(flattened.inheritedObject_own, "kept", "own child property");
        assertEqual("inheritedObject_inherited" in flattened, false,
            "inherited child property ignored");
    });

    test("Object.flat returns primitives and rejects cyclic objects", function () {
        var cyclic = {value: 1};

        cyclic.self = cyclic;
        assertEqual(Object.flat(null), null, "null");
        assertEqual(Object.flat("text"), "text", "string");
        assertEqual(Object.flat(2), 2, "number");
        try {
            Object.flat(cyclic);
            fail("cyclic object: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true, "cycle TypeError");
        }
    });

    test("Object.prototype.merge is installed", function () {
        assertEqual(typeof Object.prototype.merge, "function", "Object.prototype.merge");
    });

    test("Object.prototype.merge combines deeply copied values", function () {
        var first = {
            name: "Ada",
            retained: {value: 1},
            replaced: {from: "first"},
            hasOwnProperty: "first shadow"
        };
        var second = {
            age: 37,
            replaced: {from: "second"},
            hasOwnProperty: "second shadow"
        };
        var merged = first.merge(second);

        assertEqual(merged.name, "Ada", "first property");
        assertEqual(merged.age, 37, "second property");
        assertEqual(merged.replaced.from, "second", "second side wins");
        assertEqual(merged.hasOwnProperty, "second shadow", "shadowing property");
        assertEqual(merged.retained === first.retained, false, "first nested copy");
        assertEqual(merged.replaced === second.replaced, false, "second nested copy");

        merged.retained.value = 9;
        merged.replaced.from = "changed";
        assertEqual(first.retained.value, 1, "first mutation isolation");
        assertEqual(second.replaced.from, "second", "second mutation isolation");
    });

    test("Object.prototype.merge rejects invalid and cyclic arguments", function () {
        var cyclic = {};
        var invalid = [null, undefined, "text", 1, false];
        var i;

        cyclic.self = cyclic;
        for (i = 0; i < invalid.length; i++) {
            try {
                ({}).merge(invalid[i]);
            } catch (error) {
                continue;
            }
            fail("invalid row " + i + ": expected an exception");
        }
        try {
            ({}).merge(cyclic);
            fail("cyclic argument: expected an exception");
        } catch (error) {
            assertEqual(error instanceof TypeError, true, "cyclic TypeError");
        }
    });

    test("Object.prototype.toString override is installed", function () {
        assertEqual(typeof Object.prototype.toString, "function",
            "Object.prototype.toString");
    });

    test("Object.prototype.toString formats enumerable own properties", function () {
        function Parent() {}
        var object;

        Parent.prototype.inherited = "ignored";
        object = new Parent();
        object.name = "Ada";
        object.age = 37;
        object.hasOwnProperty = "shadow";

        assertEqual(object.toString(),
            '{name: "Ada", age: 37, hasOwnProperty: "shadow"}',
            "formatted object");
        assertEqual(({}).toString(), "{}", "empty object");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " non-standard Object test(s) failed");
    }
}());
