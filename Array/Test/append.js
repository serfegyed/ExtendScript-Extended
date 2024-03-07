// Test 1: Appending a simple array without flattening
console.log("Test 1:", [1, 2].append([3, 4])) // Expected output: [1, 2, 3, 4]

// Test 2: Appending an array with specified depth for flattening
console.log("Test 2:", [1, 2].append([3, [4, 5]], 1)) // Expected output: [ 1, 2, 3, 4, 5 ]

// Test 3: Attempting to append a non-array value
try {
    console.log("Test 3:", [1, 2].append("no-array")) // This should throw a TypeError
} catch (error) {
    console.log("Test 3:", error.message)
}

// Test 4: Appending an array with nested arrays to a specified depth
console.log("Test 4:", [1, 2].append([3, [4, [5, [6]]]], 2)) // Expected output: [ 1, 2, 3, 4, 5, [ 6 ] ]

// Test 5: Appending an array without a depth parameter means no flattening
console.log("Test 5:", [1, 2].append([3, [4, 5]])) // Expected output: [ 1, 2, 3, [4, 5] ]

// Test 6: Appending an array with a depth parameter of 0, ensuring no flattening
console.log("Test 6:", [1, 2].append([3, [4, [5]]], 0)) // Expected output: [ 1, 2, 3, [ 4, [ 5 ] ] ]

// Test 7: Appending a simple array without flattening
console.log("Test 7:", [1, 2].append([])) // Expected output: [1, 2]

// Test 8: Attempting to call append without parameters
try {
    console.log("Test 8:", [1, 2].append()) // Expected output: 'Append: undefined is not an array'
} catch (error) {
    console.log("Test 8:", error.message)
}