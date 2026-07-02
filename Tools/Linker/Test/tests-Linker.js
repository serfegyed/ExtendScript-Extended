"use strict";

var assert = require("assert");
var childProcess = require("child_process");
var fs = require("fs");
var os = require("os");
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

function slash(value) {
    return value.split(path.sep).join("/");
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

(function testFunctionScopesAndConstShadowing() {
    var result = link([
        "const value = [];",
        "function format(console, JSON, Array) {",
        "    const value = \"x\";",
        "    value.padStart(3, \"0\");",
        "    console.log(value);",
        "    JSON.stringify(value);",
        "    Array.from(value);",
        "}",
        "value.at(0);",
        "console.log(value);",
        ""
    ].join("\n"));
    assert.deepStrictEqual(result.diagnostics, []);
    assert.deepStrictEqual(result.includes, [
        "String/Lib/padStart.js",
        "Array/Lib/at.js",
        "Tools/Console/console.js"
    ]);
}());

(function testOutputDirectoryControlsAllRelativeIncludes() {
    var sourcePath = path.join(__dirname, "source", "input.js");
    var outputPath = path.join(__dirname, "build", "nested", "output.js");
    var existingTarget = path.join(repositoryRoot, "String", "Lib", "trim.js");
    var oldRelative = slash(path.relative(path.dirname(sourcePath), existingTarget));
    var newRelative = slash(path.relative(path.dirname(outputPath), existingTarget));
    var atTarget = path.join(repositoryRoot, "Array", "Lib", "at.js");
    var atRelative = slash(path.relative(path.dirname(outputPath), atTarget));
    var source = "//@include \"" + oldRelative + "\"\nvar values = [];\nvalues.at(0);\n";
    var result = linker.linkSource(source, {
        sourcePath: sourcePath,
        outputPath: outputPath,
        repositoryRoot: repositoryRoot,
        nativeCatalog: nativeCatalog,
        polyfillCatalog: polyfillCatalog
    });
    assert.ok(result.source.indexOf("//@include \"" + newRelative + "\"") !== -1,
        "existing relative includes must follow the output directory");
    assert.ok(result.source.indexOf("//@include \"" + atRelative + "\"") !== -1,
        "generated relative includes must follow the output directory");
    assert.ok(result.source.split(/\r\n|\r|\n/).indexOf("//@include \"" + oldRelative + "\"") === -1,
        "the source-relative include must not remain in relocated output");
}());

(function testCheckAndDryRunDoNotWriteFiles() {
    var cliPath = path.join(linkerRoot, "Linker.js");
    var fixturePath = path.join(__dirname, "linker-smoke-input.js");
    var outputPath = path.join(os.tmpdir(), "linker-dry-run-" + process.pid + ".js");
    var check = childProcess.spawnSync(process.execPath, [
        cliPath, fixturePath, "--out", outputPath, "--check"
    ], {encoding: "utf8"});
    assert.strictEqual(check.status, 0, check.stderr);
    assert.ok(check.stdout.indexOf("Check passed.") !== -1);
    assert.strictEqual(fs.existsSync(outputPath), false);

    var dryRun = childProcess.spawnSync(process.execPath, [
        cliPath, fixturePath, "--out", outputPath, "--dry-run"
    ], {encoding: "utf8"});
    assert.strictEqual(dryRun.status, 0, dryRun.stderr);
    assert.ok(dryRun.stdout.indexOf("Would insert: 9") !== -1);
    assert.ok(dryRun.stdout.indexOf("Array/Lib/at.js") !== -1);
    assert.ok(dryRun.stdout.indexOf("Dry run passed.") !== -1);
    assert.strictEqual(fs.existsSync(outputPath), false);
}());

(function testCheckFailsForUnresolvedDependencies() {
    var cliPath = path.join(linkerRoot, "Linker.js");
    var fixturePath = path.join(__dirname, "linker-unresolved-input.js");
    var check = childProcess.spawnSync(process.execPath, [
        cliPath, fixturePath, "--check"
    ], {encoding: "utf8"});
    assert.strictEqual(check.status, 2);
    assert.ok(check.stderr.indexOf("MISSING") !== -1);
    assert.ok(check.stderr.indexOf("Array.prototype.notImplemented") !== -1);
}());

(function testDetailedReportUsesStandardOutput() {
    var cliPath = path.join(linkerRoot, "Linker.js");
    var fixturePath = path.join(__dirname, "linker-report-input.js");
    var report = childProcess.spawnSync(process.execPath, [
        cliPath, fixturePath, "--report"
    ], {encoding: "utf8"});
    assert.strictEqual(report.status, 2);
    assert.strictEqual(report.stderr, "");
    assert.ok(report.stdout.indexOf("native:     Array.prototype.push") !== -1);
    assert.ok(report.stdout.indexOf("polyfill:   Array.prototype.at") !== -1);
    assert.ok(report.stdout.indexOf("unknown:    custom.getValue") !== -1);
    assert.ok(report.stdout.indexOf("unresolved: Array.prototype.futureMethod") !== -1);
    assert.strictEqual(fs.existsSync(path.join(__dirname, "linker-report-input_linked.js")), false);
}());

(function testIndexBuilderFindsAtomicProvidersAndWarnings() {
    assert.strictEqual(polyfillCatalog.providers["Array.prototype.at"].path, "Array/Lib/at.js");
    assert.strictEqual(polyfillCatalog.providers.console.path, "Tools/Console/console.js");
    assert.deepStrictEqual(polyfillCatalog.warnings, []);
    assert.strictEqual(polyfillCatalog.providers["Number.MAX_SAFE_INTEGER"].path,
        "Number/Lib/MAX_SAFE_INTEGER.js");
    assert.strictEqual(polyfillCatalog.providers["Number.MIN_SAFE_INTEGER"].path,
        "Number/Lib/MIN_SAFE_INTEGER.js");
    assert.strictEqual(polyfillCatalog.providers["Number.EPSILON"].path,
        "Number/Lib/EPSILON.js");
    assert.strictEqual(polyfillCatalog.providers["Number.isSafeInteger"].path,
        "Number/Lib/isSafeInteger.js");
    assert.strictEqual(polyfillCatalog.providers["JSON.stringify"].path, "JSON/JSON.stringify.js");
    assert.strictEqual(polyfillCatalog.providers["JSON.parse"].path, "JSON/JSON.parse.js");
    assert.ok(!polyfillCatalog.warnings.some(function (warning) {
        return warning.path === "Object/Lib/create.js";
    }), "local helper prototypes must not be treated as public Object APIs");
}());

console.log("Linker tests passed: 15");
