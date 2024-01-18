// Test case 1
var originalArray = [1, null, 'hello', 0, '', false, 42, undefined, NaN];
$.writeln(originalArray.compact()) // [1, 'hello', 42]

// Test case 2
var originalArray = [1, 'hello', 42];
$.writeln(originalArray.compact()) // [1, 'hello', 42]

// Test case 3
var originalArray = [null, 0, '', false, undefined, NaN];
$.writeln(originalArray.compact()) // []