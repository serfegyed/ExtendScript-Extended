// Test with an empty array:
var arr = [];
$.writeln(arr.min()); // Expected output: undefined

// Test with an array containing only one element:
var arr = [5];
$.writeln(arr.min()); // Expected output: 5

// Test with an array containing multiple elements:
var arr = [5, 10, 3, 8, 2];
$.writeln(arr.min()); // Expected output: 2

// Test with an array of objects and a salient property:
var arr = [{
        name: 'Johny',
        age: 25
    },
    {
        name: 'Janett',
        age: 18
    },
    {
        name: 'June',
        age: 18
    },
    {
        name: 'Bobafett',
        age: 20
    }
];
$.writeln(arr.min()); // {name: "Bobafett", age: 20} 
$.writeln(arr.min('age')); // Expected output: { name: 'Janett', age: 18 }
$.writeln(arr.min('name')); // Expected output: { name: 'Bobafett', age: 20 }


// Test with the array of objects and a custom mapper function:

var mapper = function(obj) {
    return obj.name.length;
};
$.writeln(arr.min(mapper)); // Expected output: { name: 'June', age: 18 }

// Calling min() on non-array objects
const arrayLike = {
    length: 3,
    0: 4,
    1: 7,
    2: 5.3,
    3: 99, // ignored by min() since length is 3
};
$.writeln(Array.prototype.min.call(arrayLike)); // 4