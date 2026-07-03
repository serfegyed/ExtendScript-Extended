"use strict";

const fs = require("fs");
const path = require("path");
const tokenizer = require("./tokenizer");

const slash = value => value.split(path.sep).join("/");

function walk(directory, result) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== "Test" && entry.name !== ".git") walk(absolute, result);
        } else if (entry.isFile() && /\.jsx?(?:inc)?$/i.test(entry.name)) {
            result.push(absolute);
        }
    }
}

function includesFor(source, file, repositoryRoot) {
    const expression = /^\s*(?:\/\/@|#)include\s+["']([^"']+)["']/gm;
    return [...source.matchAll(expression)].map(match =>
        slash(path.relative(repositoryRoot, path.resolve(path.dirname(file), match[1])))
    );
}

function publicSymbols(source, namespace) {
    const symbols = new Set();
    const tokens = tokenizer.tokenize(source);

    for (let index = 0; index < tokens.length; index++) {
        if (tokens[index].value !== namespace || tokens[index + 1]?.value !== ".") continue;

        let symbol = null;
        if (tokens[index + 2]?.value === "prototype" &&
                tokens[index + 3]?.value === "." &&
                tokens[index + 4]?.type === "identifier" &&
                tokens[index + 5]?.value === "=") {
            symbol = `${namespace}.prototype.${tokens[index + 4].value}`;
        } else if (tokens[index + 2]?.type === "identifier" && tokens[index + 3]?.value === "=") {
            symbol = `${namespace}.${tokens[index + 2].value}`;
        }
        if (symbol) symbols.add(symbol);
    }
    return [...symbols];
}

function documentedReturnType(source) {
    return /@returns?\s*\{\s*([A-Za-z_$][\w$]*)\s*\}/.exec(source)?.[1] || null;
}

function build(repositoryRoot) {
    const files = [];
    const providers = {};
    const fileIndex = {};
    const warnings = [];
    const candidatePattern = /(?:[\\/](?:Array|String|Number|Object|Date|Math|Map|Set|TypeTest)[\\/](?:Lib[\\/][^\\/]+|Math\.[^\\/]+)\.js|[\\/]JSON[\\/]JSON\.(?:parse|stringify)\.js)$/;

    walk(repositoryRoot, files);
    for (const file of files.filter(candidate => candidatePattern.test(candidate))) {
        const source = fs.readFileSync(file, "utf8");
        const namespace = path.relative(repositoryRoot, file).split(path.sep)[0];
        const symbols = publicSymbols(source, namespace);
        const relative = slash(path.relative(repositoryRoot, file));
        const dependencies = includesFor(source, file, repositoryRoot);

        fileIndex[relative] = {dependencies};
        if (symbols.length === 1) {
            providers[symbols[0]] = {
                path: relative,
                dependencies,
                returnType: documentedReturnType(source)
            };
        } else if (symbols.length > 1) {
            warnings.push({path: relative, reason: "multiple-public-symbols", symbols});
        }
    }

    const consolePath = path.join(repositoryRoot, "Tools", "Console", "console.js");
    const consoleDependencies = includesFor(fs.readFileSync(consolePath, "utf8"), consolePath, repositoryRoot);
    providers.console = {path: "Tools/Console/console.js", dependencies: consoleDependencies};
    fileIndex[providers.console.path] = {dependencies: consoleDependencies};

    return {version: 1, providers, files: fileIndex, warnings};
}

function write(repositoryRoot, outputFile) {
    const index = build(repositoryRoot);
    fs.writeFileSync(outputFile, `${JSON.stringify(index, null, 2)}\n`, "utf8");
    return index;
}

module.exports = {build, write};
