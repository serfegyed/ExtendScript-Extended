// Tests for Map.prototype.some
$.writeln("\nTests for Map.prototype.some")
// Test case 1: Callback returns true for at least one value
var map1 = new Map();
map1.set(1, "apple");
map1.set(2, "banana");
map1.set(3, "cherry");

var result1 = map1.some(function (value) {
    return value.length > 5;
});

$.writeln(result1); // Output: true

// Test case 2: Callback returns false for all values
var map2 = new Map();
map2.set(1, "apple");
map2.set(2, "banana");
map2.set(3, "cherry");

var result2 = map2.some(function (value) {
    return value[0] === ("X");
});
$.writeln(result2); // Output: false

// Test case 3: Callback throws an error
var map3 = new Map();
map3.set(1, "apple");
map3.set(2, "banana");
map3.set(3, "cherry");

try {
    map3.some("not a function");
} catch (error) {
    $.writeln(error.message); // Output: Missing callback function
}
