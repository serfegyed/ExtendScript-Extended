/*
 * JSON polyfill reference and compatibility tests.
 *
 * ExtendScript processes the include directives. Node.js ignores them, saves
 * its native JSON object as the reference, then loads the polyfill in place of
 * the native global JSON object.
 */
//@include "../Tools/Console/console.js"
//@include "./JSON.stringify.js"
//@include "./JSON.parse.js"

const nativeJSON = (typeof process !== "undefined" && process.versions && process.versions.node)
    ? JSON
    : null;

if (nativeJSON !== null) {
    const fs = require("fs");
    const vm = require("vm");
    const stringifyFilename = __dirname + "/JSON.stringify.js";
    const parseFilename = __dirname + "/JSON.parse.js";
    global.JSON = undefined;
    vm.runInThisContext(fs.readFileSync(stringifyFilename, "utf8"), {filename: stringifyFilename});
    if (typeof JSON.stringify !== "function" || typeof JSON.parse !== "undefined") {
        throw new Error("JSON.stringify.js must install only JSON.stringify");
    }
    vm.runInThisContext(fs.readFileSync(parseFilename, "utf8"), {filename: parseFilename});
}

(function () {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    var passed = 0;
    var failed = 0;

    function fail(message) {
        throw new Error(message);
    }

    function assert(condition, message) {
        if (!condition) {
            fail(message || "Assertion failed");
        }
    }

    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            fail((message ? message + ": " : "") + "expected " + String(expected) + ", got " + String(actual));
        }
    }

    function assertNegativeZero(value, message) {
        if (value !== 0 || 1 / value !== -Infinity) {
            fail(message || "Expected negative zero");
        }
    }

    function assertThrows(callback, expectedName, message) {
        var thrown = false;
        try {
            callback();
        } catch (error) {
            thrown = true;
            if (expectedName && nativeJSON !== null && error.name !== expectedName) {
                fail((message ? message + ": " : "") + "expected " + expectedName + ", got " + error.name);
            }
            if (expectedName && nativeJSON === null) {
                var expectedConstructor = expectedName === "TypeError" ? TypeError :
                    (expectedName === "SyntaxError" ? SyntaxError : Error);
                if (!(error instanceof expectedConstructor)) {
                    fail((message ? message + ": " : "") +
                        "expected native " + expectedName + " constructor");
                }
            }
        }
        if (!thrown) {
            fail((message ? message + ": " : "") + "expected an exception");
        }
    }

    function test(name, callback) {
        try {
            callback();
            passed++;
            console.log("PASS: " + name);
        } catch (error) {
            failed++;
            console.error("FAIL: " + name + "\n  " + (error.message || String(error)));
        }
    }

    function checkStringify(name, valueFactory, replacerFactory, space, expected) {
        test("stringify: " + name, function () {
            if (nativeJSON !== null) {
                const nativeReplacer = replacerFactory ? replacerFactory() : null;
                assertEqual(
                    nativeJSON.stringify(valueFactory(), nativeReplacer, space),
                    expected,
                    "Node reference"
                );
            }

            const replacer = replacerFactory ? replacerFactory() : null;
            assertEqual(JSON.stringify(valueFactory(), replacer, space), expected, "polyfill");
        });
    }

    function checkParse(name, text, verifier) {
        test("parse: " + name, function () {
            if (nativeJSON !== null) {
                verifier(nativeJSON.parse(text), "Node reference");
            }
            verifier(JSON.parse(text), "polyfill");
        });
    }

    function checkInvalid(text) {
        test("parse rejects: " + String(text), function () {
            if (nativeJSON !== null) {
                assertThrows(function () {
                    nativeJSON.parse(text);
                }, "SyntaxError", "Node reference");
            }
            assertThrows(function () {
                JSON.parse(text);
            }, "SyntaxError", "polyfill");
        });
    }

    test("global JSON object is installed", function () {
        assert(typeof JSON === "object", "JSON must be an object");
        assert(typeof JSON.stringify === "function", "JSON.stringify must exist");
        assert(typeof JSON.parse === "function", "JSON.parse must exist");
    });

    checkStringify("null", function () { return null; }, null, undefined, "null");
    checkStringify("booleans", function () { return [true, false]; }, null, undefined, "[true,false]");
    checkStringify("finite numbers", function () { return [0, -0, 1.5, -2, 1e+30]; }, null, undefined, "[0,0,1.5,-2,1e+30]");
    checkStringify("non-finite numbers", function () { return [NaN, Infinity, -Infinity]; }, null, undefined, "[null,null,null]");
    checkStringify("quote and backslash escapes", function () { return "\"\\"; }, null, undefined, "\"\\\"\\\\\"");
    checkStringify("control-character escapes", function () { return "\b\t\n\f\r\u0000\u001f"; }, null, undefined, "\"\\b\\t\\n\\f\\r\\u0000\\u001f\"");
    checkStringify("Unicode text", function () { return "© 😀"; }, null, undefined, "\"© 😀\"");
    checkStringify("lone high surrogate", function () { return "\uD800"; }, null, undefined, "\"\\ud800\"");
    checkStringify("lone low surrogate", function () { return "\uDC00"; }, null, undefined, "\"\\udc00\"");
    checkStringify("unsupported array values", function () {
        const value = [];
        value.length = 4;
        value[0] = undefined;
        value[1] = function () {};
        value[3] = NaN;
        return value;
    }, null, undefined, "[null,null,null,null]");
    checkStringify("unsupported object values", function () {
        return {a: 1, b: undefined, c: function () {}, d: null};
    }, null, undefined, "{\"a\":1,\"d\":null}");
    checkStringify("escaped property names", function () {
        const value = {};
        value["a\"\\\n"] = 1;
        return value;
    }, null, undefined, "{\"a\\\"\\\\\\n\":1}");
    checkStringify("inherited properties are ignored", function () {
        function Parent() {}
        Parent.prototype.inherited = 1;
        const value = new Parent();
        value.own = 2;
        return value;
    }, null, undefined, "{\"own\":2}");
    checkStringify("boxed primitives", function () {
        return [new Number(2), new String("x"), new Boolean(false)];
    }, null, undefined, "[2,\"x\",false]");
    checkStringify("custom toJSON", function () {
        return {
            item: {
                value: 12,
                toJSON: function (key) {
                    return key + ":" + this.value;
                }
            }
        };
    }, null, undefined, "{\"item\":\"item:12\"}");
    checkStringify("root toJSON receives empty key", function () {
        return {
            toJSON: function (key) {
                return key === "" ? "root" : "wrong";
            }
        };
    }, null, undefined, "\"root\"");
    checkStringify("inherited toJSON", function () {
        function Value() {
            this.number = 7;
        }
        Value.prototype.toJSON = function () {
            return this.number;
        };
        return {value: new Value()};
    }, null, undefined, "{\"value\":7}");
    checkStringify("toJSON runs before replacer", function () {
        return {
            value: {
                toJSON: function () {
                    return 4;
                }
            }
        };
    }, function () {
        return function (key, value) {
            return key === "value" ? value * 2 : value;
        };
    }, undefined, "{\"value\":8}");
    checkStringify("replacer function removes properties", function () {
        return {a: 1, b: 2, c: 3};
    }, function () {
        return function (key, value) {
            return key === "b" ? undefined : value;
        };
    }, undefined, "{\"a\":1,\"c\":3}");
    checkStringify("replacer property list", function () {
        return {a: 1, b: 2, 1: "one", c: 3};
    }, function () {
        return ["b", "a", "b", 1];
    }, undefined, "{\"b\":2,\"a\":1,\"1\":\"one\"}");
    checkStringify("numeric indentation", function () {
        return {a: 1, b: [true]};
    }, null, 2, "{\n  \"a\": 1,\n  \"b\": [\n    true\n  ]\n}");
    checkStringify("string indentation is limited to ten characters", function () {
        return {a: 1};
    }, null, "abcdefghijk", "{\nabcdefghij\"a\": 1\n}");

    test("stringify returns undefined for unsupported root values", function () {
        if (nativeJSON !== null) {
            assertEqual(nativeJSON.stringify(undefined), undefined, "Node undefined reference");
            assertEqual(nativeJSON.stringify(function () {}), undefined, "Node function reference");
        }
        assertEqual(JSON.stringify(undefined), undefined, "polyfill undefined");
        assertEqual(JSON.stringify(function () {}), undefined, "polyfill function");
    });

    test("stringify rejects circular structures", function () {
        function circularValue() {
            const value = {};
            value.self = value;
            return value;
        }
        if (nativeJSON !== null) {
            assertThrows(function () {
                nativeJSON.stringify(circularValue());
            }, "TypeError", "Node reference");
        }
        assertThrows(function () {
            JSON.stringify(circularValue());
        }, "TypeError", "polyfill");
    });

    checkParse("null", "null", function (value, source) {
        assertEqual(value, null, source);
    });
    checkParse("booleans", "[true,false]", function (value, source) {
        assertEqual(value.length, 2, source + " length");
        assertEqual(value[0], true, source + " true");
        assertEqual(value[1], false, source + " false");
    });
    checkParse("nested structure", "{\"a\":[1,{\"b\":\"x\"}],\"c\":null}", function (value, source) {
        assertEqual(value.a[0], 1, source + " first item");
        assertEqual(value.a[1].b, "x", source + " nested value");
        assertEqual(value.c, null, source + " null value");
    });
    checkParse("whitespace", " \t\r\n { \"a\" : 1 } \n", function (value, source) {
        assertEqual(value.a, 1, source);
    });
    checkParse("string escapes", "\"\\\"\\\\\\/\\b\\f\\n\\r\\t\"", function (value, source) {
        assertEqual(value, "\"\\/\b\f\n\r\t", source);
    });
    checkParse("Unicode escapes", "\"\\u00a9 \\uD83D\\uDE00\"", function (value, source) {
        assertEqual(value, "© 😀", source);
    });
    checkParse("number grammar", "[-0,0,12,-3.5,6.02e23,1E-7,1e400]", function (value, source) {
        assertNegativeZero(value[0], source + " negative zero");
        assertEqual(value[1], 0, source + " zero");
        assertEqual(value[2], 12, source + " integer");
        assertEqual(value[3], -3.5, source + " decimal");
        assertEqual(value[4], 6.02e23, source + " positive exponent");
        assertEqual(value[5], 1e-7, source + " negative exponent");
        assertEqual(value[6], Infinity, source + " overflow");
    });
    checkParse("duplicate property keeps final value", "{\"a\":1,\"a\":2}", function (value, source) {
        assertEqual(value.a, 2, source);
    });
    checkParse("input is converted to string", null, function (value, source) {
        assertEqual(value, null, source);
    });
    checkParse("__proto__ is parsed as an own property", "{\"__proto__\":{\"safe\":true}}", function (value, source) {
        assert(hasOwnProperty.call(value, "__proto__"), source + " own property");
        assertEqual(value.__proto__.safe, true, source + " property value");
        assertEqual(typeof ({}).safe, "undefined", source + " prototype unchanged");
    });

    const invalidTexts = [
        "",
        " ",
        "01",
        "-01",
        "1.",
        ".1",
        "1e",
        "1e+",
        "+1",
        "NaN",
        "Infinity",
        "[1,]",
        "{\"a\":1,}",
        "[1 2]",
        "{\"a\" 1}",
        "{'a':1}",
        "\"unterminated",
        "\"bad\\xescape\"",
        "\"bad\\u12\"",
        "\"line\nfeed\"",
        "true false",
        "\u00a0null"
    ];

    for (var invalidIndex = 0; invalidIndex < invalidTexts.length; invalidIndex++) {
        checkInvalid(invalidTexts[invalidIndex]);
    }

    test("reviver transforms values and deletes object properties", function () {
        function reviver(key, value) {
            if (key === "remove") {
                return undefined;
            }
            if (typeof value === "number") {
                return value * 10;
            }
            return value;
        }

        function verify(value, source) {
            assertEqual(value.keep, 10, source + " transformed value");
            assert(!hasOwnProperty.call(value, "remove"), source + " deleted property");
        }

        if (nativeJSON !== null) {
            verify(nativeJSON.parse("{\"keep\":1,\"remove\":2}", reviver), "Node reference");
        }
        verify(JSON.parse("{\"keep\":1,\"remove\":2}", reviver), "polyfill");
    });

    test("reviver deletes array elements without shrinking the array", function () {
        function reviver(key, value) {
            return key === "1" ? undefined : value;
        }

        function verify(value, source) {
            assertEqual(value.length, 3, source + " length");
            assert(!hasOwnProperty.call(value, "1"), source + " hole");
        }

        if (nativeJSON !== null) {
            verify(nativeJSON.parse("[1,2,3]", reviver), "Node reference");
        }
        verify(JSON.parse("[1,2,3]", reviver), "polyfill");
    });

    test("reviver walks children before parents", function () {
        function run(parser) {
            const order = [];
            parser("{\"a\":{\"b\":1}}", function (key, value) {
                order.push(key);
                return value;
            });
            return order.join(",");
        }

        if (nativeJSON !== null) {
            assertEqual(run(nativeJSON.parse), "b,a,", "Node reference");
        }
        assertEqual(run(JSON.parse), "b,a,", "polyfill");
    });

    test("root reviver can replace or remove the result", function () {
        function replaceRoot(key, value) {
            return key === "" ? {wrapped: value} : value;
        }
        function removeRoot(key, value) {
            return key === "" ? undefined : value;
        }

        assertEqual(JSON.parse("1", replaceRoot).wrapped, 1, "replace root");
        assertEqual(JSON.parse("1", removeRoot), undefined, "remove root");
    });

    console.log("\nPassed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0) {
        throw new Error(failed + " JSON test(s) failed");
    }
}());
