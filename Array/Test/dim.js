// Example usage
var arr = [NaN, [1, 2], [3, [4, 5]], [[6, [7, 8]], 9], [10, 11], Infinity];
var d = arr.dim(); // d should be [0, 1, 2, 3, 1, 0]
console.log(d);

console.log([1, 2, 3].dim()); // [0,0,0]
console.log([].dim()); // []