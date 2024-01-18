const isBelowThreshold = function(currentValue) {
    return currentValue < 40
};
const array1 = [1, 30, 39, 29, 10, 13];

$.writeln(array1.every(isBelowThreshold));
// Expected output: true

// Testing size of all array elements
function isBigEnough(element, index, array) {
    return element >= 10;
}
$.writeln([12, 5, 8, 130, 44].every(isBigEnough)); // false
$.writeln([12, 54, 18, 130, 44].every(isBigEnough)); // true

// Check if one array is a subset of another array
const isSubset = function(array1, array2) {
    return array2.every(function(element) {
        return array1.includes(element)
    })
};

$.writeln(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 7, 6])); // true
$.writeln(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 8, 7])); // false

// Using every() on sparse arrays
$.writeln([1, , 3].every(function(x) {
    x !== undefined
})); // false
$.writeln([2, , 2].every(function(x) {
    x === 2
})); // false

// Calling every() on non-array objects
const arrayLike = {
    length: 3,
    0: "a",
    1: "b",
    2: "c",
    3: 345, // ignored by every() since length is 3
};
$.writeln(
    Array.prototype.every.call(arrayLike, function(x) {
        return typeof x === "string"
    })
); // true