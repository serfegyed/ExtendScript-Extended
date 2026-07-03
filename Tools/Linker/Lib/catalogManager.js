"use strict";

const fs = require("fs");
const path = require("path");
const builder = require("./buildOmvCatalog");
const discovery = require("./discoverOmvCatalogs");

const GENERATOR_VERSION = 1;

const fingerprint = files => files.map(file => {
    const {size, mtimeMs} = fs.statSync(file);
    return {path: path.resolve(file), size, mtimeMs: Math.floor(mtimeMs)};
});

const sameSources = (left, right) => JSON.stringify(left || []) === JSON.stringify(right || []);

function mergeCatalogs(catalogs) {
    const result = {version: 1, globals: [], globalTypes: {}, types: {}, returns: {}};

    for (const catalog of catalogs.filter(Boolean)) {
        for (const name of catalog.globals || []) {
            if (!result.globals.includes(name)) result.globals.push(name);
        }
        Object.assign(result.globalTypes, catalog.globalTypes || {});

        for (const [name, source] of Object.entries(catalog.types || {})) {
            const target = result.types[name] ||= {static: [], prototype: []};
            for (const mode of ["static", "prototype"]) {
                for (const member of source[mode] || []) {
                    if (!target[mode].includes(member)) target[mode].push(member);
                }
            }
        }
        for (const [symbol, returnType] of Object.entries(catalog.returns || {})) {
            if (!Object.hasOwn(result.returns, symbol)) result.returns[symbol] = returnType;
        }
    }
    return result;
}

const buildCombined = (files, metadata) =>
    mergeCatalogs(files.map(file => builder.buildFile(file, metadata)));

function ensure(outputFile, files, metadata = {}) {
    if (!files.length) return null;
    const sources = fingerprint(files);
    let cached = null;

    try {
        cached = JSON.parse(fs.readFileSync(outputFile, "utf8"));
    } catch {}
    if (cached?.generatorVersion === GENERATOR_VERSION && sameSources(cached.metadata?.sources, sources)) {
        return cached;
    }

    const catalog = buildCombined(files, metadata);
    catalog.generatorVersion = GENERATOR_VERSION;
    catalog.metadata = {...metadata, sources};
    fs.mkdirSync(path.dirname(outputFile), {recursive: true});
    fs.writeFileSync(outputFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
    return catalog;
}

function catalogsForSource(linkerRoot, source, options = {}) {
    const catalogRoot = path.join(linkerRoot, "Catalog");
    const generatedRoot = options.generatedRoot || path.join(catalogRoot, "Generated");
    const readCatalog = name => JSON.parse(fs.readFileSync(path.join(catalogRoot, name), "utf8"));
    const base = readCatalog("estk-3.json");
    const polyfillCatalog = readCatalog("polyfills.json");
    const common = ensure(
        path.join(generatedRoot, "common.json"),
        discovery.commonSources(options),
        {runtime: "Adobe Common ExtendScript"}
    );
    const target = discovery.targetFromSource(source);
    const hostSource = target && discovery.targetSource(target, options);
    const host = hostSource && ensure(
        path.join(generatedRoot, `${target}-${hostSource.version}.json`),
        [hostSource.file],
        {runtime: `Adobe ${target} DOM`, target, domVersion: hostSource.version}
    );

    return {
        nativeCatalog: mergeCatalogs([base, common, host]),
        polyfillCatalog,
        target,
        hostSource
    };
}

module.exports = {mergeCatalogs, ensure, catalogsForSource};
