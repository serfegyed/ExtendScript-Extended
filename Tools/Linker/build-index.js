#!/usr/bin/env node
"use strict";

var path = require("path");
var builder = require("./Lib/buildPolyfillIndex");

var linkerRoot = __dirname;
var repositoryRoot = path.resolve(linkerRoot, "..", "..");
var outputFile = path.join(linkerRoot, "Catalog", "polyfills.json");
var result = builder.write(repositoryRoot, outputFile);

console.log("Polyfill providers: " + Object.keys(result.providers).length);
console.log("Catalog warnings: " + result.warnings.length);
