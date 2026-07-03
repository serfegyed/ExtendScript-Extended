"use strict";

const fs = require("fs");
const path = require("path");

const exists = item => {
    try {
        return fs.existsSync(item);
    } catch {
        return false;
    }
};
const existing = paths => paths.filter(exists);

function walk(directory, predicate, result) {
    if (!exists(directory)) return;
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) walk(file, predicate, result);
        else if (entry.isFile() && predicate(file)) result.push(file);
    }
}

const versionParts = value => String(value || "").split(".").map(part => parseInt(part, 10) || 0);

function compareVersions(left, right) {
    const a = versionParts(left);
    const b = versionParts(right);
    for (let index = 0; index < Math.max(a.length, b.length); index++) {
        const difference = (a[index] || 0) - (b[index] || 0);
        if (difference) return difference;
    }
    return 0;
}

function normalizeTarget(value) {
    const target = String(value || "").toLowerCase().replace(/^['"]|['"]$/g, "");
    if (/^indesignserver(?:-|$)/.test(target)) return "indesignserver";
    return target.replace(/-\d+(?:\.\d+)*.*$/, "");
}

function targetFromSource(source) {
    let index = source.charCodeAt(0) === 0xFEFF ? 1 : 0;
    while (index < source.length) {
        if (/\s/.test(source[index])) {
            index++;
            continue;
        }

        const match = /^(?:#target|\/\/@target)\s+(?:"([^"]+)"|'([^']+)'|([^\s]+))/i.exec(source.slice(index));
        if (match) return normalizeTarget(match[1] || match[2] || match[3]);

        if (source.slice(index, index + 2) === "//") {
            while (index < source.length && !/[\r\n]/.test(source[index])) index++;
        } else if (source.slice(index, index + 2) === "/*") {
            index += 2;
            while (index < source.length && source.slice(index, index + 2) !== "*/") index++;
            index = Math.min(index + 2, source.length);
        } else {
            break;
        }
    }
    return null;
}

const defaultDictionaryRoots = () => existing([
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, "Common Files", "Adobe", "Scripting Dictionaries CC"),
    process.env["ProgramFiles(x86)"] && path.join(process.env["ProgramFiles(x86)"], "Common Files", "Adobe", "Scripting Dictionaries CC")
].filter(Boolean));

const defaultCacheRoots = () => existing([
    process.env.APPDATA && path.join(process.env.APPDATA, "Adobe", "ExtendScript Toolkit")
].filter(Boolean));

function commonSources(options = {}) {
    const result = new Set();
    for (const root of options.dictionaryRoots || defaultDictionaryRoots()) {
        for (const name of ["javascript.xml", "scriptui.xml"]) {
            const file = path.join(root, "CommonFiles", name);
            if (exists(file)) result.add(file);
        }
    }
    return [...result];
}

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function dynamicTargetSources(target, options = {}) {
    const files = [];
    const expression = new RegExp(`^omv\\$${escapeRegExp(target)}-[^$]+\\$([0-9.]+)\\.xml$`, "i");

    for (const root of options.cacheRoots || defaultCacheRoots()) {
        walk(root, file => expression.test(path.basename(file)), files);
    }
    return files
        .map(file => ({file, version: expression.exec(path.basename(file))?.[1] || "0"}))
        .filter(({file}) => {
            try {
                return fs.statSync(file).size > 0;
            } catch {
                return false;
            }
        })
        .sort((a, b) => compareVersions(b.version, a.version));
}

function staticTargetSources(target, options = {}) {
    const result = [];
    for (const root of options.dictionaryRoots || defaultDictionaryRoots()) {
        for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
            if (!entry.isDirectory() || normalizeTarget(entry.name.replace(/\s+/g, "-")) !== target) continue;
            const file = path.join(root, entry.name, "omv.xml");
            if (exists(file)) {
                result.push({
                    file,
                    version: entry.name.replace(/^.*?([0-9]+(?:\.[0-9]+)*)\s*$/, "$1")
                });
            }
        }
    }
    return result;
}

function targetSource(target, options = {}) {
    return dynamicTargetSources(target, options)[0] || staticTargetSources(target, options)[0] || null;
}

module.exports = {
    compareVersions,
    normalizeTarget,
    targetFromSource,
    commonSources,
    targetSource
};
