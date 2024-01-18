//  Tests - MDN - Array.prototype.toSpliced()
//
var months = ["Jan", "Mar", "Apr", "May"];

// Inserting an element at index 1
var months2 = months.toSpliced(1, 0, "Feb");
$.writeln(months2); // ["Jan", "Feb", "Mar", "Apr", "May"]

// Deleting two elements starting from index 2
var months3 = months2.toSpliced(2, 2);
$.writeln(months3); // ["Jan", "Feb", "May"]

// Replacing one element at index 1 with two new elements
var months4 = months3.toSpliced(1, 1, "Feb", "Mar");
$.writeln(months4); // ["Jan", "Feb", "Mar", "May"]

// Original array is not modified
$.writeln(months); // ["Jan", "Mar", "Apr", "May"]


// Using toSpliced() on sparse arrays
const arr = [1, , 3, 4, , 6];
$.writeln(arr.toSpliced(1, 2)); // [1, 4, undefined, 6]


// Calling toSpliced() on non-array objects
const arrayLike = {
    length: 3,
    unrelated: "foo",
    0: 5,
    2: 4,
};
$.writeln(Array.prototype.toSpliced.call(arrayLike, 0, 1, 2, 3));
// {length: 3, unrelated: "foo", 0: 2, 3: 4, 1: 3}
// The ExtendScript's splice() method is non-standard 
// The output would be: [2, 3, undefined, 4]
// 