// Find an object in an array by one of its properties
const inventory = [{
        name: "apples",
        quantity: 2
    },
    {
        name: "bananas",
        quantity: 0
    },
    {
        name: "cherries",
        quantity: 5
    },
];

function isCherries(fruit) {
    return fruit.name === "cherries";
}

$.writeln(inventory.find(isCherries));
// { name: 'cherries', quantity: 5 }


// Find a prime number in an array
function isPrime(element, index, array) {
    var start = 2;
    while (start <= Math.sqrt(element)) {
        if (element % start++ < 1) {
            return false;
        }
    }
    return element > 1;
}

$.writeln([4, 6, 8, 12].find(isPrime)); // undefined, not found
$.writeln([4, 5, 8, 12].find(isPrime)); // 5


// Using find() on sparse arrays
// Declare array with no elements at indexes 2, 3, and 4
const array = [0, 1, , , , 5, 6];

// Shows all indexes, not just those with assigned values
array.find(function(value, index) {
    $.writeln("Visited index ", index, "with value ", value)
});
// Visited index 0 with value 0
// Visited index 1 with value 1
// Visited index 2 with value undefined
// Visited index 3 with value undefined
// Visited index 4 with value undefined
// Visited index 5 with value 5
// Visited index 6 with value 6

// Shows all indexes, including deleted
array.find(function(value, index) {
    // Delete element 5 on first iteration
    if (index === 0) {
        $.writeln("Deleting array[5] with value ", array[5]);
        delete array[5];
    }
    // Element 5 is still visited even though deleted
    $.writeln("Visited index ", index, "with value ", value);
});
// Deleting array[5] with value 5
// Visited index 0 with value 0
// Visited index 1 with value 1
// Visited index 2 with value undefined
// Visited index 3 with value undefined
// Visited index 4 with value undefined
// Visited index 5 with value undefined
// Visited index 6 with value 6


// Calling find() on non-array objects
const arrayLike = {
    length: 3,
    "-1": 0.1, // ignored by find() since -1 < 0
    0: 2,
    1: 7.3,
    2: 4,
};

function isInteger(x) {
    return Math.floor(x) === x
}

$.writeln(Array.prototype.find.call(arrayLike, function(x) {
    return !isInteger(x)
}));
// 7.3