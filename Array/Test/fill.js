// Using fill()
$.writeln([1, 2, 3].fill(4)); // [4, 4, 4]
$.writeln([1, 2, 3].fill(4, 1)); // [1, 4, 4]
$.writeln([1, 2, 3].fill(4, 1, 2)); // [1, 4, 3]
$.writeln([1, 2, 3].fill(4, 1, 1)); // [1, 2, 3]
$.writeln([1, 2, 3].fill(4, 3, 3)); // [1, 2, 3]
$.writeln([1, 2, 3].fill(4, -3, -2)); // [4, 2, 3]
$.writeln([1, 2, 3].fill(4, NaN, NaN)); // [1, 2, 3]
$.writeln([1, 2, 3].fill(4, 3, 5)); // [1, 2, 3]
$.writeln(Array(3).fill(4)); // [4, 4, 4]

// A single object, referenced by each slot of the array:
const arr = Array(3).fill({}); // [{}, {}, {}]
arr[0].hi = "hi"; // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]
$.writeln(arr);

// Filling sparse array
const tempGirls = Array(5).fill("girl", 0);
$.writeln(tempGirls);