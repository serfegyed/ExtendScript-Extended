/*
 * Function polyfill reference and compatibility tests.
 *
 * ExtendScript processes the include directive. Node.js ignores it, preserves
 * its native method as the reference, disables it, and then loads the project
 * polyfill.
 */
//@include "../../Tools/Console/console.js"

var isNodeRuntime = typeof process !== "undefined" &&
    process.versions && process.versions.node;
var nativeFunctionBind = Function.prototype.bind;

Function.prototype.bind = undefined;

//@include "../bind.js"

if (isNodeRuntime) {
    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(
            path.join(__dirname, "../bind.js"),
            "utf8"
        ));
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

    function assertThrowsWith(callback, expectedName, message) {
        try {
            callback();
        } catch (error) {
            if (isNodeRuntime) {
                assertEqual(error.name, expectedName,
                    message || "Unexpected error name");
            } else if (expectedName === "TypeError") {
                assertEqual(error instanceof TypeError, true,
                    message || "Expected TypeError");
            } else {
                assertEqual(error instanceof Error, true,
                    message || "Expected Error");
            }
            return;
        }

        fail((message ? message + ": " : "") + "expected an exception");
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

    test("Function.prototype.bind is installed", function () {
        assertEqual(typeof Function.prototype.bind, "function", "polyfill method");
    });

    test("bind applies the bound this value and prepended arguments", function () {
        function join(a, b, c) {
            return this.prefix + a + b + c;
        }

        var receiver = { prefix: "R:" };
        var expected = nativeFunctionBind ?
            nativeFunctionBind.call(join, receiver, "a", "b")("c") :
            "R:abc";
        var actual = join.bind(receiver, "a", "b")("c");

        assertEqual(actual, expected, "bound call result");
    });

    test("bind ignores the call-time this value", function () {
        function read(value) {
            return this.prefix + value;
        }

        var receiver = { prefix: "bound:" };
        var other = { prefix: "call:" };
        var expected = nativeFunctionBind ?
            nativeFunctionBind.call(read, receiver).call(other, "x") :
            "bound:x";
        var actual = read.bind(receiver).call(other, "x");

        assertEqual(actual, expected, "call-time this");
    });

    test("bind can bind additional arguments over multiple calls", function () {
        function list(a, b, c, d) {
            return [a, b, c, d].join(",");
        }

        var expected = nativeFunctionBind ?
            nativeFunctionBind.call(list, null, "a", "b")("c", "d") :
            "a,b,c,d";
        var actual = list.bind(null, "a", "b")("c", "d");

        assertEqual(actual, expected, "combined arguments");
    });

    test("bind rejects non-callable receivers", function () {
        assertThrowsWith(function () {
            Function.prototype.bind.call({}, {});
        }, "TypeError", "plain object receiver");
    });

    test("bound functions support constructor calls", function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.total = function () {
            return this.x + this.y;
        };

        var NativeBoundPoint = nativeFunctionBind ?
            nativeFunctionBind.call(Point, { ignored: true }, 3) :
            null;
        var BoundPoint = Point.bind({ ignored: true }, 3);
        var expected = NativeBoundPoint ? new NativeBoundPoint(4) :
            { x: 3, y: 4 };
        var actual = new BoundPoint(4);

        assertEqual(actual.x, expected.x, "constructed x");
        assertEqual(actual.y, expected.y, "constructed y");
        assertEqual(actual.total(), 7, "prototype method");
        assertEqual(actual instanceof Point, true, "instanceof target");
    });

    test("constructor calls return explicit object results", function () {
        function Factory(value) {
            this.value = "this:" + value;
            return { value: "object:" + value };
        }

        var NativeBoundFactory = nativeFunctionBind ?
            nativeFunctionBind.call(Factory, null, "x") :
            null;
        var BoundFactory = Factory.bind(null, "x");
        var expected = NativeBoundFactory ? new NativeBoundFactory() :
            { value: "object:x" };
        var actual = new BoundFactory();

        assertEqual(actual.value, expected.value, "constructor object result");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (nativeFunctionBind) {
        Function.prototype.bind = nativeFunctionBind;
    }

    if (failed > 0) {
        throw new Error(failed + " Function test(s) failed");
    }
}());
