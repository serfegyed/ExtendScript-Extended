"use strict";

var fs = require("fs");
var path = require("path");
var tokenizer = require("./tokenizer");

function slash(value) {
    return value.split(path.sep).join("/");
}

function walk(directory, result) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
        var absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== "Test" && entry.name !== ".git") walk(absolute, result);
        } else if (entry.isFile() && /\.jsx?(?:inc)?$/i.test(entry.name)) {
            result.push(absolute);
        }
    });
}

function includesFor(source, file, repositoryRoot) {
    var dependencies = [];
    var expression = /^\s*(?:\/\/@|#)include\s+["']([^"']+)["']/gm;
    var match;
    while ((match = expression.exec(source))) {
        dependencies.push(slash(path.relative(repositoryRoot, path.resolve(path.dirname(file), match[1]))));
    }
    return dependencies;
}

function publicSymbols(source, namespace) {
    var symbols = [];
    var seen = {};
    var tokens = tokenizer.tokenize(source);
    var index;
    for (index = 0; index < tokens.length; index++) {
        if (tokens[index].value !== namespace || !tokens[index + 1] || tokens[index + 1].value !== ".") continue;
        var symbol = null;
        if (tokens[index + 2] && tokens[index + 2].value === "prototype" &&
                tokens[index + 3] && tokens[index + 3].value === "." &&
                tokens[index + 4] && tokens[index + 4].type === "identifier" &&
                tokens[index + 5] && tokens[index + 5].value === "=") {
            symbol = namespace + ".prototype." + tokens[index + 4].value;
        } else if (tokens[index + 2] && tokens[index + 2].type === "identifier" &&
                tokens[index + 3] && tokens[index + 3].value === "=") {
            symbol = namespace + "." + tokens[index + 2].value;
        }
        if (symbol && !seen[symbol]) {
            seen[symbol] = true;
            symbols.push(symbol);
        }
    }
    return symbols;
}

function documentedReturnType(source) {
    var match = /@returns?\s*\{\s*([A-Za-z_$][\w$]*)\s*\}/.exec(source);
    return match ? match[1] : null;
}

function build(repositoryRoot) {
    var files = [];
    var providers = {};
    var fileIndex = {};
    var warnings = [];
    var candidatePattern = /(?:[\\\/](?:Array|String|Number|Object|Date|Math|Map|Set|TypeTest)[\\\/](?:Lib[\\\/][^\\\/]+|Math\.[^\\\/]+)\.js|[\\\/]JSON[\\\/]JSON\.(?:parse|stringify)\.js)$/;

    walk(repositoryRoot, files);
    files.filter(function (file) {
        return candidatePattern.test(file);
    }).forEach(function (file) {
        var source = fs.readFileSync(file, "utf8");
        var namespace = path.relative(repositoryRoot, file).split(path.sep)[0];
        var symbols = publicSymbols(source, namespace);
        var relative = slash(path.relative(repositoryRoot, file));
        fileIndex[relative] = {
            dependencies: includesFor(source, file, repositoryRoot)
        };
        if (symbols.length === 1) {
            providers[symbols[0]] = {
                path: relative,
                dependencies: includesFor(source, file, repositoryRoot),
                returnType: documentedReturnType(source)
            };
        } else if (symbols.length > 1) {
            warnings.push({ path: relative, reason: "multiple-public-symbols", symbols: symbols });
        }
    });

    providers.console = {
        path: "Tools/Console/console.js",
        dependencies: includesFor(
            fs.readFileSync(path.join(repositoryRoot, "Tools", "Console", "console.js"), "utf8"),
            path.join(repositoryRoot, "Tools", "Console", "console.js"),
            repositoryRoot
        )
    };
    fileIndex["Tools/Console/console.js"] = {
        dependencies: providers.console.dependencies
    };

    return {
        version: 1,
        providers: providers,
        files: fileIndex,
        warnings: warnings
    };
}

function write(repositoryRoot, outputFile) {
    var index = build(repositoryRoot);
    fs.writeFileSync(outputFile, JSON.stringify(index, null, 2) + "\n", "utf8");
    return index;
}

module.exports = {
    build: build,
    write: write
};
