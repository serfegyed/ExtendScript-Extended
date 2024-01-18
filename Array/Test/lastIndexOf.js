// Using
const numbers = [2, 5, 9, 2];
$.writeln(numbers.lastIndexOf(2)); // 3
$.writeln(numbers.lastIndexOf(7)); // -1
$.writeln(numbers.lastIndexOf(2, 3)); // 3
$.writeln(numbers.lastIndexOf(2, 2)); // 0
$.writeln(numbers.lastIndexOf(2, -2)); // 0
$.writeln(numbers.lastIndexOf(2, -1)); // 3


// You cannot use lastIndexOf() to search for NaN.
const array = [NaN];
$.writeln(array.lastIndexOf(NaN)); // -1


// Calling lastIndexOf() on non-array object
const arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 2,
    3: 5, // ignored by lastIndexOf() since length is 3
};
$.writeln(Array.prototype.lastIndexOf.call(arrayLike, 2));
// 2
$.writeln(Array.prototype.lastIndexOf.call(arrayLike, 5));
// -1