/*
 * INI integration tests for ESTK and Node.js.
 */
//@include "../../Tools/Console/console.js"
//@include "../INI.js"

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
            var parentFolder;

            if (!(this instanceof NodeFile)) {
                return new NodeFile(filePath);
            }

            this.fsName = nodePath.resolve(String(filePath));
            this.path = this.fsName.replace(/\\/g, "/");
            this.name = nodePath.basename(this.fsName);
            parentFolder = {
                fsName: nodePath.dirname(this.fsName),
                toString: function () {
                    return this.fsName;
                }
            };
            this.parent = parentFolder;
            this.exists = nodeFs.existsSync(this.fsName) &&
                nodeFs.statSync(this.fsName).isFile();
            this.encoding = "";
            this.mode = "";
            this.lines = [];
            this.lineIndex = 0;
            this.output = "";
        }

        NodeFile.prototype.open = function (mode) {
            this.mode = mode;
            if (mode === "r") {
                if (!nodeFs.existsSync(this.fsName)) {
                    return false;
                }
                this.lines = nodeFs.readFileSync(this.fsName, "utf8").split(/\r\n|\n|\r/);
                if (this.lines.length > 1 && this.lines[this.lines.length - 1] === "") {
                    this.lines.pop();
                }
                this.lineIndex = 0;
                return true;
            }
            if (mode === "w") {
                this.output = "";
                return true;
            }
            return false;
        };

        NodeFile.prototype.readln = function () {
            return this.lines[this.lineIndex++];
        };

        NodeFile.prototype.writeln = function (text) {
            this.output += String(text === undefined ? "" : text) + "\n";
        };

        NodeFile.prototype.close = function () {
            if (this.mode === "w") {
                nodeFs.writeFileSync(this.fsName, this.output, "utf8");
                this.exists = true;
            }
            this.mode = "";
            return true;
        };

        NodeFile.prototype.toString = function () {
            return this.path;
        };

        NodeFile.prototype.remove = function () {
            if (nodeFs.existsSync(this.fsName)) {
                nodeFs.unlinkSync(this.fsName);
                this.exists = false;
                return true;
            }
            return false;
        };

        Object.defineProperty(NodeFile.prototype, "eof", {
            get: function () {
                return this.lineIndex >= this.lines.length;
            }
        });

        global.File = NodeFile;
        global.Folder = {
            temp: {
                fsName: nodeOs.tmpdir()
            }
        };
        global.$ = {
            fileName: nodePath.join(nodeOs.tmpdir(), "MyScript.jsx")
        };

        (0, eval)(nodeFs.readFileSync(nodePath.join(__dirname, "..", "INI.js"), "utf8"));
    }());
}

(function () {
    var passed = 0;
    var failed = 0;
    var rootFolder = createTemporaryFolder();

    function createTemporaryFolder() {
        var folder;
        var name = "INI-tests-" + new Date().getTime();

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

    function writeFile(filePath, text) {
        var file;

        if (isNodeRuntime) {
            nodeFs.writeFileSync(filePath, text, "utf8");
            return;
        }
        file = new File(filePath);
        file.encoding = "UTF-8";
        if (!file.open("w")) {
            throw new Error("Could not write fixture: " + filePath);
        }
        file.write(text);
        file.close();
    }

    function readFile(filePath) {
        var file;
        var text;

        if (isNodeRuntime) {
            return nodeFs.readFileSync(filePath, "utf8");
        }
        file = new File(filePath);
        file.encoding = "UTF-8";
        if (!file.open("r")) {
            throw new Error("Could not read file: " + filePath);
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

    function output(message) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log(message);
        } else if (typeof $ !== "undefined" && typeof $.writeln === "function") {
            $.writeln(message);
        } else if (isNodeRuntime) {
            process.stdout.write(String(message) + "\n");
        }
    }

    function fail(message) {
        throw new Error(message);
    }

    function equal(actual, expected, message) {
        if (actual !== expected) {
            fail((message ? message + ": " : "") +
                "expected " + expected + ", got " + actual);
        }
    }

    function hasOwn(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    }

    function sectionEqual(actual, expected, sectionName) {
        var key;
        for (key in expected) {
            if (hasOwn(expected, key)) {
                if (!hasOwn(actual, key)) {
                    fail(sectionName + "." + key + " is missing");
                }
                equal(actual[key], expected[key], sectionName + "." + key);
            }
        }
        for (key in actual) {
            if (hasOwn(actual, key) && !hasOwn(expected, key)) {
                fail(sectionName + "." + key + " is unexpected");
            }
        }
    }

    function objectOfObjectsEqual(actual, expected) {
        var sectionName;
        for (sectionName in expected) {
            if (hasOwn(expected, sectionName)) {
                if (!hasOwn(actual, sectionName)) {
                    fail(sectionName + " section is missing");
                }
                sectionEqual(actual[sectionName], expected[sectionName], sectionName);
            }
        }
        for (sectionName in actual) {
            if (hasOwn(actual, sectionName) && !hasOwn(expected, sectionName)) {
                fail(sectionName + " section is unexpected");
            }
        }
    }

    function assertThrows(callback, expectedText) {
        var thrown = false;
        try {
            callback();
        } catch (error) {
            thrown = true;
            if (expectedText && String(error).indexOf(expectedText) === -1) {
                fail("Unexpected error: " + error);
            }
        }
        if (!thrown) {
            fail("Expected an exception");
        }
    }

    function test(name, callback) {
        try {
            callback();
            passed++;
            output("PASS: " + name);
        } catch (error) {
            failed++;
            output("FAIL: " + name + "\n  " + (error.message || String(error)));
        }
    }

    try {
        test("read keeps defaults when the file is missing", function () {
            var data = { INIT: { setup1: "Default" } };
            var result = INI.read(data, joinPath(rootFolder, "missing.ini"));
            equal(result, data, "read must return the same object");
            objectOfObjectsEqual(data, { INIT: { setup1: "Default" } });
        });

        test("read merges saved values into existing defaults", function () {
            var filePath = joinPath(rootFolder, "settings.ini");
            var data = {
                INIT: {
                    setup1: "Default",
                    setup2: "Second default"
                }
            };

            writeFile(filePath, [
                "[INIT]",
                "setup1=Saved",
                "",
                "[result]",
                "result1=First result",
                "result2=Second=result"
            ].join("\n"));

            equal(INI.read(data, filePath), data, "read must return the same object");
            objectOfObjectsEqual(data, {
                INIT: {
                    setup1: "Saved",
                    setup2: "Second default"
                },
                result: {
                    result1: "First result",
                    result2: "Second=result"
                }
            });
        });

        test("read into an empty object creates sections", function () {
            var filePath = joinPath(rootFolder, "empty-object.ini");
            var data = {};
            writeFile(filePath, "[INIT]\nsetup1=First setup\n");
            INI.read(data, filePath);
            objectOfObjectsEqual(data, { INIT: { setup1: "First setup" } });
        });

        test("read ignores empty lines and lines outside sections", function () {
            var filePath = joinPath(rootFolder, "loose-lines.ini");
            var data = {};
            writeFile(filePath, [
                "ignored",
                "[INIT]",
                "setup1=First setup",
                "",
                "also ignored"
            ].join("\n"));
            INI.read(data, filePath);
            objectOfObjectsEqual(data, { INIT: { setup1: "First setup" } });
        });

        test("write serializes object-of-objects", function () {
            var filePath = joinPath(rootFolder, "write.ini");
            var data = {
                INIT: {
                    setup1: "First setup",
                    setup2: "Second setup"
                },
                result: {
                    result1: "First result",
                    result2: "Second result"
                }
            };

            equal(INI.write(data, filePath), data, "write must return the same object");
            equal(readFile(filePath), [
                "[INIT]",
                "setup1=First setup",
                "setup2=Second setup",
                "",
                "[result]",
                "result1=First result",
                "result2=Second result",
                ""
            ].join("\n"));
        });

        test("write accepts an empty object", function () {
            var filePath = joinPath(rootFolder, "empty.ini");
            INI.write({}, filePath);
            equal(readFile(filePath), "");
        });

        test("write merges with an existing INI file", function () {
            var filePath = joinPath(rootFolder, "merge-write.ini");
            writeFile(filePath, [
                "[INIT]",
                "setup1=Old setup",
                "setup2=Keep setup",
                "",
                "[old]",
                "oldKey=Keep old"
            ].join("\n"));

            INI.write({
                INIT: {
                    setup1: "New setup"
                },
                result: {
                    result1: "First result"
                }
            }, filePath);

            equal(readFile(filePath), [
                "[INIT]",
                "setup1=New setup",
                "setup2=Keep setup",
                "",
                "[old]",
                "oldKey=Keep old",
                "",
                "[result]",
                "result1=First result",
                ""
            ].join("\n"));
        });

        test("read requires a data object", function () {
            assertThrows(function () {
                INI.read(null, joinPath(rootFolder, "bad.ini"));
            }, "data must be an object");
        });

        test("read requires a filename", function () {
            assertThrows(function () {
                INI.read({});
            }, "filename must be a non-empty string");
        });

        test("write rejects non-object sections", function () {
            assertThrows(function () {
                INI.write({ INIT: "bad" }, joinPath(rootFolder, "bad.ini"));
            }, "section must be an object");
        });

        test("write keeps value conversion simple", function () {
            var filePath = joinPath(rootFolder, "simple-values.ini");
            INI.write({ INIT: { count: 3, enabled: true } }, filePath);
            equal(readFile(filePath), "[INIT]\ncount=3\nenabled=true\n");
        });
    } finally {
        output("\nPassed: " + passed);
        output("Failed: " + failed);
        removeTree(rootFolder);
    }

    if (failed > 0) {
        throw new Error(failed + " INI test(s) failed");
    }
}());
