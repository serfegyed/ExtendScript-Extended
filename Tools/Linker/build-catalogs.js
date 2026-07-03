#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const manager = require("./Lib/catalogManager");

const target = process.argv[2] || null;
const source = target ? `#target ${target}\n` : "";
const catalogs = manager.catalogsForSource(__dirname, source);
const generated = path.join(__dirname, "Catalog", "Generated");

console.log(`Generated catalog folder: ${generated}`);
console.log(`Common catalog: ${fs.existsSync(path.join(generated, "common.json")) ? "ready" : "not found"}`);
if (target) {
    console.log(`Host catalog: ${catalogs.hostSource?.file || "not found"}`);
    if (!catalogs.hostSource) process.exitCode = 2;
}
