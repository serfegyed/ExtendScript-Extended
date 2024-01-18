// Test case 1: Reversing an array with multiple elements
const items = [1, 2, 3];
$.writeln(items); // [1, 2, 3]

const reversedItems = items.toReversed();
$.writeln(reversedItems); // [3, 2, 1]
$.writeln(items); // [1, 2, 3]


// Test case 2: Reversing an empty array
var arr2 = [];
var reversedArr2 = arr2.toReversed();
$.writeln(reversedArr2); // []

// Test case 3: Reversing an array with a single element
var arr3 = [1];
var reversedArr3 = arr3.toReversed();
$.writeln(reversedArr3); // [1]

// Test case 4: Using toReversed() on sparse arrays
$.writeln([1, , 3].toReversed()); // [3, undefined, 1]
$.writeln([1, , 3, 4].toReversed()); // [4, 3, undefined, 1]


// Test case 5: Calling toReversed() on non-array objects
const arrayLike = {
    length: 3,
    unrelated: "foo",
    2: 4,
};
$.writeln(Array.prototype.toReversed.call(arrayLike));
// {length: 3, unrelated: "foo", 2: undefined, 0: 4}
// The ExtendScript's reverse() method is non-standard 
// The output would be: [4, undefined, undefined]