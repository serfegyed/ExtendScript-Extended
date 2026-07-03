#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const linker = require("./Lib/linker");
const catalogManager = require("./Lib/catalogManager");

const usage = () => {
    console.log("Usage: node Linker.js <source.js> [--out <linked.js>] [--check | --dry-run | --report]");
};

const args = process.argv.slice(2);
if (!args.length || args[0] === "--help") {
    usage();
    process.exit(args.length ? 0 : 1);
}

const sourcePath = path.resolve(args[0]);
const outputIndex = args.indexOf("--out");
const checkOnly = args.includes("--check");
const dryRun = args.includes("--dry-run");
const reportOnly = args.includes("--report");

if ([checkOnly, dryRun, reportOnly].filter(Boolean).length > 1) {
    console.error("Use only one of --check, --dry-run, or --report.");
    process.exit(1);
}
if (outputIndex !== -1 && !args[outputIndex + 1]) {
    console.error("--out requires a filename.");
    process.exit(1);
}

const extension = path.extname(sourcePath);
const outputPath = outputIndex !== -1
    ? path.resolve(args[outputIndex + 1])
    : `${sourcePath.slice(0, -extension.length)}_linked${extension}`;
const repositoryRoot = path.resolve(__dirname, "..", "..");
const source = fs.readFileSync(sourcePath, "utf8");
const catalogs = catalogManager.catalogsForSource(__dirname, source);

if (catalogs.target && !catalogs.hostSource) {
    console.error(`WARNING No OMV catalog was found for #target ${catalogs.target}.`);
}

const result = linker.linkSource(source, {
    sourcePath,
    outputPath,
    repositoryRoot,
    nativeCatalog: catalogs.nativeCatalog,
    polyfillCatalog: catalogs.polyfillCatalog
});

if (reportOnly) {
    result.report.forEach(({status, symbol}) => console.log(`${`${status}:`.padEnd(12)}${symbol}`));
} else if (dryRun) {
    console.log(`Output: ${outputPath}`);
    console.log(`Would insert: ${result.includeDirectives.length}`);
    result.includeDirectives.forEach(directive => console.log(`  ${directive}`));
} else if (checkOnly) {
    console.log(`Check: ${sourcePath}`);
    console.log(`Required includes: ${result.includes.length}`);
} else {
    fs.mkdirSync(path.dirname(outputPath), {recursive: true});
    fs.writeFileSync(outputPath, result.source, "utf8");
    console.log(`Written: ${outputPath}`);
    console.log(`Includes inserted: ${result.includes.length}`);
}

if (!reportOnly) {
    result.diagnostics.forEach(({kind, line, column, message}) => {
        console.error(`${kind.toUpperCase()} ${line}:${column} ${message}`);
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
