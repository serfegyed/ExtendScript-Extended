/*
 * ESprocessor integration tests for ESTK and Node.js.
 */
//@include "../../Console/console.js"
//@include "../../../Array/Lib/indexOf.js"
//@include "../../../String/Lib/startsWith.js"
//@include "../../../String/Lib/repeat.js"
//@include "../Lib/ESprocessor.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;
var nodeFs;
var nodePath;
var nodeOs;

if (isNodeRuntime) {
    nodeFs = require("fs");
    nodePath = require("path");
    nodeOs = require("os");

    (function () {
        function NodeFile(filePath) {
            this.fsName = nodePath.resolve(String(filePath));
            this.relativeURI = this.fsName.replace(/\\/g, "/");
            this.displayName = nodePath.basename(this.fsName);
            this.parent = { fsName: nodePath.dirname(this.fsName) };
            this.exists = nodeFs.existsSync(this.fsName) &&
                nodeFs.statSync(this.fsName).isFile();
            this._lines = [];
            this._index = 0;
            this._output = "";
            this._mode = "";
        }

        NodeFile.prototype.open = function (mode) {
            var text;

            this._mode = mode;
            if (mode === "r") {
                if (!nodeFs.existsSync(this.fsName)) {
                    return false;
                }
                text = nodeFs.readFileSync(this.fsName, "utf8");
                this._lines = text.split(/\r\n|\n|\r/);
                if (this._lines.length > 1 && this._lines[this._lines.length - 1] === "") {
                    this._lines.pop();
                }
                this._index = 0;
                return true;
            }
            if (mode === "w") {
                this._output = "";
                return true;
            }
            return false;
        };

        NodeFile.prototype.readln = function () {
            return this._lines[this._index++];
        };

        NodeFile.prototype.writeln = function (text) {
            this._output += String(text === undefined ? "" : text) + "\n";
        };

        NodeFile.prototype.close = function () {
            if (this._mode === "w") {
                nodeFs.writeFileSync(this.fsName, this._output, "utf8");
                this.exists = true;
            }
            this._mode = "";
            return true;
        };

        Object.defineProperty(NodeFile.prototype, "eof", {
            get: function () {
                return this._index >= this._lines.length;
            }
        });

        global.File = NodeFile;

        function load(relativePath) {
            (0, eval)(nodeFs.readFileSync(nodePath.join(__dirname, relativePath), "utf8"));
        }

        load("../../../Array/Lib/indexOf.js");
        load("../../../String/Lib/startsWith.js");
        load("../../../String/Lib/repeat.js");
        load("../Lib/ESprocessor.js");
    }());
}

(function () {
    var passed = 0;
    var failed = 0;
    var rootPath = createTemporaryFolder();

    function createTemporaryFolder() {
        var name = "ESprocessor-tests-" + new Date().getTime();
        var folder;

        if (isNodeRuntime) {
            return nodeFs.mkdtempSync(nodePath.join(nodeOs.tmpdir(), name + "-"));
        }

        folder = new Folder(Folder.temp.fsName + "/" + name);
        if (!folder.create()) {
            throw new Error("Could not create temporary test folder: " + folder.fsName);
        }
        return folder.fsName;
    }

    function joinPath(parent, child) {
        return String(parent).replace(/[\\\/]$/, "") + "/" + child;
    }

    function ensureFolder(path) {
        var folder;

        if (isNodeRuntime) {
            nodeFs.mkdirSync(path, { recursive: true });
            return;
        }
        folder = new Folder(path);
        if (!folder.exists && !folder.create()) {
            throw new Error("Could not create folder: " + path);
        }
    }

    function writeFile(path, text) {
        var file;

        if (isNodeRuntime) {
            nodeFs.writeFileSync(path, text, "utf8");
            return;
        }
        file = new File(path);
        if (!file.open("w")) {
            throw new Error("Could not write fixture: " + path);
        }
        file.write(text);
        file.close();
    }

    function readFile(path) {
        var file;
        var text;

        if (isNodeRuntime) {
            return nodeFs.readFileSync(path, "utf8");
        }
        file = new File(path);
        if (!file.open("r")) {
            throw new Error("Could not read fixture: " + path);
        }
        text = file.read();
        file.close();
        return text;
    }

    function removeTree(path) {
        var folder;
        var entries;
        var i;

        if (isNodeRuntime) {
            nodeFs.rmSync(path, { recursive: true, force: true });
            return;
        }
        folder = new Folder(path);
        if (!folder.exists) {
            return;
        }
        entries = folder.getFiles();
        for (i = 0; i < entries.length; i++) {
            if (entries[i] instanceof Folder) {
                removeTree(entries[i].fsName);
            } else {
                entries[i].remove();
            }
        }
        folder.remove();
    }

    function assert(condition, message) {
        if (!condition) {
            throw new Error(message || "Assertion failed");
        }
    }

    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error((message ? message + ": " : "") +
                "expected " + expected + ", got " + actual);
        }
    }

    function count(text, needle) {
        var position = 0;
        var result = 0;

        while ((position = text.indexOf(needle, position)) !== -1) {
            result++;
            position += needle.length;
        }
        return result;
    }

    function test(name, callback) {
        try {
            callback();
            passed++;
            console.log("PASS: " + name);
        } catch (error) {
            failed++;
            console.error("FAIL: " + name + "\n  " + error);
        }
    }

    test("ESprocessor exposes the processing API", function () {
        assertEqual(typeof ESprocessor, "object", "ESprocessor");
        assertEqual(typeof ESprocessor.process, "function", "process");
        assertEqual(typeof ESprocessor.run, "function", "run");
    });

    test("ESprocessor expands nested includes and removes duplicates", function () {
        var folder = joinPath(rootPath, "nested");
        var sourcePath = joinPath(folder, "main.js");
        var output;

        ensureFolder(joinPath(folder, "parts"));
        writeFile(sourcePath,
            "var main = 1;\n" +
            "//@include \"./parts/a.js\"\n" +
            "#include \"./parts/a.js\"\n" +
            "var end = 1;");
        writeFile(joinPath(folder, "parts/a.js"),
            "var a = 1;\n//@include \"./b.js\"");
        writeFile(joinPath(folder, "parts/b.js"), "var b = 1;");

        ESprocessor.process(new File(sourcePath), { log: false, logFile: false });
        output = readFile(joinPath(folder, "main_full.js"));

        assertEqual(count(output, "var a = 1;"), 1, "duplicate include");
        assertEqual(count(output, "var b = 1;"), 1, "nested include");
        assert(output.indexOf("var main = 1;") < output.indexOf("var a = 1;"), "main order");
        assert(output.indexOf("var a = 1;") < output.indexOf("var end = 1;"), "include order");
    });

    test("ESprocessor supports include paths and both directive styles", function () {
        var folder = joinPath(rootPath, "paths");
        var library = joinPath(folder, "library");
        var sourcePath = joinPath(folder, "entry.jsx");
        var normalizedLibrary;
        var output;

        ensureFolder(library);
        normalizedLibrary = String(library).replace(/\\/g, "/");
        writeFile(joinPath(library, "shared.js"), "var shared = true;");
        writeFile(sourcePath,
            "  //@includepath \"" + normalizedLibrary + "\"\n" +
            "  #include \"shared.js\"\n" +
            "var entry = true;");

        ESprocessor.process(new File(sourcePath), { log: false, logFile: false });
        output = readFile(joinPath(folder, "entry_full.jsx"));

        assert(output.indexOf("var shared = true;") !== -1, "include path content");
        assert(output.indexOf("var entry = true;") !== -1, "source content");
    });

    test("ESprocessor resolves relative include paths from their source file", function () {
        var folder = joinPath(rootPath, "relative-paths");
        var sourcePath = joinPath(folder, "entry.js");
        var output;

        ensureFolder(joinPath(folder, "library"));
        writeFile(joinPath(folder, "library/shared.js"), "var relativeShared = true;");
        writeFile(sourcePath,
            "//@includepath \"./library\"\n" +
            "//@include \"shared.js\"");

        ESprocessor.process(new File(sourcePath), { log: false, logFile: false });
        output = readFile(joinPath(folder, "entry_full.js"));

        assert(output.indexOf("var relativeShared = true;") !== -1, "relative include path");
    });

    test("ESprocessor logs included, duplicate, and missing files", function () {
        var folder = joinPath(rootPath, "logging");
        var sourcePath = joinPath(folder, "main.js");
        var output;
        var log;

        ensureFolder(folder);
        writeFile(sourcePath,
            "//@include \"./part.js\"\n" +
            "//@include \"./part.js\"\n" +
            "//@include \"./missing.js\"");
        writeFile(joinPath(folder, "part.js"), "var part = true;");

        ESprocessor.process(new File(sourcePath), { log: true, logFile: true, indent: true });
        output = readFile(joinPath(folder, "main_full.js"));
        log = readFile(joinPath(folder, "main.log"));

        assert(output.indexOf("Include file start: ./part.js") !== -1, "start marker");
        assert(output.indexOf("already included") !== -1, "duplicate marker");
        assert(output.indexOf("doesn't exist") !== -1, "missing marker");
        assert(log.indexOf("\t//* Include file start: ./part.js") !== -1, "indented log");
    });

    test("ESprocessor handles absent input without creating output", function () {
        assertEqual(ESprocessor.process(null, { log: false }), null, "cancelled selection");
        assertEqual(
            ESprocessor.process(new File(joinPath(rootPath, "missing.jsx")), { log: false }),
            null,
            "missing source"
        );
    });

    removeTree(rootPath);

    console.log("");
    console.log("Passed: " + passed);
    console.log("Failed: " + failed);

    if (failed > 0 && isNodeRuntime) {
        process.exitCode = 1;
    }
}());
