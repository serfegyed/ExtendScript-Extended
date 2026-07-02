#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");
var linker = require("./Lib/linker");

function usage() {
    console.log("Usage: node Linker.js <source.js> [--out <linked.js>]");
}

var argumentsList = process.argv.slice(2);
if (!argumentsList.length || argumentsList[0] === "--help") {
    usage();
    process.exit(argumentsList.length ? 0 : 1);
}

var sourcePath = path.resolve(argumentsList[0]);
var outputIndex = argumentsList.indexOf("--out");
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

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, result.source, "utf8");
console.log("Written: " + outputPath);
console.log("Includes inserted: " + result.includes.length);
result.diagnostics.forEach(function (diagnostic) {
    console.error(diagnostic.kind.toUpperCase() + " " + diagnostic.line + ":" + diagnostic.column + " " + diagnostic.message);
});
if (result.diagnostics.some(function (diagnostic) { return diagnostic.kind === "missing"; })) process.exitCode = 2;
