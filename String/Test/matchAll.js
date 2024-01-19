// Test String.prototype.matchAll
runTest(function () {
    var str = "test1test2";
    var regex = /t(e)(st(\d?))/g;

    // Standard use case
    var iterator = str.matchAll(regex);
    var match = iterator.next();
    $.writeln(match.value);	// ["test1", "e", "st1", "1"]
    assert(match.value[0] === "test1" && !match.done, "First match should be 'test1'");
    match = iterator.next();
    $.writeln(match.value);	// ["test2", "e", "st2", "2"]
    assert(match.value[0] === "test2" && !match.done, "Second match should be 'test2'");
    match = iterator.next();
    $.writeln(match);		// {done: true, value: undefined}
    assert(match.done, "Iterator should be done after two matches");

    // Edge case: no matches
    iterator = "hello".matchAll(/test/g);
    assert(iterator.next().done, "Should find no matches");

    // Additional edge cases as needed...
}, "String.prototype.matchAll");

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