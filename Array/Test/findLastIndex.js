//
// Find the index of the last prime number in an array
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

$.writeln([4, 6, 8, 12].findLastIndex(isPrime)); // -1, not found
$.writeln([4, 5, 7, 8, 9, 11, 12].findLastIndex(isPrime)); // 5


// Using findLastIndex() on sparse arrays
$.writeln([1, , 3].findLastIndex(function(x) {
    return x === undefined
})); // 1


// Calling findLastIndex() on non-array objects
const arrayLike = {
    length: 3,
    0: 2,
    1: 7.3,
    2: 4,
    3: 3, // ignored by findLastIndex() since length is 3
};

function isInteger(x) {
    return Math.floor(x) === x
}

$.writeln(
    Array.prototype.findLastIndex.call(arrayLike, function(x) {
        return isInteger(x)
    })); // 2