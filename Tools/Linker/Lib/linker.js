"use strict";

var fs = require("fs");
var path = require("path");
var tokenizer = require("./tokenizer");

function slash(value) {
    return value.split(path.sep).join("/");
}

function has(list, value) {
    return Array.isArray(list) && list.indexOf(value) !== -1;
}

function lineAndColumn(source, offset) {
    var before = source.slice(0, offset);
    var lines = before.split(/\r\n|\r|\n/);
    return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

function returnTypeFor(symbol, nativeCatalog, polyfillCatalog) {
    if (nativeCatalog.returns && nativeCatalog.returns[symbol]) {
        return nativeCatalog.returns[symbol];
    }
    if (polyfillCatalog.providers[symbol]) {
        return polyfillCatalog.providers[symbol].returnType || null;
    }
    return null;
}

function expressionType(tokens, index, scope, getVariableType, isDeclared, nativeCatalog, polyfillCatalog) {
    var token = tokens[index];
    var baseType = null;
    var mode = "prototype";
    if (!token) return null;
    if (token.value === "[") baseType = "Array";
    if (token.type === "string") baseType = "String";
    if (token.type === "number") baseType = "Number";
    if (token.value === "true" || token.value === "false") baseType = "Boolean";
    if (token.value === "new" && tokens[index + 1] && tokens[index + 1].type === "identifier" &&
            !isDeclared(scope, tokens[index + 1].value)) {
        return tokens[index + 1].value;
    }
    if (token.type === "identifier" && tokens[index + 1] && tokens[index + 1].value === "(" &&
            !isDeclared(scope, token.value)) {
        if (/^(Array|String|Number|Boolean|Date|RegExp|Object)$/.test(token.value)) return token.value;
    }
    if (token.type === "identifier" && isDeclared(scope, token.value)) {
        baseType = getVariableType(scope, token.value);
    }
    if (token.type === "identifier" && nativeCatalog.types[token.value] &&
            !isDeclared(scope, token.value)) {
        baseType = token.value;
        mode = "static";
    }
    if (token.type === "identifier" && /^(JSON|Temporal|Map|Set)$/.test(token.value) &&
            !isDeclared(scope, token.value)) {
        baseType = token.value;
        mode = "static";
    }
    if (baseType && tokens[index + 1] && tokens[index + 1].value === "." &&
            tokens[index + 2] && tokens[index + 2].type === "identifier" &&
            tokens[index + 3] && tokens[index + 3].value === "(") {
        return returnTypeFor(
            baseType + (mode === "prototype" ? ".prototype." : ".") + tokens[index + 2].value,
            nativeCatalog,
            polyfillCatalog
        );
    }
    return baseType;
}

function matchingPairs(tokens) {
    var pairs = {};
    var stack = [];
    var opening = {"(": ")", "[": "]", "{": "}"};
    var index;
    for (index = 0; index < tokens.length; index++) {
        if (opening[tokens[index].value]) {
            stack.push(index);
        } else if (/^[\])}]$/.test(tokens[index].value) && stack.length) {
            var start = stack[stack.length - 1];
            if (opening[tokens[start].value] === tokens[index].value) {
                stack.pop();
                pairs[index] = start;
                pairs[start] = index;
            }
        }
    }
    return pairs;
}

function buildScopes(tokens, pairs) {
    var globalScope = {
        start: -1,
        end: tokens.length,
        parent: null,
        declarations: {},
        types: {}
    };
    var scopes = [globalScope];
    var index;

    function scopeAt(tokenIndex) {
        var result = globalScope;
        var i;
        for (i = 1; i < scopes.length; i++) {
            if (tokenIndex > scopes[i].start && tokenIndex < scopes[i].end &&
                    scopes[i].end - scopes[i].start < result.end - result.start) {
                result = scopes[i];
            }
        }
        return result;
    }

    for (index = 0; index < tokens.length; index++) {
        if (tokens[index].value !== "function") continue;
        var nameIndex = tokens[index + 1] && tokens[index + 1].type === "identifier" ? index + 1 : -1;
        var parameterOpen = nameIndex === -1 ? index + 1 : index + 2;
        if (!tokens[parameterOpen] || tokens[parameterOpen].value !== "(" || pairs[parameterOpen] === undefined) continue;
        var parameterClose = pairs[parameterOpen];
        var bodyOpen = parameterClose + 1;
        if (!tokens[bodyOpen] || tokens[bodyOpen].value !== "{" || pairs[bodyOpen] === undefined) continue;

        var parent = scopeAt(index);
        var functionScope = {
            start: bodyOpen,
            end: pairs[bodyOpen],
            parent: parent,
            declarations: {},
            types: {}
        };
        scopes.push(functionScope);

        if (nameIndex !== -1) {
            parent.declarations[tokens[nameIndex].value] = true;
            functionScope.declarations[tokens[nameIndex].value] = true;
        }

        var parameterIndex;
        for (parameterIndex = parameterOpen + 1; parameterIndex < parameterClose; parameterIndex++) {
            if (tokens[parameterIndex].type === "identifier") {
                functionScope.declarations[tokens[parameterIndex].value] = true;
                functionScope.types[tokens[parameterIndex].value] = null;
            }
        }
    }

    for (index = 0; index < tokens.length; index++) {
        if (tokens[index].value !== "var" && tokens[index].value !== "const") continue;
        var declarationScope = scopeAt(index);
        var depth = 0;
        var expectName = true;
        var declarationIndex;
        for (declarationIndex = index + 1; declarationIndex < tokens.length; declarationIndex++) {
            var value = tokens[declarationIndex].value;
            if (depth === 0 && value === ";") break;
            if (depth === 0 && value === ",") {
                expectName = true;
                continue;
            }
            if (expectName && tokens[declarationIndex].type === "identifier") {
                declarationScope.declarations[value] = true;
                if (!declarationScope.types.hasOwnProperty(value)) declarationScope.types[value] = null;
                expectName = false;
            }
            if (value === "(" || value === "[" || value === "{") depth++;
            if (value === ")" || value === "]" || value === "}") depth--;
        }
    }

    return {
        globalScope: globalScope,
        scopeAt: scopeAt
    };
}

function existingIncludes(source, sourcePath, repositoryRoot) {
    var included = {};
    var expression = /^\s*(?:\/\/@|#)include\s+["']([^"']+)["']/gm;
    var match;
    while ((match = expression.exec(source))) {
        included[slash(path.relative(repositoryRoot, path.resolve(path.dirname(sourcePath), match[1])))] = true;
    }
    return included;
}

function relocateExistingIncludes(source, sourcePath, outputPath) {
    if (path.dirname(sourcePath) === path.dirname(outputPath)) return source;
    var expression = /^(\s*(?:\/\/@|#)include\s+["'])([^"']+)(["'].*)$/gm;
    return source.replace(expression, function (line, prefix, includePath, suffix) {
        if (path.isAbsolute(includePath) || /^[A-Za-z]:[\\\/]/.test(includePath)) return line;
        var target = path.resolve(path.dirname(sourcePath), includePath);
        var relative = slash(path.relative(path.dirname(outputPath), target));
        if (relative.charAt(0) !== ".") relative = "./" + relative;
        return prefix + relative + suffix;
    });
}

function firstCodeOffset(source) {
    var index = source.charCodeAt(0) === 0xFEFF ? 1 : 0;
    var length = source.length;

    while (index < length) {
        if (/\s/.test(source.charAt(index))) {
            index++;
        } else if (source.charAt(index) === "/" && source.charAt(index + 1) === "/") {
            index += 2;
            while (index < length && source.charAt(index) !== "\r" && source.charAt(index) !== "\n") index++;
        } else if (source.charAt(index) === "/" && source.charAt(index + 1) === "*") {
            index += 2;
            while (index < length && !(source.charAt(index) === "*" && source.charAt(index + 1) === "/")) index++;
            index = Math.min(index + 2, length);
        } else {
            break;
        }
    }

    return index;
}

function analyze(source, nativeCatalog, polyfillCatalog) {
    var tokens = tokenizer.tokenize(source);
    var pairs = matchingPairs(tokens);
    var scopeModel = buildScopes(tokens, pairs);
    var dependencies = [];
    var diagnostics = [];
    var report = [];
    var seenDiagnostic = {};
    var seenReport = {};
    var index;

    function declarationScope(scope, name) {
        while (scope) {
            if (scope.declarations[name]) return scope;
            scope = scope.parent;
        }
        return null;
    }

    function isDeclared(scope, name) {
        return declarationScope(scope, name) !== null;
    }

    function getVariableType(scope, name) {
        var owner = declarationScope(scope, name);
        return owner ? owner.types[name] || null : null;
    }

    function setVariableType(scope, name, type) {
        var owner = declarationScope(scope, name) || scopeModel.globalScope;
        owner.declarations[name] = true;
        owner.types[name] = type || null;
    }

    function receiverTypeAt(tokenIndex) {
        var receiver = tokens[tokenIndex];
        var receiverScope = scopeModel.scopeAt(tokenIndex);
        if (!receiver) return null;
        if (receiver.type === "string") return "String";
        if (receiver.type === "number") return "Number";
        if (receiver.type === "identifier" && isDeclared(receiverScope, receiver.value)) {
            return getVariableType(receiverScope, receiver.value);
        }
        if (receiver.value === "]" && pairs[tokenIndex] !== undefined) {
            var beforeArray = tokens[pairs[tokenIndex] - 1];
            if (!beforeArray || /^(=|\(|\[|\{|,|:|;|return)$/.test(beforeArray.value)) return "Array";
        }
        if (receiver.value === ")" && pairs[tokenIndex] !== undefined) {
            var openIndex = pairs[tokenIndex];
            var callee = tokens[openIndex - 1];
            if (!callee) return null;
            if (callee.type === "identifier" && tokens[openIndex - 2] && tokens[openIndex - 2].value === "new" &&
                    !isDeclared(scopeModel.scopeAt(openIndex - 1), callee.value)) {
                return callee.value;
            }
            if (callee.type === "identifier" && /^(Array|String|Number|Boolean|Date|RegExp|Object)$/.test(callee.value) &&
                    !isDeclared(scopeModel.scopeAt(openIndex - 1), callee.value)) {
                return callee.value;
            }
            if (callee.type === "identifier" && tokens[openIndex - 2] && tokens[openIndex - 2].value === ".") {
                var baseIndex = openIndex - 3;
                var base = tokens[baseIndex];
                var mode = "prototype";
                var baseType = receiverTypeAt(baseIndex);
                var baseScope = scopeModel.scopeAt(baseIndex);
                if (base && base.type === "identifier" && nativeCatalog.types[base.value] &&
                        !isDeclared(baseScope, base.value)) {
                    baseType = base.value;
                    mode = "static";
                } else if (base && base.type === "identifier" && /^(JSON|Temporal|Map|Set)$/.test(base.value) &&
                        !isDeclared(baseScope, base.value)) {
                    baseType = base.value;
                    mode = "static";
                }
                if (!baseType) return null;
                return returnTypeFor(
                    baseType + (mode === "prototype" ? ".prototype." : ".") + callee.value,
                    nativeCatalog,
                    polyfillCatalog
                );
            }
        }
        return null;
    }

    function diagnose(kind, symbol, token, message) {
        var key = kind + ":" + symbol + ":" + token.start;
        if (seenDiagnostic[key]) return;
        seenDiagnostic[key] = true;
        var location = lineAndColumn(source, token.start);
        diagnostics.push({
            kind: kind,
            symbol: symbol,
            line: location.line,
            column: location.column,
            message: message
        });
        record(kind === "missing" ? "unresolved" : "unknown", symbol, token);
    }

    function record(status, symbol, token, provider) {
        var key = status + ":" + symbol;
        if (seenReport[key]) return;
        seenReport[key] = true;
        var location = lineAndColumn(source, token.start);
        report.push({
            status: status,
            symbol: symbol,
            line: location.line,
            column: location.column,
            provider: provider || null
        });
    }

    for (index = 0; index < tokens.length; index++) {
        var token = tokens[index];
        var previous = tokens[index - 1];
        var next = tokens[index + 1];
        var afterNext = tokens[index + 2];
        var currentScope = scopeModel.scopeAt(index);

        if ((token.value === "var" || token.value === "const" ||
                (token.type === "identifier" && next && next.value === "=" &&
                (!previous || previous.value !== "."))) && next) {
            var isDeclaration = token.value === "var" || token.value === "const";
            var nameToken = isDeclaration ? next : token;
            var equalsIndex = isDeclaration ? index + 2 : index + 1;
            if (tokens[equalsIndex] && tokens[equalsIndex].value === "=") {
                var inferred = expressionType(
                    tokens,
                    equalsIndex + 1,
                    currentScope,
                    getVariableType,
                    isDeclared,
                    nativeCatalog,
                    polyfillCatalog
                );
                if (!inferred && tokens[equalsIndex + 1] &&
                        isDeclared(currentScope, tokens[equalsIndex + 1].value)) {
                    inferred = getVariableType(currentScope, tokens[equalsIndex + 1].value);
                }
                setVariableType(currentScope, nameToken.value, inferred);
            }
        }

        if (!next || next.value !== "." || !afterNext || afterNext.type !== "identifier") continue;
        if (previous && previous.value === ".") continue;
        if (tokens[index + 3] && tokens[index + 3].value === "=") continue;

        var member = afterNext.value;
        var receiverType = null;
        var mode = "prototype";
        var symbol;

        receiverType = receiverTypeAt(index);
        if (token.type === "identifier" && nativeCatalog.types[token.value] &&
                !isDeclared(currentScope, token.value)) {
            receiverType = token.value;
            mode = "static";
        }

        if (token.type === "identifier" && token.value === "console" &&
                !isDeclared(currentScope, "console")) {
            if (has(nativeCatalog.globals, "console")) {
                record("native", "console." + member, token);
                continue;
            }
            if (polyfillCatalog.providers.console) {
                dependencies.push({ symbol: "console", provider: polyfillCatalog.providers.console, offset: token.lineStart });
                record("polyfill", "console." + member, token, polyfillCatalog.providers.console.path);
            } else {
                diagnose("missing", "console", token, "console is not provided by ESTK or the polyfill catalog.");
            }
            continue;
        }

        if (!receiverType) {
            if (token.type === "identifier" && /^(JSON|Temporal|Map|Set)$/.test(token.value) &&
                    !isDeclared(currentScope, token.value)) {
                symbol = token.value + "." + member;
                if (polyfillCatalog.providers[symbol]) {
                    dependencies.push({ symbol: symbol, provider: polyfillCatalog.providers[symbol], offset: token.lineStart });
                    record("polyfill", symbol, token, polyfillCatalog.providers[symbol].path);
                } else {
                    diagnose("missing", symbol, token, symbol + " is not provided by ESTK or the polyfill catalog.");
                }
            } else if (token.type === "identifier" && tokens[index + 3] && tokens[index + 3].value === "(" &&
                    !isDeclared(currentScope, token.value)) {
                diagnose("unknown-receiver", token.value + "." + member, token,
                    "The receiver type of " + token.value + "." + member + " could not be inferred.");
            }
            continue;
        }

        if (member === "prototype") continue;
        symbol = receiverType + (mode === "prototype" ? ".prototype." : ".") + member;
        var nativeType = nativeCatalog.types[receiverType] || { "static": [], "prototype": [] };
        if (has(nativeType[mode], member)) {
            record("native", symbol, token);
            continue;
        }
        if (polyfillCatalog.providers[symbol]) {
            dependencies.push({ symbol: symbol, provider: polyfillCatalog.providers[symbol], offset: token.lineStart });
            record("polyfill", symbol, token, polyfillCatalog.providers[symbol].path);
        } else {
            diagnose("missing", symbol, token, symbol + " is not provided by ESTK or the polyfill catalog.");
        }
    }

    return { dependencies: dependencies, diagnostics: diagnostics, report: report };
}

function linkSource(source, options) {
    var nativeCatalog = options.nativeCatalog;
    var polyfillCatalog = options.polyfillCatalog;
    var repositoryRoot = path.resolve(options.repositoryRoot);
    var sourcePath = path.resolve(options.sourcePath);
    var outputPath = path.resolve(options.outputPath || options.sourcePath);
    var analysis = analyze(source, nativeCatalog, polyfillCatalog);
    var alreadyIncluded = existingIncludes(source, sourcePath, repositoryRoot);
    var scheduled = {};
    var scheduledFiles = [];

    function scheduleFile(file) {
        if (alreadyIncluded[file]) return;
        if (scheduled[file]) return;
        scheduled[file] = true;
        scheduledFiles.push(file);
    }

    analysis.dependencies.forEach(function (dependency) {
        scheduleFile(dependency.provider.path);
    });

    var output = relocateExistingIncludes(source, sourcePath, outputPath);
    var includeDirectives = [];
    if (scheduledFiles.length) {
        var offset = firstCodeOffset(output);
        var block = scheduledFiles.map(function (file) {
            var absolute = path.join(repositoryRoot, file.split("/").join(path.sep));
            var relative = slash(path.relative(path.dirname(outputPath), absolute));
            if (relative.charAt(0) !== ".") relative = "./" + relative;
            return "//@include \"" + relative + "\"";
        });
        includeDirectives = block.slice();
        block = block.join("\n") + "\n";
        if (offset > 0 && output.charAt(offset - 1) !== "\n" && output.charAt(offset - 1) !== "\r") {
            block = "\n" + block;
        }
        output = output.slice(0, offset) + block + output.slice(offset);
    }

    return {
        source: output,
        includes: scheduledFiles,
        includeDirectives: includeDirectives,
        diagnostics: analysis.diagnostics,
        report: analysis.report
    };
}

function loadDefaultCatalogs(linkerRoot) {
    return {
        nativeCatalog: JSON.parse(fs.readFileSync(path.join(linkerRoot, "Catalog", "estk-3.json"), "utf8")),
        polyfillCatalog: JSON.parse(fs.readFileSync(path.join(linkerRoot, "Catalog", "polyfills.json"), "utf8"))
    };
}

module.exports = {
    analyze: analyze,
    linkSource: linkSource,
    loadDefaultCatalogs: loadDefaultCatalogs
};
