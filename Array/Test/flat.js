//
// Flattening nested arrays
console.log("Nested arrays: ")
const arr1 = [1, 2, [3, 4]];
console.log(arr1);
console.log("flat(): " + arr1.flat());
// [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]];
console.log("\n" + arr2);
console.log("flat(): " + arr2.flat());
// [1, 2, 3, 4, [5, 6]]

const arr3 = [1, 2, [3, 4, [5, 6]]];
console.log("\n" + arr3);
console.log("flat(2): " + arr3.flat(2));
// [1, 2, 3, 4, 5, 6]

const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
console.log("\n" + arr4);
console.log("flat(Infinity): " + arr4.flat(Infinity));
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


// Using flat() on sparse arrays
console.log("\nSparse arrays: ")
var arr5 = Array(5);
arr5[0] = 1;
arr5[1] = 2;
arr5[3] = 4;
arr5[4] = 5;
console.log("\n" + arr5.flat()); // [1, 2, 4, 5]
console.log("\n" + [1, 2, , 4, 5].flat()); // [1, 2,, 4, 5]

const array = Array(4);
array[0] = 1;
array[2] = 3;
array[3] = Array(2);
array[3][0] = "a";
array[3][2] = "c";
console.log("\n" + array.flat()); // [ 1, 3, "a", "c" ]

//~ const array2 = [1, , 3, ["a", , ["d", , "e"]]];
const array2 = Array(4);
array2[0] = 1;
array2[2] = 3;
array2[3] = Array(2);
array2[3][0] = "a";
array2[3][2] = Array(3);
array2[3][2][0] = "d";
array2[3][2][2] = "e";
console.log('\n[1, , 3, ["a", , ["d", , "e"]]];');
console.log("flat(1): " + array2.flat()); // [ 1, 3, "a", ["d", empty, "e"] ]
console.log("flat(2): " + array2.flat(2)); // [ 1, 3, "a", "d", "e"]