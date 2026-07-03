"use strict";

function normalizeType(rawType) {
    if (!rawType) return null;
    const candidates = rawType
        .replace(/[!?=]/g, "")
        .split("|")
        .map(type => type.trim())
        .filter(type => type && !/^(?:null|undefined|void|\*)$/i.test(type));
    const type = candidates[0];
    if (!type) return null;
    if (/\[\]$/.test(type) || /^Array(?:\s*\.|\s*<|$)/i.test(type)) return "Array";
    if (/^string$/i.test(type)) return "String";
    if (/^(?:number|integer|long|real|short)$/i.test(type)) return "Number";
    if (/^(?:boolean|bool)$/i.test(type)) return "Boolean";
    if (/^object$/i.test(type)) return "Object";
    return type.replace(/^\(|\)$/g, "");
}

function tagsFor(body) {
    const type = normalizeType(/@type\s*\{([^}]+)\}/i.exec(body)?.[1]);
    const returns = normalizeType(/@returns?\s*\{([^}]+)\}/i.exec(body)?.[1]);
    const params = new Map();
    const paramExpression = /@param\s*\{([^}]+)\}\s+([^\s*]+)/gi;

    for (const match of body.matchAll(paramExpression)) {
        const name = match[2]
            .replace(/^\.\.\./, "")
            .replace(/^\[|\]$/g, "")
            .split("=")[0]
            .split(".")[0];
        const paramType = normalizeType(match[1]);
        if (name && paramType) params.set(name, paramType);
    }
    return {type, returns, params};
}

function parse(source, tokens) {
    const variables = new Map();
    const functions = new Map();
    let tokenIndex = 0;

    for (const comment of source.matchAll(/\/\*\*([\s\S]*?)\*\//g)) {
        const commentEnd = comment.index + comment[0].length;
        while (tokenIndex < tokens.length && tokens[tokenIndex].start < commentEnd) tokenIndex++;
        const token = tokens[tokenIndex];
        if (!token) break;

        const tags = tagsFor(comment[1]);
        if (token.value === "function") {
            functions.set(token.start, tags);
        } else if ((token.value === "var" || token.value === "const") &&
                tokens[tokenIndex + 1]?.type === "identifier" && tags.type) {
            variables.set(tokens[tokenIndex + 1].start, tags.type);
        } else if (token.type === "identifier" && tags.type) {
            variables.set(token.start, tags.type);
        }
    }
    return {variables, functions};
}

module.exports = {normalizeType, parse};
