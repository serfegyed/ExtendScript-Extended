// Test with an empty array:
var arr = [];
try {
    $.writeln(arr.sum());
} catch (e) {
    $.writeln(e);
} // Expected output: Error: Empty array without an initial value

// Test with an array containing only one element:
var arr = [5];
$.writeln(arr.sum()); // Expected output: 5

// Test with an array containing multiple elements:
var arr = [5, 10, 3, 8, 2];
$.writeln(arr.sum()); // Expected output: 28

// Test with an array of objects and a salient property:
var arr = [
    { name: "John", age: 25 },
    { name: "June", age: 18 },
    { name: "Janett", age: 18 },
    { name: "Bob", age: 20 },
];
$.writeln(arr.sum("age")); // Expected output: 81
$.writeln(arr.sum("name")); // Expected output: JohnJuneJanettBob

// Test with the array of objects and a custom mapper function:
var mapper = function (obj) {
    return obj.name.length;
};
$.writeln(arr.sum(mapper)); // Expected output: 17, the sum of name's length

// Calling sum() on non-array objects
const arrayLike = {
    length: 3,
    0: 4,
    1: 7,
    2: 5.3,
    3: 99, // ignored by sum() since length is 3
};

$.writeln(
    Array.prototype.sum.call(arrayLike, function (x) {
        return x;
    })
); // 16.3
