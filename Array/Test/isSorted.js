// Test Empty Array
console.assert(Array.isSorted([]) === true, 'Empty array should be sorted');

// Test Single Element Array
console.assert(Array.isSorted([1]) === true, 'Single element array should be sorted');

// Test Sorted Arrays
console.assert(Array.isSorted([1, 2, 3, 4, 5]) === true, 'Array sorted in ascending order');
console.assert(Array.isSorted([5, 4, 3, 2, 1], function (a, b) { return b - a; }) === true, 'Array sorted in descending order');

// Test Unsorted Arrays
console.assert(Array.isSorted([1, 3, 2, 5, 4]) === false, 'Unsorted array (ascending)');
console.assert(Array.isSorted([5, 2, 3, 1, 4], function (a, b) { return b - a; }) === false, 'Unsorted array (descending)');

// Test with Custom Compare Function (for example, sorting strings by length)
function compareStringLength(a, b) {
    return a.length - b.length;
}
console.assert(Array.isSorted(['a', 'aa', 'aaa'], compareStringLength) === true, 'Array of strings sorted by length');
console.assert(Array.isSorted(['aaa', 'a', 'aa'], compareStringLength) === false, 'Array of strings not sorted by length');

// Test Non-Array Input
try {
    Array.isSorted('not an array');
    console.error('Non-array input should throw TypeError');
} catch (e) {
    console.assert(e instanceof TypeError, 'TypeError thrown for non-array input');
}