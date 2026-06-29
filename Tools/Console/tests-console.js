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

function createEnvironment(times) {
    var output = [];
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
        $: {
            writeln: function (message) {
                output.push(String(message));
            }
        }
    };

    vm.runInNewContext(source, sandbox, { filename: "console.js" });
    return { console: sandbox.console, output: output };
}

test("installs the complete fallback when console is absent", function () {
    var environment = createEnvironment([]);
    equal(typeof environment.console.log, "function");
    equal(typeof environment.console.assert, "function");
    equal(typeof environment.console.error, "function");
    equal(typeof environment.console.warn, "function");
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
