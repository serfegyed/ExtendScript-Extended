// Test cases for keyOf
console.log("\nTests for Map.prototype.keyOf")
var map = new Map();
map.set(1, 'one');
map.set(2, 'two');
map.set(3, 'three');
map.set(4, null);
map.set(5, NaN);
map.set(6, Infinity);
map.set(7, 'one');

console.log(map.keyOf('one')); // Output: 1
console.log(map.keyOf('two')); // Output: 2
console.log(map.keyOf('four')); // Output: undefined

// Edge cases
console.log(map.keyOf(undefined)); // Output: undefined
console.log(map.keyOf(null)); // Output: 4
console.log(map.keyOf(NaN)); // Output: 5
console.log(map.keyOf(Infinity)); // Output: 6
console.log(map.keyOf(0)); // Output: undefined
console.log(map.keyOf('1')); // Output: undefined (value is '1', not 1)