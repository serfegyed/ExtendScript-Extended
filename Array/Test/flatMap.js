// Tests
$.writeln([].flatMap(function(num) {
    return (num === 2 ? [2, 2] : 1)
}));
// Expected output: Array []

var arr1 = [1, 2, 1];
$.writeln(arr1.flatMap(function(num) {
    return (num === 2 ? [2, 2] : 1)
}));
// Expected output: Array [1, 2, 2, 1]


//
// map() and flatMap()
const arr1 = [1, 2, 3, 4];

$.writeln(arr1.map(function(x) {
    return [x * 2]
}));
// [[2], [4], [6], [8]]

$.writeln(arr1.flatMap(function(x) {
    return [x * 2]
}));
// [2, 4, 6, 8]

// only one level is flattened
$.writeln(arr1.flatMap(function(x) {
    return [
        [x * 2]
    ]
}));
// [[2], [4], [6], [8]]


// Generate a list of words from a list of sentences.
const arr2 = ["it's Sunny in", "", "California"];
$.writeln(arr2.map(function(x) {
    return x.split(" ")
}));
// [["it's","Sunny","in"],[""],["California"]]

$.writeln(arr2.flatMap(function(x) {
    return x.split(" ")
}));
// ["it's","Sunny","in", "", "California"]


// Using flatMap() on sparse arrays
$.writeln([1, 2, , 4, 5].flatMap(function(x) {
    return [x, x * 2]
})); // [1, 2, 2, 4, 4, 8, 5, 10]
$.writeln([1, 2, 3, 4].flatMap(function(x) {
    return [, x * 2]
})); // [2, 4, 6, 8]


// Calling flatMap() on non-array objects
const arrayLike = {
    length: 3,
    0: 1,
    1: 2,
    2: 3,
};

$.writeln(Array.prototype.flatMap.call(arrayLike, function(x) {
    return [x, x * 2]
}));
// [1, 2, 2, 4, 3, 6]

// Array-like objects returned from the callback won't be flattened
$.writeln(Array.prototype.flatMap.call(arrayLike, function(x) {
    return {
        length: 1,
        0: x
    }
}));
// [ { '0': 1, length: 1 }, { '0': 2, length: 1 }, { '0': 3, length: 1 } ]

$.writeln(Array.prototype.flatMap.call({}, function(x) {
    return [x, x * 2]
}));
// [undefined]