// Tests
//
const beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];

$.writeln(beasts.indexOf('bison'));
// Expected output: 1

// Start from index 2
$.writeln(beasts.indexOf('bison', 2));
// Expected output: 4

$.writeln(beasts.indexOf('giraffe'));
// Expected output: -1


// Finding all the occurrences of an element
const indices = [];
const array = ["a", "b", "a", "c", "a", "d"];
const element = "a";
var idx = array.indexOf(element);
while (idx !== -1) {
    indices.push(idx);
    idx = array.indexOf(element, idx + 1);
}
$.writeln(indices);
// [0, 2, 4]


// Calling indexOf() on non-array objects
const arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 4,
    3: 5, // ignored by indexOf() since length is 3
};
$.writeln(Array.prototype.indexOf.call(arrayLike, 2));
// 0
$.writeln(Array.prototype.indexOf.call(arrayLike, 5));
// -1