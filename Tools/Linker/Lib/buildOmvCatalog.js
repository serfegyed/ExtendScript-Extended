"use strict";

const fs = require("fs");

const decode = value => String(value || "")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

function attribute(tag, name) {
    return decode(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i").exec(tag)?.[2]);
}

function datatype(body) {
    const cleaned = body.replace(/<parameters\b[\s\S]*?<\/parameters>/gi, "");
    const block = /<datatype\b[^>]*>([\s\S]*?)<\/datatype>/i.exec(cleaned)?.[1];
    const type = block && /<type\b[^>]*>([\s\S]*?)<\/type>/i.exec(block)?.[1];
    if (!type) return null;

    const value = decode(type.replace(/<[^>]+>/g, "").trim());
    if (/<array\s*\/\s*>/i.test(block)) return "Array";
    if (/^string$/i.test(value)) return "String";
    if (/^(?:bool|boolean)$/i.test(value)) return "Boolean";
    if (/^(?:number|integer|long|real|short)$/i.test(value)) return "Number";
    if (/^(?:any|varies=any|void|undefined|null|nothing)$/i.test(value)) return null;
    return value || null;
}

function addMember(catalog, className, mode, name, returnType) {
    const type = catalog.types[className] ||= {static: [], prototype: []};
    if (!type[mode].includes(name)) type[mode].push(name);
    if (returnType) {
        catalog.returns[`${className}${mode === "static" ? "." : ".prototype."}${name}`] = returnType;
    }
}

function parse(source, metadata = {}) {
    const catalog = {
        version: 1,
        runtime: metadata.runtime || "Adobe OMV",
        metadata,
        globals: [],
        globalTypes: {},
        types: {},
        returns: {}
    };

    for (const classMatch of source.matchAll(/<classdef\b([^>]*)>([\s\S]*?)<\/classdef>/gi)) {
        const className = attribute(classMatch[1], "name");
        if (!className) continue;
        catalog.types[className] ||= {static: [], prototype: []};

        for (const elementsMatch of classMatch[2].matchAll(/<elements\b([^>]*)>([\s\S]*?)<\/elements>/gi)) {
            const mode = attribute(elementsMatch[1], "type") === "class" ? "static" : "prototype";
            for (const memberMatch of elementsMatch[2].matchAll(/<(property|method)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
                const memberName = attribute(memberMatch[2], "name");
                if (memberName && memberName !== "[]") {
                    addMember(catalog, className, mode, memberName, datatype(memberMatch[3]));
                }
            }
        }
    }

    if (catalog.types.Application) {
        catalog.globals.push("app");
        catalog.globalTypes.app = "Application";
    }
    for (const type of Object.values(catalog.types)) {
        type.static.sort();
        type.prototype.sort();
    }
    return catalog;
}

const buildFile = (file, metadata) => parse(fs.readFileSync(file, "utf8"), metadata);

module.exports = {parse, buildFile};
