// Filtering out all small values
function isBigEnough(value) {
    return value >= 10;
}

$.writeln(filtered = [12, 5, 8, 130, 44].filter(isBigEnough));
// filtered is [12, 130, 44]
$.writeln()


// Find all prime numbers in an array
const array = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

function isPrime(num) {
    for (var i = 2; num > i; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num > 1;
}

$.writeln(array.filter(isPrime)); // [2, 3, 5, 7, 11, 13]
$.writeln()


// Searching in array
const fruits = ["apple", "banana", "grapes", "mango", "orange"];

/**
 * Filter array items based on search criteria (query)
 */
function filterItems(arr, query) {
    return arr.filter(function(el) {
        return el.toLowerCase().includes(query.toLowerCase())
    });
}

$.writeln(filterItems(fruits, "ap")); // ['apple', 'grapes']
$.writeln(filterItems(fruits, "an")); // ['banana', 'mango', 'orange']
$.writeln()


// Using filter() on sparse arrays
$.writeln([1, , undefined].filter(function(x) {
    return x === undefined
})); // [undefined, undefined]
$.writeln([1, , undefined].filter(function(x) {
    return x !== 2
})); // [1, undefined, undefined]


// Calling filter() on non-array objects
const arrayLike = {
    length: 3,
    0: "a",
    1: "b",
    2: "c",
    3: "a", // ignored by filter() since length is 3
};
$.writeln(Array.prototype.filter.call(arrayLike, function(x) {
    return x <= "b"
}));
// [ 'a', 'b' ]