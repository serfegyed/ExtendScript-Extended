// Testing value of array elements
function isBiggerThan10(element, index, array) {
    return element > 10;
}

$.writeln([2, 5, 8, 1, 4].some(isBiggerThan10)); // false
$.writeln([12, 5, 8, 1, 4].some(isBiggerThan10)); // true


// Checking whether a value exists in an array
const fruits = ["apple", "banana", "mango", "guava"];

function checkAvailability(arr, val) {
    return arr.some(function(arrVal) {
        return val === arrVal
    });
}

$.writeln(checkAvailability(fruits, "kela")); // false
$.writeln(checkAvailability(fruits, "banana")); // true


// Using some() on sparse arrays
$.writeln([1, , 3].some(function(x) {
    return x === undefined
})); // true
$.writeln([1, , 1].some(function(x) {
    return x !== 1
})); // true
$.writeln([1, undefined, 1].some(function(x) {
    return x !== 1
})); // true


// Calling some() on non-array objects
const arrayLike = {
    length: 3,
    0: "a",
    1: "b",
    2: "c",
    3: 3, // ignored by some() since length is 3
};
$.writeln(Array.prototype.some.call(arrayLike, function(x) {
    return typeof x === "number"
}));
// false