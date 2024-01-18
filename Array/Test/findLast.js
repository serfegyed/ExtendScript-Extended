//
// Find last object in an array matching on element properties
const inventory = [{
        name: "apples",
        quantity: 2
    },
    {
        name: "bananas",
        quantity: 0
    },
    {
        name: "fish",
        quantity: 1
    },
    {
        name: "cherries",
        quantity: 5
    },
];

// return true inventory stock is low
function isNotEnough(item) {
    return item.quantity < 2;
}

$.writeln(inventory.findLast(isNotEnough));
// { name: "fish", quantity: 1 }


// Find last prime number in an array
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

$.writeln([4, 6, 8, 12].findLast(isPrime)); // undefined, not found
$.writeln([4, 5, 7, 8, 9, 11, 12].findLast(isPrime)); // 11


// Using findLast() on sparse arrays
// Declare array with no elements at indexes 2, 3, and 4
const array = [0, 1, , , , 5, 6];

// Shows all indexes, not just those with assigned values
array.findLast(function(value, index) {
    $.writeln("Visited index ", index, " with value ", value)
});
// Visited index 6 with value 6
// Visited index 5 with value 5
// Visited index 4 with value undefined
// Visited index 3 with value undefined
// Visited index 2 with value undefined
// Visited index 1 with value 1
// Visited index 0 with value 0

// Shows all indexes, including deleted
array.findLast(function(value, index) {
    // Delete element 5 on first iteration
    if (index === 6) {
        $.writeln("Deleting array[5] with value ", array[5]);
        delete array[5];
    }
    // Element 5 is still visited even though deleted
    $.writeln("Visited index ", index, " with value ", value);
});
// Deleting array[5] with value 5
// Visited index 6 with value 6
// Visited index 5 with value undefined
// Visited index 4 with value undefined
// Visited index 3 with value undefined
// Visited index 2 with value undefined
// Visited index 1 with value 1
// Visited index 0 with value 0


// Calling findLast() on non-array objects
const arrayLike = {
    length: 3,
    0: 2,
    1: 7.3,
    2: 4,
    3: 3, // ignored by findLast() since length is 3
};

function isInteger(x) {
    return Math.floor(x) === x
}
$.writeln(
    Array.prototype.findLast.call(arrayLike, function(x) {
        return isInteger(x)
    })); // 4