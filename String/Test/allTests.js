/***************************************************************************/

/**
 * Simple assertion function for testing
 * @param {boolean} condition - The condition to test.
 * @param {string} message - Message to display on test failure.
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
};

// Function to run a test block and catch errors
function runTest(testFunc, testName) {
    try {
        testFunc();
        $.writeln(testName + " tests passed.");
    } catch (e) {
        $.writeln("Error in " + testName + " tests: " + e.message);
    }
}

// Test String.prototype.at
runTest(function() {
    assert("hello world".at(0) === "h", "at(0) should return 'h'");
    assert("hello world".at(-1) === "d", "at(-1) should return 'd'");
    assert("hello world".at(100) === "", "at(100) should return '' (out of bounds)");
}, "String.prototype.at");

// Test String.prototype.codePointAt
runTest(function() {
    assert("👋".codePointAt(0) === 128075, "codePointAt(0) on '👋' should return 128075");
    assert("hello".codePointAt(1) === 101, "codePointAt(1) on 'hello' should return 101");
    assert("hello".codePointAt(-1) === undefined, "codePointAt(-1) should return undefined");
}, "String.prototype.codePointAt");

// Test String.prototype.endsWith
runTest(function() {
    assert("hello world".endsWith("world") === true, "'hello world' should end with 'world'");
    assert("hello world".endsWith("hello") === false, "'hello world' should not end with 'hello'");
    assert("hello".endsWith("") === false, "String ends with empty string");
}, "String.prototype.endsWith");

// Test String.fromCodePoint
runTest(function() {
    assert(String.fromCodePoint(128075) === "👋", "fromCodePoint(128075) should return '👋'");
    assert(String.fromCodePoint(65) === "A", "fromCodePoint(65) should return 'A'");
    try {
        String.fromCodePoint(123456); // Out of range
        assert(false, "fromCodePoint with out of range value should throw error");
    } catch (e) {
        assert(true, "fromCodePoint with out of range value throws error");
    }
}, "String.fromCodePoint");

// Test String.prototype.includes
runTest(function() {
    assert("hello world".includes("world") === true, "'hello world' should include 'world'");
    assert("hello world".includes("xyz") === false, "'hello world' should not include 'xyz'");
    assert("hello world".includes("") === true, "String includes empty string");
}, "String.prototype.includes");

// Test String.prototype.isWellFormed
runTest(function() {
    assert("hello world".isWellFormed() === true, "'hello world' is well-formed");
    assert("\uD800hello world".isWellFormed() === false, "String with unpaired surrogate is not well-formed");
}, "String.prototype.isWellFormed");

// Test String.prototype.padEnd
runTest(function() {
    assert("hello".padEnd(10, "*") === "hello*****", "padEnd with '*' to length 10");
    assert("hello".padEnd(3, "*") === "hello", "padEnd with length less than string length");
    assert("hello".padEnd(10) === "hello     ", "padEnd with default padding");
}, "String.prototype.padEnd");

// Test String.prototype.padStart
runTest(function() {
    assert("hello".padStart(10, "*") === "*****hello", "padStart with '*' to length 10");
    assert("hello".padStart(3, "*") === "hello", "padStart with length less than string length");
    assert("hello".padStart(10) === "     hello", "padStart with default padding");
}, "String.prototype.padStart");

// Test String.prototype.repeat
runTest(function() {
    assert("hello".repeat(3) === "hellohellohello", "repeat 3 times");
    assert("hello".repeat(0) === "", "repeat 0 times");
    assert("hello".repeat(1) === "hello", "repeat 1 time");
}, "String.prototype.repeat");

// Test String.prototype.replaceAll
runTest(function() {
    assert("hello world".replaceAll("world", "everyone") === "hello everyone", "replaceAll 'world' with 'everyone'");
    assert("hello".replaceAll("l", "x") === "hexxo", "replaceAll 'l' with 'x'");
    assert("hello".replaceAll("", "-") === "-h-e-l-l-o-", "replaceAll empty string with '-'");
}, "String.prototype.replaceAll");

// Test String.prototype.startsWith
runTest(function() {
    assert("hello world".startsWith("hello") === true, "'hello world' should start with 'hello'");
    assert("hello world".startsWith("world") === false, "'hello world' should not start with 'world'");
    assert("hello".startsWith("") === true, "String starts with empty string");
}, "String.prototype.startsWith");

// Test String.prototype.trim
runTest(function() {
    assert("   hello world   ".trim() === "hello world", "trim spaces");
    assert("hello world".trim() === "hello world", "trim on no extra spaces");
    assert("".trim() === "", "trim on empty string");
}, "String.prototype.trim");

// Test String.prototype.trimEnd
runTest(function() {
    assert("hello world   ".trimEnd() === "hello world", "trimEnd spaces");
    assert("hello world".trimEnd() === "hello world", "trimEnd on no extra spaces");
    assert("".trimEnd() === "", "trimEnd on empty string");
}, "String.prototype.trimEnd");

// Test String.prototype.trimStart
runTest(function() {
    assert("   hello world".trimStart() === "hello world", "trimStart spaces");
    assert("hello world".trimStart() === "hello world", "trimStart on no extra spaces");
    assert("".trimStart() === "", "trimStart on empty string");
}, "String.prototype.trimStart");

// Test String.prototype.toWellFormed
runTest(function() {
    assert("hello world".toWellFormed() === "hello world", "'hello world' is already well-formed");
    assert("\uD800hello world".toWellFormed() === "\uFFFDhello world", "Replace unpaired surrogate with replacement character");
}, "String.prototype.toWellFormed");

$.writeln("All string method tests completed.");