// Test String.prototype.at

runTest(function () {
    assert(["h", "e", "l", "l", "o"].at(0) === "h", "at(0) should return 'h'");
    assert(["h", "e", "l", "l", "o"].at(-1) === "o", "at(-1) should return 'o'");
    assert(["h", "e", "l", "l", "o"].at(4.9) === "o", "at(4) should return 'o'");
    assert(["h", "e", "l", "l", "o"].at(-5) === "h", "at(-5) should return 'h'");
    assert(["h", "e", "l", "l", "o"].at(5) === undefined, "at(5) should return undefined (out of range)");
    assert(["h", "e", "l", "l", "o"].at(-6) === undefined, "at(-6) should return undefined (out of range)");
    assert(["h", "e", "l", "l", "o"].at(100) === undefined, "at(100) should return undefined (out of range)");
    assert(["h", "e", "l", "l", "o"].at(-100) === undefined, "at(-100) should return undefined (out of range)");
}, "Array.prototype.at");

// Function to run a test block and catch errors
function runTest(testFunc, testName) {
    try {
        testFunc();
        $.writeln(testName + " tests passed.");
    } catch (e) {
        $.writeln("Error in " + testName + " tests: " + e.message);
    }
}

// Simple assertion function for testing
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
};

$.writeln([].at(0)); // empty array = undefined
arr = [1, 2, 3, 4, 5, 6, 7, 8];

$.writeln(arr.at(-1)); // 8
$.writeln(arr.at(-11)); // Out Of Boundaries = undefined
$.writeln(arr.at(10)); // OOB too = undefined
$.writeln(arr.at(0)); // 1
$.writeln(arr.at(NaN)); // Treated as zero = 1
$.writeln(arr.at("1")); // Converted to number = 2
$.writeln(arr.at("-1")); // Converted to number = 8
$.writeln(arr.at(undefined)); // undefined, treated as zero = 1
$.writeln(arr.at()); // undefined, treated as zero = 1
$.writeln(arr.at(null)); // undefined, treated as zero = 1

const arrayLike = {
    length: 2,
    0: "a",
    1: "b",
};
$.writeln(Array.prototype.at.call(arrayLike, -1)); // "b"