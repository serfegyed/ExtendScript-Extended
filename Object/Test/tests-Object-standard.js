/*
 * Standard Object polyfill reference and compatibility tests.
 *
 * ExtendScript processes include directives. Node.js preserves native methods
 * as references, disables them, and loads the same project files explicitly.
 */
//@debug 0

//@include "../../Tools/Console/console.js"
//@include "../../Map/Map_standard.js"
//@include "../../Set/Set_standard.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeObjectIs = isNodeRuntime ? Object.is : null;
var nativeObjectHasOwn = isNodeRuntime ? Object.hasOwn : null;
var nativeObjectAssign = isNodeRuntime ? Object.assign : null;
var nativeObjectKeys = isNodeRuntime ? Object.keys : null;
var nativeObjectValues = isNodeRuntime ? Object.values : null;
var nativeObjectEntries = isNodeRuntime ? Object.entries : null;
var nativeObjectFromEntries = isNodeRuntime ? Object.fromEntries : null;
var nativeObjectGetOwnPropertyNames = isNodeRuntime ? Object.getOwnPropertyNames : null;
var nativeObjectGetOwnPropertyDescriptor = isNodeRuntime ? Object.getOwnPropertyDescriptor : null;
var nativeObjectGetOwnPropertyDescriptors = isNodeRuntime ? Object.getOwnPropertyDescriptors : null;
var nativeObjectGetPrototypeOf = isNodeRuntime ? Object.getPrototypeOf : null;
var nativeObjectCreate = isNodeRuntime ? Object.create : null;
var nativeObjectDefineProperty = isNodeRuntime ? Object.defineProperty : null;
var nativeObjectDefineProperties = isNodeRuntime ? Object.defineProperties : null;
var nativeObjectGroupBy = isNodeRuntime ? Object.groupBy : null;

Object.is = undefined;
Object.hasOwn = undefined;
Object.assign = undefined;
Object.keys = undefined;
Object.values = undefined;
Object.entries = undefined;
Object.fromEntries = undefined;
Object.getOwnPropertyNames = undefined;
Object.getOwnPropertyDescriptor = undefined;
Object.getOwnPropertyDescriptors = undefined;
Object.getPrototypeOf = undefined;
Object.create = undefined;
Object.defineProperty = undefined;
Object.defineProperties = undefined;
Object.groupBy = undefined;

//@include "../Lib/is.js"
//@include "../Lib/hasOwn.js"
//@include "../Lib/assign.js"
//@include "../Lib/keys.js"
//@include "../Lib/values.js"
//@include "../Lib/entries.js"
//@include "../../Array/Lib/isArray.js"
//@include "../Lib/fromEntries.js"
//@include "../Lib/getOwnPropertyNames.js"
//@include "../Lib/getOwnPropertyDescriptor.js"
//@include "../Lib/getOwnPropertyDescriptors.js"
//@include "../Lib/getPrototypeOf.js"
//@include "../Lib/create.js"
//@include "../Lib/defineProperty.js"
//@include "../Lib/defineProperties.js"
//@include "../Lib/groupBy.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");
        var filenames = [
            path.join(__dirname, "../../Map/External/external.js"),
            path.join(__dirname, "../../Map/Map_basic.js"),
            path.join(__dirname, "../../Map/Lib/forEach.js"),
            path.join(__dirname, "../../Map/Map_standard.js"),
            path.join(__dirname, "../../Set/external.js"),
            path.join(__dirname, "../../Set/Set_standard.js"),
            path.join(__dirname, "../Lib/is.js"),
            path.join(__dirname, "../Lib/hasOwn.js"),
            path.join(__dirname, "../Lib/assign.js"),
            path.join(__dirname, "../Lib/keys.js"),
            path.join(__dirname, "../Lib/values.js"),
            path.join(__dirname, "../Lib/entries.js"),
            path.join(__dirname, "../../Array/Lib/isArray.js"),
            path.join(__dirname, "../Lib/fromEntries.js"),
            path.join(__dirname, "../Lib/getOwnPropertyNames.js"),
            path.join(__dirname, "../Lib/getOwnPropertyDescriptor.js"),
            path.join(__dirname, "../Lib/getOwnPropertyDescriptors.js"),
            path.join(__dirname, "../Lib/getPrototypeOf.js"),
            path.join(__dirname, "../Lib/create.js"),
            path.join(__dirname, "../Lib/defineProperty.js"),
            path.join(__dirname, "../Lib/defineProperties.js"),
            path.join(__dirname, "../Lib/groupBy.js")
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

    function assertThrows(callback, message) {
        try {
            callback();
        } catch (error) {
            return;
        }

        fail((message ? message + ": " : "") + "expected an exception");
    }

    function assertArrayEqual(actual, expected, message) {
        var i;

        assertEqual(actual.length, expected.length, message + " length");
        for (i = 0; i < expected.length; i++) {
            assertEqual(actual[i], expected[i], message + " row " + i);
        }
    }

    function assertEntriesEqual(actual, expected, message) {
        var i;

        assertEqual(actual.length, expected.length, message + " length");
        for (i = 0; i < expected.length; i++) {
            assertEqual(actual[i][0], expected[i][0], message + " key row " + i);
            assertEqual(actual[i][1], expected[i][1], message + " value row " + i);
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

    function checkIs(x, y, expected, row) {
        if (nativeObjectIs) {
            assertEqual(nativeObjectIs(x, y), expected, "Node reference row " + row);
        }
        assertEqual(Object.is(x, y), expected, "polyfill row " + row);
    }

    function checkHasOwn(object, property, expected, row) {
        if (nativeObjectHasOwn) {
            assertEqual(nativeObjectHasOwn(object, property), expected,
                "Node reference row " + row);
        }
        assertEqual(Object.hasOwn(object, property), expected, "polyfill row " + row);
    }

    test("Object.is is installed", function () {
        assertEqual(typeof Object.is, "function", "Object.is");
    });

    test("Object.is follows SameValue comparison", function () {
        var object = {};

        checkIs(1, 1, true, 0);
        checkIs(1, "1", false, 1);
        checkIs(NaN, NaN, true, 2);
        checkIs(0, -0, false, 3);
        checkIs(-0, -0, true, 4);
        checkIs(Infinity, Infinity, true, 5);
        checkIs(null, null, true, 6);
        checkIs(undefined, undefined, true, 7);
        checkIs(object, object, true, 8);
        checkIs({}, {}, false, 9);
    });

    test("Object.hasOwn is installed", function () {
        assertEqual(typeof Object.hasOwn, "function", "Object.hasOwn");
    });

    test("Object.hasOwn distinguishes own and inherited properties", function () {
        function Parent() {}
        var object = new Parent();
        var shadowed = {hasOwnProperty: false, own: 1};

        Parent.prototype.inherited = true;
        object.own = true;
        checkHasOwn(object, "own", true, 0);
        checkHasOwn(object, "inherited", false, 1);
        checkHasOwn(object, "missing", false, 2);
        checkHasOwn(shadowed, "own", true, 3);
        checkHasOwn({1: "one"}, 1, true, 4);
        checkHasOwn("abc", 1, isNodeRuntime ? true : false, 5);
    });

    test("Object.hasOwn follows the runtime nullish behavior", function () {
        if (isNodeRuntime) {
            assertThrows(function () {
                Object.hasOwn(null, "x");
            }, "null object");
            assertThrows(function () {
                Object.hasOwn(undefined, "x");
            }, "undefined object");
        } else {
            assertEqual(Object.hasOwn(null, "x"), false, "null object");
            assertEqual(Object.hasOwn(undefined, "x"), false, "undefined object");
        }
    });

    test("Object.assign is installed", function () {
        assertEqual(typeof Object.assign, "function", "Object.assign");
    });

    test("Object.assign copies own enumerable properties", function () {
        function Source() {}
        var target = {a: 0};
        var source = new Source();
        var shadowed = {hasOwnProperty: false, d: 4};
        var result;

        Source.prototype.inherited = 9;
        source.b = 2;
        result = Object.assign(target, source, {a: 1, c: 3}, shadowed);
        assertEqual(result, target, "returned target");
        assertEqual(target.a, 1, "overwritten property");
        assertEqual(target.b, 2, "first source property");
        assertEqual(target.c, 3, "later source property");
        assertEqual(target.d, 4, "shadowed hasOwnProperty source");
        assertEqual(target.inherited, undefined, "inherited property");
    });

    test("Object.assign handles strings, nullish sources, and primitive targets", function () {
        var target = Object.assign({}, "ab", null, undefined, true, 10);
        var boxed = Object.assign(3, {value: "x"});

        assertEqual(target[0], "a", "string source index 0");
        assertEqual(target[1], "b", "string source index 1");
        assertEqual(boxed.value, "x", "boxed target property");
        if (nativeObjectAssign) {
            assertEqual(nativeObjectAssign({}, "ab")[0], "a", "Node string source");
        }
        assertThrows(function () {
            Object.assign(null, {a: 1});
        }, "null target");
        assertThrows(function () {
            Object.assign(undefined, {a: 1});
        }, "undefined target");
    });

    test("Object.keys is installed", function () {
        assertEqual(typeof Object.keys, "function", "Object.keys");
    });

    test("Object.keys returns enumerable own property names", function () {
        function Parent() {}
        var object = new Parent();
        var shadowed = {hasOwnProperty: false, own: true};

        Parent.prototype.inherited = true;
        object.a = 1;
        object.b = 2;
        assertArrayEqual(Object.keys(object), ["a", "b"], "object keys");
        assertArrayEqual(Object.keys([10, 20]), ["0", "1"], "array keys");
        assertArrayEqual(Object.keys("ab"), ["0", "1"], "string keys");
        assertArrayEqual(Object.keys(shadowed), ["hasOwnProperty", "own"],
            "shadowed hasOwnProperty");
        assertArrayEqual(Object.keys(10), [], "number keys");
        if (nativeObjectKeys) {
            assertArrayEqual(nativeObjectKeys("ab"), ["0", "1"], "Node string keys");
        }
    });

    test("Object.keys rejects nullish values", function () {
        assertThrows(function () {
            Object.keys(null);
        }, "null value");
        assertThrows(function () {
            Object.keys(undefined);
        }, "undefined value");
    });

    test("Object.values is installed", function () {
        assertEqual(typeof Object.values, "function", "Object.values");
    });

    test("Object.values returns enumerable own property values", function () {
        function Parent() {}
        var object = new Parent();
        var shadowed = {hasOwnProperty: false, own: 2};

        Parent.prototype.inherited = 9;
        object.a = 1;
        object.b = 2;
        assertArrayEqual(Object.values(object), [1, 2], "object values");
        assertArrayEqual(Object.values([10, 20]), [10, 20], "array values");
        assertArrayEqual(Object.values("ab"), ["a", "b"], "string values");
        assertArrayEqual(Object.values(shadowed), [false, 2], "shadowed hasOwnProperty");
        assertArrayEqual(Object.values(10), [], "number values");
        if (nativeObjectValues) {
            assertArrayEqual(nativeObjectValues("ab"), ["a", "b"], "Node string values");
        }
    });

    test("Object.values rejects nullish values", function () {
        assertThrows(function () {
            Object.values(null);
        }, "null value");
        assertThrows(function () {
            Object.values(undefined);
        }, "undefined value");
    });

    test("Object.entries is installed", function () {
        assertEqual(typeof Object.entries, "function", "Object.entries");
    });

    test("Object.entries returns enumerable own key-value pairs", function () {
        function Parent() {}
        var object = new Parent();
        var shadowed = {hasOwnProperty: false, own: 2};

        Parent.prototype.inherited = 9;
        object.a = 1;
        object.b = 2;
        assertEntriesEqual(Object.entries(object), [["a", 1], ["b", 2]], "object entries");
        assertEntriesEqual(Object.entries([10, 20]), [["0", 10], ["1", 20]],
            "array entries");
        assertEntriesEqual(Object.entries("ab"), [["0", "a"], ["1", "b"]],
            "string entries");
        assertEntriesEqual(Object.entries(shadowed),
            [["hasOwnProperty", false], ["own", 2]], "shadowed hasOwnProperty");
        assertEntriesEqual(Object.entries(10), [], "number entries");
        if (nativeObjectEntries) {
            assertEntriesEqual(nativeObjectEntries("ab"), [["0", "a"], ["1", "b"]],
                "Node string entries");
        }
    });

    test("Object.entries rejects nullish values", function () {
        assertThrows(function () {
            Object.entries(null);
        }, "null value");
        assertThrows(function () {
            Object.entries(undefined);
        }, "undefined value");
    });

    test("Object.fromEntries is installed", function () {
        assertEqual(typeof Object.fromEntries, "function", "Object.fromEntries");
    });

    test("Object.fromEntries creates objects from key-value arrays", function () {
        var entries = [["name", "Ada"], ["age", 30], ["name", "Grace"]];
        var result = Object.fromEntries(entries);

        assertEqual(result.name, "Grace", "duplicate key");
        assertEqual(result.age, 30, "numeric value");
        assertEqual(Object.keys(result).length, 2, "result key count");
        assertEqual(Object.keys(Object.fromEntries([])).length, 0, "empty entries");
        if (nativeObjectFromEntries) {
            assertEqual(nativeObjectFromEntries(entries).name, "Grace", "Node duplicate key");
        }
    });

    test("Object.fromEntries follows the array-only project subset", function () {
        var result = Object.fromEntries([
            ["valid", 1],
            "invalid",
            ["short"],
            ["long", 2, 3],
            ["second", 4]
        ]);

        assertEqual(result.valid, 1, "valid entry");
        assertEqual(result.second, 4, "second valid entry");
        assertEqual(result.short, undefined, "short entry skipped");
        assertEqual(result.long, undefined, "long entry skipped");
        assertThrows(function () {
            Object.fromEntries({0: ["a", 1], length: 1});
        }, "non-array input");
    });

    test("Object.getOwnPropertyNames is installed", function () {
        assertEqual(typeof Object.getOwnPropertyNames, "function",
            "Object.getOwnPropertyNames");
    });

    test("Object.getOwnPropertyNames returns the enumerable-own subset", function () {
        function Parent() {}
        var object = new Parent();

        Parent.prototype.inherited = true;
        object.a = 1;
        object.b = 2;
        assertArrayEqual(Object.getOwnPropertyNames(object), ["a", "b"], "object names");
        assertArrayEqual(Object.getOwnPropertyNames([10, 20]), ["0", "1"],
            "array enumerable names");
        assertArrayEqual(Object.getOwnPropertyNames("ab"), ["0", "1"], "string names");
        assertArrayEqual(Object.getOwnPropertyNames(10), [], "number names");
        if (nativeObjectGetOwnPropertyNames) {
            assertArrayEqual(nativeObjectGetOwnPropertyNames({a: 1, b: 2}), ["a", "b"],
                "Node plain object names");
        }
    });

    test("Object.getOwnPropertyNames rejects nullish values", function () {
        assertThrows(function () {
            Object.getOwnPropertyNames(null);
        }, "null value");
        assertThrows(function () {
            Object.getOwnPropertyNames(undefined);
        }, "undefined value");
    });

    test("Object.getOwnPropertyDescriptor is installed", function () {
        assertEqual(typeof Object.getOwnPropertyDescriptor, "function",
            "Object.getOwnPropertyDescriptor");
        assertEqual(typeof Object.getOwnPropertyDescriptors, "function",
            "Object.getOwnPropertyDescriptors");
    });

    test("Object.getOwnPropertyDescriptor returns own data descriptors", function () {
        function Parent() {}
        var object = new Parent();
        var descriptor;
        var nativeDescriptor;

        Parent.prototype.inherited = true;
        object.a = 1;

        descriptor = Object.getOwnPropertyDescriptor(object, "a");
        assertEqual(descriptor.value, 1, "value");
        assertEqual(descriptor.writable, true, "writable");
        assertEqual(descriptor.enumerable, true, "enumerable");
        assertEqual(descriptor.configurable, true, "configurable");
        assertEqual(Object.getOwnPropertyDescriptor(object, "missing"), undefined,
            "missing descriptor");
        assertEqual(Object.getOwnPropertyDescriptor(object, "inherited"), undefined,
            "inherited descriptor");

        if (nativeObjectGetOwnPropertyDescriptor) {
            nativeDescriptor = nativeObjectGetOwnPropertyDescriptor({a: 1}, "a");
            assertEqual(nativeDescriptor.value, 1, "Node descriptor value");
            assertEqual(nativeDescriptor.enumerable, true, "Node descriptor enumerable");
        }
    });

    test("Object.getOwnPropertyDescriptor handles supported built-in fields", function () {
        var arrayDescriptor = Object.getOwnPropertyDescriptor(["x"], "length");
        var functionDescriptor = Object.getOwnPropertyDescriptor(
            function (a, b) { return a + b; },
            "length"
        );

        assertEqual(arrayDescriptor.value, 1, "array length value");
        assertEqual(arrayDescriptor.writable, true, "array length writable");
        assertEqual(arrayDescriptor.enumerable, false, "array length enumerable");
        assertEqual(arrayDescriptor.configurable, false, "array length configurable");
        assertEqual(functionDescriptor.value, 2, "function length value");
        assertEqual(functionDescriptor.writable, false, "function length writable");
        assertEqual(functionDescriptor.enumerable, false, "function length enumerable");
    });

    test("Object.getOwnPropertyDescriptors returns the supported descriptor map", function () {
        var object = {a: 1};
        var descriptors;

        object.b = 2;
        descriptors = Object.getOwnPropertyDescriptors(object);

        assertEqual(descriptors.a.value, 1, "a value");
        assertEqual(descriptors.b.value, 2, "b value");
        assertEqual(descriptors.a.enumerable, true, "a enumerable");
        assertEqual(Object.getOwnPropertyDescriptors(["x"]).length.value, 1,
            "array length descriptor");

        if (nativeObjectGetOwnPropertyDescriptors) {
            assertEqual(nativeObjectGetOwnPropertyDescriptors({a: 1}).a.value, 1,
                "Node descriptors value");
        }
    });

    test("Object descriptors interoperate with project property helpers", function () {
        var object = {};
        var descriptors;
        var created;

        Object.defineProperty(object, "x", {value: 3});
        descriptors = Object.getOwnPropertyDescriptors(object);

        assertEqual(descriptors.x.value, 3, "defined property descriptor");
        assertArrayEqual(Object.keys(descriptors), ["x"], "descriptor keys");
        assertEqual(Object.values(descriptors)[0].value, 3, "descriptor values");
        assertEqual(Object.entries(descriptors)[0][0], "x", "descriptor entry key");

        created = Object.create({p: 1}, {a: 2});
        assertEqual(Object.getOwnPropertyDescriptor(created, "a").value, 2,
            "Object.create direct subset descriptor");
        assertEqual(Object.getOwnPropertyDescriptor(created, "p"), undefined,
            "Object.create inherited descriptor");
    });

    test("Object descriptor methods reject nullish values", function () {
        assertThrows(function () {
            Object.getOwnPropertyDescriptor(null, "x");
        }, "descriptor null value");
        assertThrows(function () {
            Object.getOwnPropertyDescriptor(undefined, "x");
        }, "descriptor undefined value");
        assertThrows(function () {
            Object.getOwnPropertyDescriptors(null);
        }, "descriptors null value");
        assertThrows(function () {
            Object.getOwnPropertyDescriptors(undefined);
        }, "descriptors undefined value");
    });

    test("Object.getPrototypeOf is installed", function () {
        assertEqual(typeof Object.getPrototypeOf, "function", "Object.getPrototypeOf");
    });

    test("Object.getPrototypeOf follows common prototype chains", function () {
        function Animal() {}
        function Dog() {}
        var dog;

        Dog.prototype = new Animal();
        dog = new Dog();
        assertEqual(Object.getPrototypeOf(dog), Dog.prototype, "instance prototype");
        assertEqual(Object.getPrototypeOf(Dog.prototype), Animal.prototype,
            "prototype inheritance");
        assertEqual(Object.getPrototypeOf({}), Object.prototype, "plain object prototype");
        assertEqual(Object.getPrototypeOf(Object.prototype), null, "root prototype");
        if (nativeObjectGetPrototypeOf) {
            assertEqual(nativeObjectGetPrototypeOf(dog), Dog.prototype, "Node instance prototype");
        }
    });

    test("Object.getPrototypeOf follows the object-only project subset", function () {
        assertThrows(function () {
            Object.getPrototypeOf(null);
        }, "null value");
        assertThrows(function () {
            Object.getPrototypeOf("abc");
        }, "string value");
        assertThrows(function () {
            Object.getPrototypeOf(1);
        }, "number value");
    });

    test("Object.create is installed", function () {
        assertEqual(typeof Object.create, "function", "Object.create");
    });

    test("Object.create sets prototypes and direct project properties", function () {
        var prototype = {greeting: "hello"};
        var properties = {name: "Ada", age: 30};
        var object = Object.create(prototype, properties);
        var nullObject = Object.create(null);

        assertEqual(object.greeting, "hello", "inherited property");
        assertEqual(object.name, "Ada", "direct property");
        assertEqual(object.age, 30, "second direct property");
        assertEqual(Object.getPrototypeOf(object), prototype, "assigned prototype");
        assertEqual(Object.getPrototypeOf(nullObject), null, "null prototype");
        if (nativeObjectCreate) {
            assertEqual(nativeObjectGetPrototypeOf(nativeObjectCreate(prototype)), prototype,
                "Node assigned prototype");
        }
    });

    test("Object.create rejects invalid project arguments", function () {
        assertThrows(function () {
            Object.create(1);
        }, "numeric prototype");
        assertThrows(function () {
            Object.create("prototype");
        }, "string prototype");
        assertThrows(function () {
            Object.create({}, null);
        }, "null properties");
        assertThrows(function () {
            Object.create({}, 1);
        }, "numeric properties");
    });

    test("Object.defineProperty and Object.defineProperties are installed", function () {
        assertEqual(typeof Object.defineProperty, "function", "Object.defineProperty");
        assertEqual(typeof Object.defineProperties, "function", "Object.defineProperties");
    });

    test("Object.defineProperty follows the value-only project subset", function () {
        var object = {};
        var returned = Object.defineProperty(object, "name", {value: "Ada"});

        assertEqual(returned, object, "returned object");
        assertEqual(object.name, "Ada", "defined value");
        Object.defineProperty(object, "empty", {value: undefined});
        assertEqual(Object.hasOwn(object, "empty"), true, "undefined own property");
        Object.defineProperty(object, 1, {value: "one"});
        assertEqual(object[1], "one", "converted property key");
        Object.defineProperty(object, "accessor", {get: function () { return 1; }});
        assertEqual(Object.hasOwn(object, "accessor"), true,
            "unsupported accessor creates own property");
        assertEqual(object.accessor, undefined, "unsupported accessor value");
        assertEqual(Object.getOwnPropertyDescriptor(object, "accessor").value, undefined,
            "unsupported accessor descriptor");
        Object.defineProperty(object, "flags", {enumerable: false});
        assertEqual(Object.hasOwn(object, "flags"), true,
            "unsupported flags create own property");
        assertEqual(object.flags, undefined, "unsupported flags value");
        object.name = "Grace";
        assertEqual(object.name, "Grace", "descriptor attributes are not emulated");
        if (nativeObjectDefineProperty) {
            assertEqual(nativeObjectDefineProperty({}, "x", {value: 1}).x, 1,
                "Node simple value descriptor");
        }
    });

    test("Object.defineProperties defines multiple project values", function () {
        var object = {};
        var descriptors = {
            hasOwnProperty: {value: "shadow"},
            a: {value: 1},
            b: {value: 2}
        };
        var returned = Object.defineProperties(object, descriptors);

        assertEqual(returned, object, "returned object");
        assertEqual(object.hasOwnProperty, "shadow", "shadowing property");
        assertEqual(object.a, 1, "first property");
        assertEqual(object.b, 2, "second property");
        if (nativeObjectDefineProperties) {
            assertEqual(nativeObjectDefineProperties({}, {x: {value: 1}}).x, 1,
                "Node simple descriptors");
        }
    });

    test("Object property definition methods reject invalid arguments", function () {
        assertThrows(function () {
            Object.defineProperty(null, "x", {value: 1});
        }, "defineProperty null target");
        assertThrows(function () {
            Object.defineProperty({}, "x", null);
        }, "defineProperty null descriptor");
        assertThrows(function () {
            Object.defineProperties(null, {x: {value: 1}});
        }, "defineProperties null target");
        assertThrows(function () {
            Object.defineProperties({}, null);
        }, "defineProperties null descriptors");
    });

    test("Object.groupBy is installed", function () {
        assertEqual(typeof Object.groupBy, "function", "Object.groupBy");
    });

    test("Object.groupBy groups array-like values", function () {
        var numbers = [1, 2, 3, 4, 5];
        var groups = Object.groupBy(numbers, function (value, index) {
            assertEqual(index, value - 1, "callback index");
            return value % 2 ? "odd" : "even";
        });
        var letters = Object.groupBy("aAb", function (value) {
            return value === value.toUpperCase() ? "upper" : "lower";
        });

        assertArrayEqual(groups.odd, [1, 3, 5], "odd group");
        assertArrayEqual(groups.even, [2, 4], "even group");
        assertArrayEqual(letters.lower, ["a", "b"], "lowercase group");
        assertArrayEqual(letters.upper, ["A"], "uppercase group");
        if (nativeObjectGroupBy) {
            assertArrayEqual(nativeObjectGroupBy(numbers, function (value) {
                return value % 2 ? "odd" : "even";
            }).odd, [1, 3, 5], "Node odd group");
        }
    });

    test("Object.groupBy supports Map, Set, and forEach collections", function () {
        var map = new Map([["a", 1], ["b", 2], ["c", 3]]);
        var set = new Set([1, 2, 3, 4]);
        var collection = {
            forEach: function (callback) {
                callback("Ada", "first");
                callback("Bob", "second");
                callback("Amy", "third");
            }
        };
        var mapGroups = Object.groupBy(map, function (entry, index) {
            assertEqual(index, entry[1] - 1, "Map callback index");
            return entry[1] % 2 ? "odd" : "even";
        });
        var setGroups = Object.groupBy(set, function (value, index) {
            assertEqual(index, value - 1, "Set callback index");
            return value % 2 ? "odd" : "even";
        });
        var groups = Object.groupBy(collection, function (value, index) {
            return value.charAt(0) + index % 2;
        });

        assertEntriesEqual(mapGroups.odd, [["a", 1], ["c", 3]], "Map odd group");
        assertEntriesEqual(mapGroups.even, [["b", 2]], "Map even group");
        assertArrayEqual(setGroups.odd, [1, 3], "Set odd group");
        assertArrayEqual(setGroups.even, [2, 4], "Set even group");
        assertArrayEqual(groups.A0, ["Ada", "Amy"], "forEach A group");
        assertArrayEqual(groups.B1, ["Bob"], "forEach B group");
    });

    test("Object.groupBy handles property-name groups and validates arguments", function () {
        var groups = Object.groupBy([2, 3], function (value) {
            return value === 2 ? "constructor" : "hasOwnProperty";
        });

        assertArrayEqual(groups.constructor, [2], "constructor group");
        assertArrayEqual(groups.hasOwnProperty, [3], "hasOwnProperty group");
        assertThrows(function () {
            Object.groupBy([1], function () {
                return "__proto__";
            });
        }, "unsupported __proto__ group");
        assertThrows(function () {
            Object.groupBy(null, function () {});
        }, "null items");
        assertThrows(function () {
            Object.groupBy({}, function () {});
        }, "non-iterable object");
        assertThrows(function () {
            Object.groupBy([], null);
        }, "invalid callback");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " standard Object test(s) failed");
    }
}());
