"use strict";

const fs = require("fs");
const path = require("path");
const tokenizer = require("./tokenizer");
const jsdocTypes = require("./jsdocTypes");

const slash = value => value.split(path.sep).join("/");
const has = (list, value) => Array.isArray(list) && list.includes(value);

function lineAndColumn(source, offset) {
    const lines = source.slice(0, offset).split(/\r\n|\r|\n/);
    return {line: lines.length, column: lines.at(-1).length + 1};
}

function returnTypeFor(symbol, nativeCatalog, polyfillCatalog) {
    return nativeCatalog.returns?.[symbol]
        || polyfillCatalog.providers[symbol]?.returnType
        || null;
}

function matchingPairs(tokens) {
    const pairs = {};
    const stack = [];
    const opening = {"(": ")", "[": "]", "{": "}"};

    for (let index = 0; index < tokens.length; index++) {
        if (opening[tokens[index].value]) {
            stack.push(index);
        } else if (/^[\])}]$/.test(tokens[index].value) && stack.length) {
            const start = stack.at(-1);
            if (opening[tokens[start].value] === tokens[index].value) {
                stack.pop();
                pairs[index] = start;
                pairs[start] = index;
            }
        }
    }
    return pairs;
}

function buildScopes(tokens, pairs, hints) {
    const globalScope = {
        start: -1,
        end: tokens.length,
        parent: null,
        declarations: {},
        types: {},
        explicitTypes: new Set(),
        functionReturns: {}
    };
    const scopes = [globalScope];

    function scopeAt(tokenIndex) {
        let result = globalScope;
        for (const scope of scopes.slice(1)) {
            if (tokenIndex > scope.start && tokenIndex < scope.end &&
                    scope.end - scope.start < result.end - result.start) {
                result = scope;
            }
        }
        return result;
    }

    for (let index = 0; index < tokens.length; index++) {
        if (tokens[index].value !== "function") continue;

        const nameIndex = tokens[index + 1]?.type === "identifier" ? index + 1 : -1;
        const parameterOpen = nameIndex === -1 ? index + 1 : index + 2;
        if (tokens[parameterOpen]?.value !== "(" || pairs[parameterOpen] === undefined) continue;

        const parameterClose = pairs[parameterOpen];
        const bodyOpen = parameterClose + 1;
        if (tokens[bodyOpen]?.value !== "{" || pairs[bodyOpen] === undefined) continue;

        const parent = scopeAt(index);
        const functionScope = {
            start: bodyOpen,
            end: pairs[bodyOpen],
            parent,
            declarations: {},
            types: {},
            explicitTypes: new Set(),
            functionReturns: {}
        };
        scopes.push(functionScope);

        const functionHint = hints.functions.get(tokens[index].start);

        if (nameIndex !== -1) {
            const name = tokens[nameIndex].value;
            parent.declarations[name] = true;
            functionScope.declarations[name] = true;
            if (functionHint?.returns) parent.functionReturns[name] = functionHint.returns;
        }
        for (let parameterIndex = parameterOpen + 1; parameterIndex < parameterClose; parameterIndex++) {
            if (tokens[parameterIndex].type === "identifier") {
                const name = tokens[parameterIndex].value;
                functionScope.declarations[name] = true;
                functionScope.types[name] = functionHint?.params.get(name) || null;
                if (functionHint?.params.has(name)) functionScope.explicitTypes.add(name);
            }
        }
    }

    for (let index = 0; index < tokens.length; index++) {
        if (!has(["var", "const"], tokens[index].value)) continue;

        const declarationScope = scopeAt(index);
        let depth = 0;
        let expectName = true;
        for (let declarationIndex = index + 1; declarationIndex < tokens.length; declarationIndex++) {
            const {value, type} = tokens[declarationIndex];
            if (depth === 0 && value === ";") break;
            if (depth === 0 && value === ",") {
                expectName = true;
                continue;
            }
            if (expectName && type === "identifier") {
                declarationScope.declarations[value] = true;
                const hintedType = hints.variables.get(tokens[declarationIndex].start);
                if (hintedType) {
                    declarationScope.types[value] = hintedType;
                    declarationScope.explicitTypes.add(value);
                } else if (!Object.hasOwn(declarationScope.types, value)) {
                    declarationScope.types[value] = null;
                }
                expectName = false;
            }
            if (has(["(", "[", "{"], value)) depth++;
            if (has([")", "]", "}"], value)) depth--;
        }
    }

    return {globalScope, scopeAt};
}

function existingIncludes(source, sourcePath, repositoryRoot) {
    const included = new Set();
    const expression = /^\s*(?:\/\/@|#)include\s+["']([^"']+)["']/gm;
    for (const match of source.matchAll(expression)) {
        included.add(slash(path.relative(
            repositoryRoot,
            path.resolve(path.dirname(sourcePath), match[1])
        )));
    }
    return included;
}

function relocateExistingIncludes(source, sourcePath, outputPath) {
    if (path.dirname(sourcePath) === path.dirname(outputPath)) return source;
    const expression = /^(\s*(?:\/\/@|#)include\s+["'])([^"']+)(["'].*)$/gm;
    return source.replace(expression, (line, prefix, includePath, suffix) => {
        if (path.isAbsolute(includePath) || /^[A-Za-z]:[\\/]/.test(includePath)) return line;
        const target = path.resolve(path.dirname(sourcePath), includePath);
        let relative = slash(path.relative(path.dirname(outputPath), target));
        if (!relative.startsWith(".")) relative = `./${relative}`;
        return `${prefix}${relative}${suffix}`;
    });
}

function firstCodeOffset(source, start) {
    let index = start || (source.charCodeAt(0) === 0xFEFF ? 1 : 0);
    while (index < source.length) {
        if (/\s/.test(source[index])) {
            index++;
        } else if (source.slice(index, index + 2) === "//") {
            index += 2;
            while (index < source.length && !/[\r\n]/.test(source[index])) index++;
        } else if (source.slice(index, index + 2) === "/*") {
            index += 2;
            while (index < source.length && source.slice(index, index + 2) !== "*/") index++;
            index = Math.min(index + 2, source.length);
        } else {
            break;
        }
    }
    return index;
}

function includeInsertionOffset(source) {
    let offset = firstCodeOffset(source);
    let directive;
    while ((directive = /^#(?:target|targetengine)\b[^\r\n]*(?:\r\n|\r|\n)?/i.exec(source.slice(offset)))) {
        offset = firstCodeOffset(source, offset + directive[0].length);
    }
    const jsdocStart = source.lastIndexOf("/**", offset);
    if (jsdocStart !== -1) {
        const jsdocEnd = source.indexOf("*/", jsdocStart);
        if (jsdocEnd !== -1 && /^\s*$/.test(source.slice(jsdocEnd + 2, offset))) return jsdocStart;
    }
    return offset;
}

function analyze(source, nativeCatalog, polyfillCatalog) {
    const tokens = tokenizer.tokenize(source);
    const pairs = matchingPairs(tokens);
    const hints = jsdocTypes.parse(source, tokens);
    const scopeModel = buildScopes(tokens, pairs, hints);
    const dependencies = [];
    const diagnostics = [];
    const report = [];
    const seenDiagnostic = new Set();
    const seenReport = new Set();

    function declarationScope(scope, name) {
        while (scope) {
            if (scope.declarations[name]) return scope;
            scope = scope.parent;
        }
        return null;
    }

    const isDeclared = (scope, name) => declarationScope(scope, name) !== null;
    const getVariableType = (scope, name) => declarationScope(scope, name)?.types[name] || null;

    function getFunctionReturnType(scope, name) {
        while (scope) {
            if (scope.functionReturns[name]) return scope.functionReturns[name];
            scope = scope.parent;
        }
        return null;
    }

    function setVariableType(scope, name, type) {
        const owner = declarationScope(scope, name) || scopeModel.globalScope;
        owner.declarations[name] = true;
        if (owner.explicitTypes.has(name)) return;
        owner.types[name] = type || null;
    }

    const previousMember = tokenIndex =>
        tokens[tokenIndex - 1]?.value === "." && Boolean(tokens[tokenIndex - 2]);

    function receiverInfoAt(tokenIndex) {
        const receiver = tokens[tokenIndex];
        const receiverScope = scopeModel.scopeAt(tokenIndex);
        if (!receiver) return null;
        if (receiver.type === "string") return {type: "String", mode: "prototype"};
        if (receiver.type === "number") return {type: "Number", mode: "prototype"};

        if (receiver.type === "identifier" && isDeclared(receiverScope, receiver.value)) {
            const type = getVariableType(receiverScope, receiver.value);
            return type ? {type, mode: "prototype"} : null;
        }
        if (receiver.type === "identifier" && previousMember(tokenIndex)) {
            const info = receiverInfoAt(tokenIndex - 2);
            if (!info) return null;
            const symbol = `${info.type}${info.mode === "static" ? "." : ".prototype."}${receiver.value}`;
            const type = returnTypeFor(symbol, nativeCatalog, polyfillCatalog);
            return type ? {type, mode: "prototype"} : null;
        }
        if (receiver.type === "identifier" && nativeCatalog.globalTypes?.[receiver.value]) {
            return {type: nativeCatalog.globalTypes[receiver.value], mode: "prototype"};
        }
        if (receiver.type === "identifier" && nativeCatalog.types[receiver.value]) {
            return {type: receiver.value, mode: "static"};
        }
        if (receiver.value === "]" && pairs[tokenIndex] !== undefined) {
            const beforeArray = tokens[pairs[tokenIndex] - 1];
            if (!beforeArray || /^(=|\(|\[|\{|,|:|;|return)$/.test(beforeArray.value)) {
                return {type: "Array", mode: "prototype"};
            }
        }
        if (receiver.value === ")" && pairs[tokenIndex] !== undefined) {
            const openIndex = pairs[tokenIndex];
            const callee = tokens[openIndex - 1];
            if (!callee) return null;
            const hintedReturn = callee.type === "identifier"
                ? getFunctionReturnType(scopeModel.scopeAt(openIndex - 1), callee.value)
                : null;
            if (hintedReturn) return {type: hintedReturn, mode: "prototype"};
            if (callee.type === "identifier" && tokens[openIndex - 2]?.value === "new" &&
                    !isDeclared(scopeModel.scopeAt(openIndex - 1), callee.value)) {
                return {type: callee.value, mode: "prototype"};
            }
            if (callee.type === "identifier" && /^(Array|String|Number|Boolean|Date|RegExp|Object)$/.test(callee.value) &&
                    !isDeclared(scopeModel.scopeAt(openIndex - 1), callee.value)) {
                return {type: callee.value, mode: "prototype"};
            }
            if (callee.type === "identifier") return receiverInfoAt(openIndex - 1);
        }
        return null;
    }

    function expressionResultType(startIndex) {
        let position = startIndex;
        if (tokens[position]?.value === "new") position++;
        let info = receiverInfoAt(position);

        if (tokens[position]?.value === "[") {
            info = {type: "Array", mode: "prototype"};
            if (pairs[position] !== undefined) position = pairs[position];
        } else if (tokens[position + 1]?.value === "(" && pairs[position + 1] !== undefined) {
            const close = pairs[position + 1];
            if (tokens[startIndex]?.value === "new") {
                info = {type: tokens[position].value, mode: "prototype"};
            } else {
                info = receiverInfoAt(close);
            }
            position = close;
        }
        while (tokens[position + 1]?.value === "." && tokens[position + 2]) {
            position += 2;
            info = receiverInfoAt(position);
            if (tokens[position + 1]?.value === "(" && pairs[position + 1] !== undefined) {
                position = pairs[position + 1];
            }
            if (!info) break;
        }
        return info?.type || null;
    }

    function record(status, symbol, token, provider = null) {
        const key = `${status}:${symbol}`;
        if (seenReport.has(key)) return;
        seenReport.add(key);
        const {line, column} = lineAndColumn(source, token.start);
        report.push({status, symbol, line, column, provider});
    }

    function diagnose(kind, symbol, token, message) {
        const key = `${kind}:${symbol}:${token.start}`;
        if (seenDiagnostic.has(key)) return;
        seenDiagnostic.add(key);
        const {line, column} = lineAndColumn(source, token.start);
        diagnostics.push({kind, symbol, line, column, message});
        record(kind === "missing" ? "unresolved" : "unknown", symbol, token);
    }

    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];
        const previous = tokens[index - 1];
        const next = tokens[index + 1];
        const afterNext = tokens[index + 2];
        const currentScope = scopeModel.scopeAt(index);

        if ((has(["var", "const"], token.value) ||
                (token.type === "identifier" && next?.value === "=" && previous?.value !== ".")) && next) {
            const isDeclaration = has(["var", "const"], token.value);
            const nameToken = isDeclaration ? next : token;
            const equalsIndex = isDeclaration ? index + 2 : index + 1;
            if (tokens[equalsIndex]?.value === "=") {
                let inferred = expressionResultType(equalsIndex + 1);
                if (!inferred && tokens[equalsIndex + 1] &&
                        isDeclared(currentScope, tokens[equalsIndex + 1].value)) {
                    inferred = getVariableType(currentScope, tokens[equalsIndex + 1].value);
                }
                setVariableType(currentScope, nameToken.value, inferred);
            }
        }

        if (next?.value !== "." || afterNext?.type !== "identifier") continue;
        if (tokens[index + 3]?.value === "=") continue;

        const member = afterNext.value;
        const receiverInfo = receiverInfoAt(index);
        const receiverType = receiverInfo?.type || null;
        const mode = receiverInfo?.mode || "prototype";

        if (token.type === "identifier" && token.value === "console" &&
                !isDeclared(currentScope, "console")) {
            if (has(nativeCatalog.globals, "console")) {
                record("native", `console.${member}`, token);
            } else if (polyfillCatalog.providers.console) {
                const provider = polyfillCatalog.providers.console;
                dependencies.push({symbol: "console", provider, offset: token.lineStart});
                record("polyfill", `console.${member}`, token, provider.path);
            } else {
                diagnose("missing", "console", token, "console is not provided by ESTK or the polyfill catalog.");
            }
            continue;
        }

        let symbol;
        if (!receiverType) {
            if (token.type === "identifier" && /^(JSON|Temporal|Map|Set)$/.test(token.value) &&
                    !isDeclared(currentScope, token.value)) {
                symbol = `${token.value}.${member}`;
                const provider = polyfillCatalog.providers[symbol];
                if (provider) {
                    dependencies.push({symbol, provider, offset: token.lineStart});
                    record("polyfill", symbol, token, provider.path);
                } else {
                    diagnose("missing", symbol, token, `${symbol} is not provided by ESTK or the polyfill catalog.`);
                }
            } else if (token.type === "identifier" && tokens[index + 3]?.value === "(" &&
                    !isDeclared(currentScope, token.value)) {
                symbol = `${token.value}.${member}`;
                diagnose("unknown-receiver", symbol, token, `The receiver type of ${symbol} could not be inferred.`);
            }
            continue;
        }

        if (member === "prototype") continue;
        symbol = `${receiverType}${mode === "prototype" ? ".prototype." : "."}${member}`;
        const nativeType = nativeCatalog.types[receiverType] || {static: [], prototype: []};
        if (has(nativeType[mode], member)) {
            record("native", symbol, token);
        } else if (polyfillCatalog.providers[symbol]) {
            const provider = polyfillCatalog.providers[symbol];
            dependencies.push({symbol, provider, offset: token.lineStart});
            record("polyfill", symbol, token, provider.path);
        } else {
            diagnose("missing", symbol, token, `${symbol} is not provided by ESTK or the polyfill catalog.`);
        }
    }

    return {dependencies, diagnostics, report};
}

function linkSource(source, options) {
    const {nativeCatalog, polyfillCatalog} = options;
    const repositoryRoot = path.resolve(options.repositoryRoot);
    const sourcePath = path.resolve(options.sourcePath);
    const outputPath = path.resolve(options.outputPath || options.sourcePath);
    const analysis = analyze(source, nativeCatalog, polyfillCatalog);
    const alreadyIncluded = existingIncludes(source, sourcePath, repositoryRoot);
    const scheduled = new Set();
    const scheduledFiles = [];

    const scheduleFile = file => {
        if (!alreadyIncluded.has(file) && !scheduled.has(file)) {
            scheduled.add(file);
            scheduledFiles.push(file);
        }
    };
    for (const {provider} of analysis.dependencies) scheduleFile(provider.path);

    let output = relocateExistingIncludes(source, sourcePath, outputPath);
    let includeDirectives = [];
    if (scheduledFiles.length) {
        const offset = includeInsertionOffset(output);
        includeDirectives = scheduledFiles.map(file => {
            const absolute = path.join(repositoryRoot, file.split("/").join(path.sep));
            let relative = slash(path.relative(path.dirname(outputPath), absolute));
            if (!relative.startsWith(".")) relative = `./${relative}`;
            return `//@include "${relative}"`;
        });
        let block = `${includeDirectives.join("\n")}\n`;
        if (offset > 0 && !/[\r\n]/.test(output[offset - 1])) block = `\n${block}`;
        output = `${output.slice(0, offset)}${block}${output.slice(offset)}`;
    }

    return {
        source: output,
        includes: scheduledFiles,
        includeDirectives,
        diagnostics: analysis.diagnostics,
        report: analysis.report
    };
}

function loadDefaultCatalogs(linkerRoot) {
    const read = name => JSON.parse(fs.readFileSync(path.join(linkerRoot, "Catalog", name), "utf8"));
    return {
        nativeCatalog: read("estk-3.json"),
        polyfillCatalog: read("polyfills.json")
    };
}

module.exports = {analyze, linkSource, loadDefaultCatalogs};
