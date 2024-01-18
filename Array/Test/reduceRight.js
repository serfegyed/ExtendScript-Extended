// Difference between reduce() and reduceRight()
const a = ["1", "2", "3", "4", "5"];
var sumFunc = function(prev, cur) {
    return prev + cur
};
const left = a.reduce(sumFunc);
const right = a.reduceRight(sumFunc);

$.writeln(left); // "12345"
$.writeln(right); // "54321"


//
const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduceRight(function(accumulator, currentValue) {
    return accumulator + currentValue
});

$.writeln(sumWithInitial);
// Expected output: 10

// Edge cases
const getMax = function(a, b) {
    return Math.max(a, b)
};

// callback is invoked for each element in the array starting at index 0
$.writeln([1, 100].reduceRight(getMax, 50)); // 100
$.writeln([50].reduceRight(getMax, 10)); // 50

// callback is invoked once for element at index 1
$.writeln([1, 100].reduceRight(getMax)); // 100

// callback is not invoked
$.writeln([50].reduceRight(getMax)); // 50
$.writeln([].reduceRight(getMax, 1)); // 1
try {
    $.writeln([].reduceRight(getMax))
} catch (e) {
    $.writeln("callback is not invoked")
}; // TypeError


// Sum of values in an object array
const objects = [{
    x: 1
}, {
    x: 2
}, {
    x: 3
}];
const sum = objects.reduceRight(function(accumulator, currentValue) {
    return accumulator + currentValue.x
}, 0);

$.writeln(sum); // 6


// Using reduceRight() with sparse arrays
$.writeln([1, 2, , 4].reduceRight(function(a, b) {
    return a + b
})); // NaN
$.writeln([1, 2, null, 4].reduceRight(function(a, b) {
    return a + b
})); // 7
$.writeln([1, 2, undefined, 4].reduceRight(function(a, b) {
    return a + b
})); // NaN


// Calling reduce() and reduceRight() on non-array objects
const arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 4,
    3: 99, // ignored by reduce() and reduceRight() since length is 3
};
const subFunc = function(x, y) {
    return x - y
};
$.writeln(Array.prototype.reduce.call(arrayLike, subFunc)); // -5
$.writeln(Array.prototype.reduceRight.call(arrayLike, subFunc)); - 1