/* Node.js regression tests for console.js. */
var fs = require("fs");
var path = require("path");
var vm = require("vm");

var source = fs.readFileSync(path.join(__dirname, "console.js"), "utf8");
var passed = 0;
var failed = 0;

function test(name, callback) {
    try {
        callback();
        passed++;
        process.stdout.write("PASS: " + name + "\n");
    } catch (error) {
        failed++;
        process.stdout.write("FAIL: " + name + "\n  " + error.message + "\n");
    }
}

function equal(actual, expected) {
    if (actual !== expected) {
        throw new Error("Expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual));
    }
}

function createEnvironment(times, appName) {
    var output = [];
    var fileOutput = [];
    var fileOpenModes = [];
    var filePath = "";
    var folderCreated = false;
    var timeIndex = 0;

    function FakeDate() {}
    FakeDate.prototype.getTime = function () {
        if (timeIndex >= times.length) {
            throw new Error("No fake time value remains");
        }
        return times[timeIndex++];
    };

    var sandbox = {
        console: undefined,
        Date: FakeDate,
        BridgeTalk: { appName: appName || "estoolkit" },
        Folder: function (path) {
            return {
                fullName: path,
                exists: false,
                create: function () {
                    folderCreated = true;
                    return true;
                }
            };
        },
        File: function (path) {
            filePath = path;
            return {
                open: function (mode) {
                    fileOpenModes.push(mode);
                    if (mode === "w") {
                        fileOutput.length = 0;
                    }
                    return true;
                },
                writeln: function (message) { fileOutput.push(String(message)); },
                close: function () {}
            };
        },
        $: {
            getenv: function (name) {
                return name === "USERPROFILE" ? "C:\\Users\\tester" : "";
            },
            writeln: function (message) {
                output.push(String(message));
            }
        }
    };

    vm.runInNewContext(source, sandbox, { filename: "console.js" });
    return {
        console: sandbox.console,
        output: output,
        fileOutput: fileOutput,
        fileOpenModes: fileOpenModes,
        filePath: filePath,
        folderCreated: folderCreated
    };
}

test("installs the complete fallback when console is absent", function () {
    var environment = createEnvironment([]);
    equal(typeof environment.console.log, "function");
    equal(typeof environment.console.assert, "function");
    equal(typeof environment.console.error, "function");
    equal(typeof environment.console.warn, "function");
    equal(typeof environment.console.table, "function");
    equal(typeof environment.console.time, "function");
    equal(typeof environment.console.timeLog, "function");
    equal(typeof environment.console.timeEnd, "function");
});

test("leaves an existing console untouched", function () {
    var existingConsole = { marker: true };
    var sandbox = { console: existingConsole };
    vm.runInNewContext(source, sandbox, { filename: "console.js" });
    equal(sandbox.console, existingConsole);
});

test("formats log, error, warn, and assert output", function () {
    var environment = createEnvironment([]);
    environment.console.log("value", 42, false);
    environment.console.error("bad", 7);
    environment.console.error();
    environment.console.warn("careful", 8);
    environment.console.warn();
    environment.console.assert(true, "not written");
    environment.console.assert(false);
    environment.console.assert(false, "expected", 3);
    equal(environment.output.join("\n"), [
        "value 42 false",
        "Error: bad 7",
        "Error:",
        "Warning: careful 8",
        "Warning:",
        "Assertion failed",
        "Assertion failed: expected 3"
    ].join("\n"));
});

test("writes automatically to a file when hosted by an Adobe application", function () {
    var environment = createEnvironment([], "Illustrator");
    environment.console.log("working", 1);
    environment.console.warn("checkpoint");
    equal(environment.output.join("\n"), "");
    equal(environment.fileOpenModes.join(","), "w,a,a");
    equal(environment.filePath, "C:/Users/tester/.ESTK_scripts/console.log");
    equal(environment.folderCreated, true);
    equal(environment.fileOutput.join("\n"), [
        "illustrator",
        "----------------",
        "working 1",
        "Warning: checkpoint"
    ].join("\n"));
});

test("keeps falsy timer labels distinct", function () {
    var environment = createEnvironment([100, 200, 300, 400, 450, 460, 470, 480]);
    environment.console.time("");
    environment.console.time(0);
    environment.console.time(false);
    environment.console.time(null);
    environment.console.timeEnd("");
    environment.console.timeEnd(0);
    environment.console.timeEnd(false);
    environment.console.timeEnd(null);
    equal(environment.output.join("\n"), [
        ": 350ms",
        "0: 260ms",
        "false: 170ms",
        "null: 80ms"
    ].join("\n"));
});

test("uses default for omitted and undefined labels", function () {
    var environment = createEnvironment([100, 125]);
    environment.console.time();
    environment.console.time(undefined);
    environment.console.timeEnd();
    equal(environment.output.join("\n"), [
        'Warning: Timer "default" already exists',
        "default: 25ms"
    ].join("\n"));
});

test("reports duplicate and missing timers", function () {
    var environment = createEnvironment([100, 130]);
    environment.console.time("work");
    environment.console.time("work");
    environment.console.timeEnd("work");
    environment.console.timeEnd("work");
    equal(environment.output.join("\n"), [
        'Warning: Timer "work" already exists',
        "work: 30ms",
        'Warning: No such timer: "work"'
    ].join("\n"));
});

test("timeLog reports elapsed time without ending the timer", function () {
    var environment = createEnvironment([100, 125, 150]);
    environment.console.time("work");
    environment.console.timeLog("work", "checkpoint", 1);
    environment.console.timeEnd("work");
    equal(environment.output.join("\n"), [
        "work: 25ms checkpoint 1",
        "work: 50ms"
    ].join("\n"));
});

test("timeLog warns when the timer does not exist", function () {
    var environment = createEnvironment([]);
    environment.console.timeLog("missing", "checkpoint");
    equal(environment.output.join("\n"), 'Warning: No such timer: "missing"');
});

test("table formats object rows with an ASCII border", function () {
    var environment = createEnvironment([]);
    environment.console.table([
        { name: "A", age: 1 },
        { name: "BB", age: 22 }
    ]);
    equal(environment.output.join("\n"), [
        "+---------+------+-----+",
        "| (index) | name | age |",
        "+---------+------+-----+",
        "| 0       | A    | 1   |",
        "| 1       | BB   | 22  |",
        "+---------+------+-----+"
    ].join("\n"));
});

test("table supports selected columns and primitive rows", function () {
    var environment = createEnvironment([]);
    environment.console.table([
        { name: "A", age: 1 },
        { name: "B", age: 2 }
    ], ["age"]);
    environment.console.table(["A", null, undefined]);
    equal(environment.output.join("\n"), [
        "+---------+-----+",
        "| (index) | age |",
        "+---------+-----+",
        "| 0       | 1   |",
        "| 1       | 2   |",
        "+---------+-----+",
        "+---------+-----------+",
        "| (index) | value     |",
        "+---------+-----------+",
        "| 0       | A         |",
        "| 1       | null      |",
        "| 2       | undefined |",
        "+---------+-----------+"
    ].join("\n"));
});

test("table falls back to log for scalar values", function () {
    var environment = createEnvironment([]);
    environment.console.table("not tabular");
    equal(environment.output.join("\n"), "not tabular");
});

test("accepts hasOwnProperty as a timer label", function () {
    var environment = createEnvironment([500, 525]);
    environment.console.time("hasOwnProperty");
    environment.console.timeEnd("hasOwnProperty");
    equal(environment.output.join("\n"), "hasOwnProperty: 25ms");
});

process.stdout.write("\nPassed: " + passed + "\nFailed: " + failed + "\n");
if (failed > 0) {
    process.exitCode = 1;
}
