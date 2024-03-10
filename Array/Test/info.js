// Testing properties

// Test Case 1: Basic uniform array
var testCase1 = [[1, 2], [3, 4]];
console.log(Array.info(testCase1)); // Expected: isUniform: true, maxDepth: 1, lengthsAtDepth: {'0': [2], '1': [2, 2]}, typeOfElements: 'number'

// Test Case 2: Basic non-uniform array
var testCase2 = [[1, 2], [3, 4, 5]];
console.log(Array.info(testCase2)); // Expected: isUniform: false, maxDepth: 1, lengthsAtDepth: {'0': [2], '1': [2, 3]}, typeOfElements: number

// Test Case 3: Nested uniform arrays
var testCase3 = [[1, [2, 3]], [4, [5, 6]]];
console.log(Array.info(testCase3)); // Expected: isUniform: true, maxDepth: 2, lengthsAtDepth: {'0': [2], '1': [2, 2], '2': [2, 2]}, typeOfElements: number

// Test Case 4: Nested non-uniform arrays
var testCase4 = [[1, [2, 3]], [4, [5, 6, 7]]];
console.log(Array.info(testCase4)); // Expected: isUniform: false, maxDepth: 2, lengthsAtDepth: {'0': [2], '1': [2, 2], '2': [2, 3]}, typeOfElements: number

// Test Case 5: Deeply nested uniform arrays
var testCase5 = [[[[1]]], [[[2]]]];
console.log(Array.info(testCase5)); // Expected: isUniform: true, maxDepth: 3, lengthsAtDepth: {'0': [1], '1': [1, 1], '2': [1, 1], '3': [1, 1]}, typeOfElements: number

// Test Case 6: Empty array
var testCase6 = [];
console.log(Array.info(testCase6)); // Expected: isUniform: true, maxDepth: 0, lengthsAtDepth: {'0': [0]}, typeOfElements: undefined

// Test Case 7: Arrays with different types of elements
var testCase7 = [[1, 2, 3], ['a', 'b', 'c']];
console.log(Array.info(testCase7)); // Expected: isUniform: true, maxDepth: 1, lengthsAtDepth: {'0': [2], '1': [3, 3]}, typeOfElements: mixed

// Test Case 8: Single element array
var testCase8 = [[1]];
console.log(Array.info(testCase8)); // Expected: isUniform: true, maxDepth: 1, lengthsAtDepth: {'0': [1], '1': [1]}, typeOfElements: number

// Test Case 9: Array with mixed depth (uniformity broken by depth)
var testCase9 = [[1, 2], [3, [4]]];
console.log(Array.info(testCase9)); // Expected: isUniform: false, maxDepth: 2, lengthsAtDepth: {'0': [2], '1': [2, 2], '2': [1]}, typeOfElements: number

// Test Case 10: Array containing only empty arrays
var testCase10 = [[], []];
console.log(Array.info(testCase10)); // Expected: isUniform: true, maxDepth: 1, lengthsAtDepth: {'0': [2], '1': [0, 0]}, typeOfElements: undefined

// Test Case 11: Arrays of boolean values
var testCase11 = [[true, false], [false, true, true]];
console.log(Array.info(testCase11)); // Expected: isUniform: false, maxDepth: 1, lengthsAtDepth: {'0': [2], '1': [2, 3]}, typeOfElements: boolean

// Test Case 12: Arrays with undefined, null, and empty arrays mixed
var testCase12 = [[undefined, null], [], [null]];
console.log(Array.info(testCase12)); // Expected: isUniform: false, maxDepth: 1, lengthsAtDepth: {'0': [3], '1': [2, 0, 1]}, typeOfElements: undefined

// Test Case 13: Arrays with only empty arrays
var testCase13 = [[[], []], [[]]];
console.log(Array.info(testCase13)); // Expected: isUniform: false, maxDepth: 2, lengthsAtDepth: {'0': [2], '1': [2, 1], '2': [2, 1]}, typeOfElements: undefined

// Test Case 14: Array of strings
var testCase14 = [["hello", "world"], ["foo", "bar"]];
console.log(Array.info(testCase14)); // Expected: isUniform: true, maxDepth: 1, lengthsAtDepth: {'0': [2], '1': [2, 2]}, typeOfElements: string

// Test Case 15: Array of objects
var testCase15 = [[{ a: 1 }, { b: 2 }], [{ c: 3 }]];
console.log(Array.info(testCase15)); // Expected: isUniform: false, maxDepth: 1, lengthsAtDepth: {'0': [2], '1': [2, 2]}, typeOfElements: object