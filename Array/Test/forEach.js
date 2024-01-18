// Tests
const array1 = ['a', 'b', 'c'];
array1.forEach(function(element) {
    $.writeln(element)
});
// Expected output: "a"
// Expected output: "b"
// Expected output: "c"

// Using forEach() on sparse arrays
//~ const arraySparse = [1, 3, /* empty */, 7];
const arraySparse = Array(4);
arraySparse[0] = 1;
arraySparse[1] = 3;
arraySparse[3] = 7;
var numCallbackRuns = 0;

arraySparse.forEach(function(element) {
    $.writeln(element);
    numCallbackRuns++;
});

$.writeln(numCallbackRuns);
// { element: 1 }
// { element: 3 }
// { element: 7 }
// { numCallbackRuns: 3 }


// Converting a for loop to forEach
const items = ["item1", "item2", "item3"];
const copyItems = [];

// before
for (var i = 0; i < items.length; i++) {
    copyItems.push(items[i]);
}

// after
items.forEach(function(item) {
    copyItems.push(item)
});
$.writeln(copyItems)


// Printing the contents of an array
const logArrayElements = function(element, index /*, array */ ) {
    $.writeln("a[", index, "] = ", element);
};

// Notice that index 2 is skipped, since there is no item at
// that position in the array.
[2, 5, , 9].forEach(logArrayElements);
// Logs:
// a[0] = 2
// a[1] = 5
// a[3] = 9


// Calling forEach() on non-array objects
const arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 4,
    3: 5, // ignored by forEach() since length is 3
};
Array.prototype.forEach.call(arrayLike, function(x) {
    $.writeln(x)
});
// 2
// 3
// 4