// Example usage
// Test Case 1: Array of numbers
var testCase1 = [[1, 2], [3, 4]];
console.log("\nTest Case 1:\n" + Array.info(testCase1));
// Expected: {isUniform: true, maxDepth: 1, lengthsAtDepth: {0: [2], 1: [2, 2]}, typeOfElements: "number"}

// Test Case 2: Array of strings
var testCase2 = [["hello", "world"], ["foo", "bar"]];
console.log("\nTest Case 2:\n" + Array.info(testCase2));
// Expected:{isUniform: true, maxDepth: 1, lengthsAtDepth: {0: [2], 1: [2, 2]}, typeOfElements: "string"}

// Test Case 3: Array of objects
var testCase3 = [[{ a: 1 }, { b: 2 }], [{ c: 3 }]];
console.log("\nTest Case 3:\n" + Array.info(testCase3));
// Expected: {isUniform: false, maxDepth: 1, lengthsAtDepth: {0: [2], 1: [2, 1]}, typeOfElements: "object"}

// Test Case 4: Mixed types in a single depth
var testCase4 = [[1, "two", 3], [4, "five"]];
console.log("\nTest Case 4:\n" + Array.info(testCase4));
// Expected: {isUniform: false, maxDepth: 1, lengthsAtDepth: {0: [2], 1: [3, 2]}, typeOfElements: "mixed"}

// Test Case 5: Nested arrays with mixed types
var testCase5 = [[1, [2, "three"]], [4, ["five", 6]]];
console.log("\nTest Case 5:\n" + Array.info(testCase5));
// Expected: {isUniform: true, maxDepth: 2, lengthsAtDepth: {0: [2], 1: [2, 2], 2: [2, 2]}, typeOfElements: "mixed"}

// Test Case 6: Arrays with only undefined and null values
var testCase6 = [[undefined], [null], []];
console.log("\nTest Case 6:\n" + Array.info(testCase6));
// Expected: {isUniform: false, maxDepth: 1, lengthsAtDepth: {0: [3], 1: [1, 1, 0]}, typeOfElements: "undefined"}

// Test Case 7: Arrays with only empty arrays
var testCase7 = [[[], []], [[]]];
console.log("\nTest Case 7:\n" + Array.info(testCase7));
// Expected: {isUniform: false, maxDepth: 2, lengthsAtDepth: {0: [2], 1: [2, 1], 2: [0, 0, 0]}, typeOfElements: "undefined"}

// Test Case 8: Single empty array
var testCase8 = [[]];
console.log("\nTest Case 8:\n" + Array.info(testCase8));
// Expected: {isUniform: true, maxDepth: 1, lengthsAtDepth: {0: [1], 1: [0]}, typeOfElements: "undefined"}

// Test Case 9: Arrays with undefined, null, and empty arrays mixed
var testCase9 = [[undefined, null], [], [null]];
console.log("\nTest Case 9:\n" + Array.info(testCase9));
// Expected: {isUniform: false, maxDepth: 1, lengthsAtDepth: {0: [3], 1: [2, 0, 1]}, typeOfElements: "undefined"}

// Test Case 10: Arrays of boolean values
var testCase10 = [[true, false], [false, true, true]];
console.log("\nTest Case 10:\n" + Array.info(testCase10));
// Expected: {isUniform: false, maxDepth: 1, lengthsAtDepth: {0: [2], 1: [2, 3]}, typeOfElements: "boolean"}

// Test Case 11: Arrays of boolean values
var testCase11 = [[true, false], [false, true, true]];
console.log("\nTest Case 11:\n" + Array.info(testCase11));
// Expected: {isUniform: false, maxDepth: 1, lengthsAtDepth: {0: [2], 1: [2, 3]}, typeOfElements: "boolean"}

// Test Case 12: Arrays with undefined, null, and empty arrays mixed
var testCase12 = [[undefined, null], [], [null]];
console.log("\nTest Case 12:\n" + Array.info(testCase12));
// Expected: {isUniform: false, maxDepth: 1, lengthsAtDepth: {0: [3], 1: [2, 0, 1]}, typeOfElements: "undefined"}

// Test Case 13: Arrays with only empty arrays
var testCase13 = [[[], []], [[]]];
console.log("\nTest Case 13:\n" + Array.info(testCase13));
// Expected: {isUniform: false, maxDepth: 2, lengthsAtDepth: {0: [2], 1: [2, 1], 2: [0, 0, 0]}, typeOfElements: "undefined"}

// Test Case 14: Array of strings
var testCase14 = [["hello", "world"], ["foo", "bar"]];
console.log("\nTest Case 14:\n" + Array.info(testCase14));
// Expected: {isUniform: true, maxDepth: 1, lengthsAtDepth: {0: [2], 1: [2, 2]}, typeOfElements: "string"}

// Test Case 15: Array of objects
var testCase15 = [[{ a: 1 }, { b: 2 }], [{ c: 3 }]];
console.log("\nTest Case 15:\n" + Array.info(testCase15));
// Expected: {isUniform: false, maxDepth: 1, lengthsAtDepth: {0: [2], 1: [2, 1]}, typeOfElements: "object"}
