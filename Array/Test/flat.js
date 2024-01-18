//
// Flattening nested arrays
$.writeln("Nested arrays: ")
const arr1 = [1, 2, [3, 4]];
$.writeln(arr1);
$.writeln("flat(): " + arr1.flat());
// [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]];
$.writeln("\n" + arr2);
$.writeln("flat(): " + arr2.flat());
// [1, 2, 3, 4, [5, 6]]

const arr3 = [1, 2, [3, 4, [5, 6]]];
$.writeln("\n" + arr3);
$.writeln("flat(2): " + arr3.flat(2));
// [1, 2, 3, 4, 5, 6]

const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
$.writeln("\n" + arr4);
$.writeln("flat(Infinity): " + arr4.flat(Infinity));
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


// Using flat() on sparse arrays
$.writeln("\nSparse arrays: ")
var arr5 = Array(5);
arr5[0] = 1;
arr5[1] = 2;
arr5[3] = 4;
arr5[4] = 5;
$.writeln("\n" + arr5.flat()); // [1, 2, 4, 5]

const array = Array(4);
array[0] = 1;
array[2] = 3;
array[3] = Array(2);
array[3][0] = "a";
array[3][2] = "c";
$.writeln("\n" + array.flat()); // [ 1, 3, "a", "c" ]

//~ const array2 = [1, , 3, ["a", , ["d", , "e"]]];
const array2 = Array(4);
array2[0] = 1;
array2[2] = 3;
array2[3] = Array(2);
array2[3][0] = "a";
array2[3][2] = Array(3);
array2[3][2][0] = "d";
array2[3][2][2] = "e";
$.writeln('\n[1, , 3, ["a", , ["d", , "e"]]];');
$.writeln("flat(1): " + array2.flat()); // [ 1, 3, "a", ["d", undefined, "e"] ]
$.writeln("flat(2): " + array2.flat(2)); // [ 1, 3, "a", "d", "e"]


// Calling flat() on non-array objects
$.writeln("\nCalling flat() on non-array objects: ")
const arrayLike = {
    length: 3,
    0: [1, 2],
    // Array-like objects aren't flattened
    1: {
        length: 2,
        0: 3,
        1: 4
    },
    2: 5,
    3: 3, // ignored by flat() since length is 3
};
$.writeln("\n" + arrayLike);
$.writeln(Array.prototype.flat.call(arrayLike));
// [ 1, 2, { '0': 3, '1': 4, length: 2 }, 5 ]