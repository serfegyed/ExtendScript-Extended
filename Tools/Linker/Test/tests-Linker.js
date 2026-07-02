"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var builder = require("../Lib/buildPolyfillIndex");
var linker = require("../Lib/linker");

var linkerRoot = path.resolve(__dirname, "..");
var repositoryRoot = path.resolve(linkerRoot, "..", "..");
var nativeCatalog = require("../Catalog/estk-3.json");
var polyfillCatalog = builder.build(repositoryRoot);
var sourcePath = path.join(__dirname, "fixture.js");

function link(source) {
    return linker.linkSource(source, {
        sourcePath: sourcePath,
        repositoryRoot: repositoryRoot,
        nativeCatalog: nativeCatalog,
        polyfillCatalog: polyfillCatalog
    });
}

(function testOriginalExample() {
    var result = link([
        "var arr = [1, 2, 3];",
        "arr.push(4);",
        "console.log(arr.at(3));",
        ""
    ].join("\n"));

    assert.deepStrictEqual(result.diagnostics, []);
    assert.deepStrictEqual(result.includes.sort(), [
        "Array/Lib/at.js",
        "Tools/Console/console.js"
    ].sort());
    assert.ok(result.source.indexOf("Array/Lib/at.js") < result.source.indexOf("var arr"),
        "all includes must precede the first code statement");
    assert.ok(result.source.indexOf("Array/Lib/at.js") < result.source.indexOf("console.log"),
        "the polyfill must precede its first use");
    assert.ok(result.source.indexOf("Tools/Console/console.js") < result.source.indexOf("console.log"),
        "the console polyfill must precede its first use");
}());

(function testHeaderCommentsStayBeforeIncludes() {
    var result = link([
        "// Copyright header",
        "/* second header comment */",
        "var values = [];",
        "values.at(0);",
        ""
    ].join("\n"));
    assert.ok(result.source.indexOf("Copyright header") < result.source.indexOf("Array/Lib/at.js"));
    assert.ok(result.source.indexOf("second header comment") < result.source.indexOf("Array/Lib/at.js"));
    assert.ok(result.source.indexOf("Array/Lib/at.js") < result.source.indexOf("var values"));
}());

(function testDuplicateUseProducesOneInclude() {
    var result = link("var values = [];\nvalues.at(0);\nvalues.at(1);\n");
    var matches = result.source.match(/Array\/Lib\/at\.js/g) || [];
    assert.strictEqual(matches.length, 1);
}());

(function testExistingIncludeIsPreservedWithoutDuplication() {
    var source = "//@include \"../../../Array/Lib/at.js\"\nvar values = [];\nvalues.at(0);\n";
    var result = link(source);
    var matches = result.source.match(/Array\/Lib\/at\.js/g) || [];
    assert.strictEqual(matches.length, 1);
}());

(function testMissingKnownMethodIsReported() {
    var result = link("var values = [];\nvalues.notImplemented();\n");
    assert.strictEqual(result.diagnostics.length, 1);
    assert.strictEqual(result.diagnostics[0].kind, "missing");
    assert.strictEqual(result.diagnostics[0].symbol, "Array.prototype.notImplemented");
}());

(function testUnknownReceiverIsReportedConservatively() {
    var result = link("mystery.at(0);\n");
    assert.strictEqual(result.diagnostics.length, 1);
    assert.strictEqual(result.diagnostics[0].kind, "unknown-receiver");
}());

(function testJsonMethodsResolveToSeparateProviders() {
    var result = link([
        "var text = JSON.stringify({value: 1});",
        "var value = JSON.parse(text);",
        ""
    ].join("\n"));
    assert.deepStrictEqual(result.diagnostics, []);
    assert.deepStrictEqual(result.includes, [
        "JSON/JSON.stringify.js",
        "JSON/JSON.parse.js"
    ]);
    assert.strictEqual((result.source.match(/JSON\.stringify\.js/g) || []).length, 1);
    assert.strictEqual((result.source.match(/JSON\.parse\.js/g) || []).length, 1);
}());

(function testExpressionResultTypesArePropagated() {
    var result = link([
        "var parts = \"a,b\".split(\",\");",
        "parts.at(0);",
        "\"c,d\".split(\",\").at(1);",
        "[1, 2].at(-1);",
        "new Date().toISOString();",
        ""
    ].join("\n"));
    assert.deepStrictEqual(result.diagnostics, []);
    assert.deepStrictEqual(result.includes, [
        "Array/Lib/at.js",
        "Date/Lib/Date.toISOString.js"
    ]);
}());

(function testMultiProviderSmokeFixture() {
    var fixturePath = path.join(__dirname, "linker-smoke-input.js");
    var result = linker.linkSource(fs.readFileSync(fixturePath, "utf8"), {
        sourcePath: fixturePath,
        repositoryRoot: repositoryRoot,
        nativeCatalog: nativeCatalog,
        polyfillCatalog: polyfillCatalog
    });
    assert.deepStrictEqual(result.diagnostics, []);
    assert.deepStrictEqual(result.includes, [
        "Array/Lib/at.js",
        "String/Lib/padStart.js",
        "String/Lib/includes.js",
        "Date/Lib/Date.toISOString.js",
        "Math/Math.cbrt.js",
        "Number/Lib/isInteger.js",
        "JSON/JSON.stringify.js",
        "JSON/JSON.parse.js",
        "Tools/Console/console.js"
    ]);
    assert.ok(result.source.indexOf("Linker smoke test") < result.source.indexOf("//@include"));
    assert.ok(result.source.indexOf("//@include") < result.source.indexOf("var numbers"));
}());

(function testIndexBuilderFindsAtomicProvidersAndWarnings() {
    assert.strictEqual(polyfillCatalog.providers["Array.prototype.at"].path, "Array/Lib/at.js");
    assert.strictEqual(polyfillCatalog.providers.console.path, "Tools/Console/console.js");
    assert.ok(polyfillCatalog.warnings.some(function (warning) {
        return warning.path === "Number/Lib/constants.js" && warning.reason === "multiple-public-symbols";
    }));
    assert.ok(polyfillCatalog.warnings.some(function (warning) {
        return warning.path === "Number/Lib/isSafeInteger.js" && warning.reason === "multiple-public-symbols";
    }));
    assert.strictEqual(polyfillCatalog.providers["JSON.stringify"].path, "JSON/JSON.stringify.js");
    assert.strictEqual(polyfillCatalog.providers["JSON.parse"].path, "JSON/JSON.parse.js");
    assert.ok(!polyfillCatalog.warnings.some(function (warning) {
        return warning.path === "Object/Lib/create.js";
    }), "local helper prototypes must not be treated as public Object APIs");
}());

console.log("Linker tests passed: 10");
