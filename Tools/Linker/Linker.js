#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");
var linker = require("./Lib/linker");

function usage() {
    console.log("Usage: node Linker.js <source.js> [--out <linked.js>] [--check | --dry-run | --report]");
}

var argumentsList = process.argv.slice(2);
if (!argumentsList.length || argumentsList[0] === "--help") {
    usage();
    process.exit(argumentsList.length ? 0 : 1);
}

var sourcePath = path.resolve(argumentsList[0]);
var outputIndex = argumentsList.indexOf("--out");
var checkOnly = argumentsList.indexOf("--check") !== -1;
var dryRun = argumentsList.indexOf("--dry-run") !== -1;
var reportOnly = argumentsList.indexOf("--report") !== -1;
if ((checkOnly ? 1 : 0) + (dryRun ? 1 : 0) + (reportOnly ? 1 : 0) > 1) {
    console.error("Use only one of --check, --dry-run, or --report.");
    process.exit(1);
}
if (outputIndex !== -1 && !argumentsList[outputIndex + 1]) {
    console.error("--out requires a filename.");
    process.exit(1);
}
var extension = path.extname(sourcePath);
var outputPath = outputIndex !== -1
    ? path.resolve(argumentsList[outputIndex + 1])
    : sourcePath.slice(0, -extension.length) + "_linked" + extension;
var repositoryRoot = path.resolve(__dirname, "..", "..");
var catalogs = linker.loadDefaultCatalogs(__dirname);
var result = linker.linkSource(fs.readFileSync(sourcePath, "utf8"), {
    sourcePath: sourcePath,
    outputPath: outputPath,
    repositoryRoot: repositoryRoot,
    nativeCatalog: catalogs.nativeCatalog,
    polyfillCatalog: catalogs.polyfillCatalog
});

if (reportOnly) {
    result.report.forEach(function (item) {
        var label = item.status + ":";
        console.log(label + new Array(Math.max(2, 13 - label.length)).join(" ") + item.symbol);
    });
} else if (dryRun) {
    console.log("Output: " + outputPath);
    console.log("Would insert: " + result.includeDirectives.length);
    result.includeDirectives.forEach(function (directive) {
        console.log("  " + directive);
    });
} else if (checkOnly) {
    console.log("Check: " + sourcePath);
    console.log("Required includes: " + result.includes.length);
} else {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result.source, "utf8");
    console.log("Written: " + outputPath);
    console.log("Includes inserted: " + result.includes.length);
}
if (!reportOnly) {
    result.diagnostics.forEach(function (diagnostic) {
        console.error(diagnostic.kind.toUpperCase() + " " + diagnostic.line + ":" + diagnostic.column + " " + diagnostic.message);
    });
}
if (result.diagnostics.length) {
    process.exitCode = 2;
} else if (checkOnly) {
    console.log("Check passed.");
} else if (dryRun) {
    console.log("Dry run passed.");
} else if (reportOnly) {
    console.log("Report passed.");
}
