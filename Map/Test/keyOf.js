// Test cases for keyOf
$.writeln("\nTests for Map.prototype.keyOf")
var map = new Map();
map.set(1, 'one');
map.set(2, 'two');
map.set(3, 'three');
map.set(4, null);
map.set(5, NaN);
map.set(6, Infinity);
map.set(7, 'one');

$.writeln(map.keyOf('one')); // Output: 1
$.writeln(map.keyOf('two')); // Output: 2
$.writeln(map.keyOf('four')); // Output: undefined

// Edge cases
$.writeln(map.keyOf(undefined)); // Output: undefined
$.writeln(map.keyOf(null)); // Output: 4
$.writeln(map.keyOf(NaN)); // Output: 5
$.writeln(map.keyOf(Infinity)); // Output: 6
$.writeln(map.keyOf(0)); // Output: undefined
$.writeln(map.keyOf(1)); // Output: undefined (value is 'one', not 1)