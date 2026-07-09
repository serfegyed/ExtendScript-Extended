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

const normalizeType = value => {
    const type = decode(value).replace(/<[^>]+>/g, "").trim();
    if (/^string$/i.test(type)) return "String";
    if (/^(?:bool|boolean)$/i.test(type)) return "Boolean";
    if (/^(?:number|integer|long|real|short)$/i.test(type)) return "Number";
    if (/^(?:any|varies=any|void|undefined|null|nothing)$/i.test(type)) return null;
    return type || null;
};

function describedTypes(body) {
    const text = description(body);
    const returned = /\bCan return:\s*([\s\S]*?)(?:\.(?:\s|$)|\bCan also accept:|$)/i.exec(text)?.[1];
    const parent = /\bThe parent of\b[\s\S]*?\(\s*(?:an?\s+)?([\s\S]*?)\)\.?$/i.exec(text)?.[1];
    const list = returned || parent;
    if (!list) return [];
    return list
        .replace(/\b(?:enumerator|enumerators)\b/gi, "")
        .split(/\s*,\s*|\s+or\s+/i)
        .map(value => value.trim().replace(/\s+/g, " "))
        .map(value => normalizeType(value.replace(/^Array of\s+/i, "")) &&
            (/^Array of\s+/i.test(value)
                ? `Array of ${normalizeType(value.replace(/^Array of\s+/i, ""))}`
                : normalizeType(value)))
        .filter(Boolean)
        .filter((value, index, values) => values.indexOf(value) === index);
}

function datatypeInfo(body) {
    const cleaned = body.replace(/<parameters\b[\s\S]*?<\/parameters>/gi, "");
    const block = /<datatype\b[^>]*>([\s\S]*?)<\/datatype>/i.exec(cleaned)?.[1];
    const isArray = Boolean(block && /<array\s*\/\s*>/i.test(block));
    const declared = block
        ? [...block.matchAll(/<type\b[^>]*>([\s\S]*?)<\/type>/gi)]
            .map(match => normalizeType(match[1]))
            .filter(Boolean)
        : [];
    const types = declared.length
        ? declared.map(type => isArray ? `Array of ${type}` : type)
        : describedTypes(body);
    const uniqueTypes = types.filter((value, index, values) => values.indexOf(value) === index);
    return {
        type: isArray ? "Array" : uniqueTypes.length === 1 ? uniqueTypes[0] : null,
        types: uniqueTypes
    };
}

const description = body => decode(/<shortdesc\b[^>]*>([\s\S]*?)<\/shortdesc>/i.exec(body)?.[1]
    ?.replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());

function parameters(body) {
    const block = /<parameters\b[^>]*>([\s\S]*?)<\/parameters>/i.exec(body)?.[1];
    if (!block) return [];
    return [...block.matchAll(/<parameter\b([^>]*)>([\s\S]*?)<\/parameter>/gi)].map(match => {
        const info = datatypeInfo(match[2]);
        return {
            name: attribute(match[1], "name") || "",
            type: info.type,
            types: info.types,
            optional: attribute(match[1], "optional") === "true"
        };
    });
}

function addMember(catalog, className, mode, kind, attributes, body) {
    const name = attribute(attributes, "name");
    const typeInfo = datatypeInfo(body);
    const type = catalog.types[className] ||= {static: [], prototype: []};
    if (!type[mode].includes(name)) type[mode].push(name);
    const symbol = `${className}${mode === "static" ? "." : ".prototype."}${name}`;
    if (typeInfo.type) {
        catalog.returns[symbol] = typeInfo.type;
    }
    catalog.members[symbol] = {
        owner: className,
        name,
        kind: kind.toLowerCase(),
        mode,
        returnType: typeInfo.type,
        returnTypes: typeInfo.types,
        access: kind.toLowerCase() === "property"
            ? attribute(attributes, "rwaccess") || "read/write"
            : null,
        description: description(body),
        parameters: kind.toLowerCase() === "method" ? parameters(body) : []
    };
}

function parse(source, metadata = {}) {
    const catalog = {
        version: 1,
        runtime: metadata.runtime || "Adobe OMV",
        metadata,
        globals: [],
        globalTypes: {},
        types: {},
        returns: {},
        classes: {},
        members: {}
    };

    for (const classMatch of source.matchAll(/<classdef\b([^>]*)>([\s\S]*?)<\/classdef>/gi)) {
        const className = attribute(classMatch[1], "name");
        if (!className) continue;
        catalog.types[className] ||= {static: [], prototype: []};
        catalog.classes[className] = {
            description: description(classMatch[2]),
            superclass: decode(/<superclass\b[^>]*>([\s\S]*?)<\/superclass>/i.exec(classMatch[2])?.[1]
                ?.replace(/<[^>]+>/g, "").trim()) || null,
            enumeration: attribute(classMatch[1], "enumeration") === "true"
        };

        for (const elementsMatch of classMatch[2].matchAll(/<elements\b([^>]*)>([\s\S]*?)<\/elements>/gi)) {
            const mode = attribute(elementsMatch[1], "type") === "class" ? "static" : "prototype";
            for (const memberMatch of elementsMatch[2].matchAll(/<(property|method)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
                const memberName = attribute(memberMatch[2], "name");
                if (memberName && memberName !== "[]") {
                    addMember(
                        catalog,
                        className,
                        mode,
                        memberMatch[1],
                        memberMatch[2],
                        memberMatch[3]
                    );
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
