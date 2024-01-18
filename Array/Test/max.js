// Test with an empty array:
var arr = [];
$.writeln(arr.max()); // Expected output: undefined

// Test with an array containing only one element:
var arr = [5];
$.writeln(arr.max()); // Expected output: 5

// Test with an array containing multiple elements:
var arr = [5, 10, 3, 8, 2];
$.writeln(arr.max()); // Expected output: 10

// Test with an array of objects and a salient property:
var arr = [{
        name: 'John',
        age: 25
    },
    {
        name: 'June',
        age: 18
    },
    {
        name: 'Janett',
        age: 18
    },
    {
        name: 'Bob',
        age: 20
    }
];
$.writeln(arr.max()); // {name: "June", age: 18} 
$.writeln(arr.max('age')); // Expected output: { name: 'John', age: 25 }
$.writeln(arr.max('name')); // Expected output: { name: 'June', age: 18 }


// Test with the array of objects and a custom mapper function:

var mapper = function(obj) {
    return obj.name.length;
};
$.writeln(arr.max(mapper)); // Expected output: { name: 'Janett', age: 18 }

// Calling max() on non-array objects
const arrayLike = {
    length: 3,
    0: 4,
    1: 7,
    2: 5.3,
    3: 99, // ignored by max() since length is 3
};

$.writeln(Array.prototype.max.call(arrayLike)); // 7