// Test cases
const foo = { a: 1 };
const bar = { a: 1 };
const sameFoo = foo;

var testCases = [
    { x: 25, y: 25, expected: true },
    { x: 25, y: "25", expected: false },
    { x: "25", y: 25, expected: false },
    { x: NaN, y: 0 / 0, expected: true },
    { x: NaN, y: NaN, expected: true },
    { x: NaN, y: Number.NaN, expected: true },
    { x: "foo", y: "foo", expected: true },
    { x: "foo", y: "bar", expected: false },
    { x: foo, y: foo, expected: true },
    { x: foo, y: bar, expected: false },
    { x: foo, y: sameFoo, expected: true },
    { x: {}, y: {}, expected: false },
    { x: [], y: [], expected: false },
    { x: 0, y: 0, expected: true },
    { x: -0, y: 0, expected: false },
    { x: 0, y: -0, expected: false },
    { x: null, y: null, expected: true },
    { x: undefined, y: undefined, expected: true },
    { x: true, y: true, expected: true },
    { x: true, y: false, expected: false },
    { x: false, y: false, expected: true },
    { x: "true", y: true, expected: false }
];

// Run the tests
for (var i = 0; i < testCases.length; i++) {
    var testCase = testCases[i];
    var result = Object.is(testCase.x, testCase.y);

    // Check if the result matches the expected value
    if (result === testCase.expected) {
        $.writeln("Test case " + (i + 1) + " passed");
    } else {
        $.writeln("Test case " + (i + 1) + " failed");
    }
}
