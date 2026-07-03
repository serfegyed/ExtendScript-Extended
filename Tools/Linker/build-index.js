#!/usr/bin/env node
"use strict";

const path = require("path");
const builder = require("./Lib/buildPolyfillIndex");

const repositoryRoot = path.resolve(__dirname, "..", "..");
const outputFile = path.join(__dirname, "Catalog", "polyfills.json");
const result = builder.write(repositoryRoot, outputFile);

console.log(`Polyfill providers: ${Object.keys(result.providers).length}`);
console.log(`Catalog warnings: ${result.warnings.length}`);
