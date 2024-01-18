//
// Find the index of a prime number in an array
function isPrime(element) {
    if (element % 2 === 0 || element < 2) {
        return false;
    }
    for (var factor = 3; factor <= Math.sqrt(element); factor += 2) {
        if (element % factor === 0) {
            return false;
        }
    }
    return true;
}

$.writeln([4, 6, 8, 9, 12].findIndex(isPrime)); // -1, not found
$.writeln([4, 6, 7, 9, 12].findIndex(isPrime)); // 2 (array[2] is 7)


// Using findIndex() on sparse arrays
$.writeln([1, , 3].findIndex(function(x) {
    return x === undefined
})); // 1


// Calling findIndex() on non-array objects
const arrayLike = {
    length: 3,
    "-1": 0.1, // ignored by findIndex() since -1 < 0
    0: 2,
    1: 7.3,
    2: 4,
};
$.writeln(
    Array.prototype.findIndex.call(arrayLike, function(x) {
        return !isInteger(x)
    })); // 1