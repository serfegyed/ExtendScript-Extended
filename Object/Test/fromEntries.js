// Test case 1: Basic usage with array of key-value pairs
var entries1 = [
    ['name', 'John'],
    ['age', 30],
    ['city', 'New York']
];
var obj1 = Object.fromEntries(entries1);
$.writeln(obj1);
// Output: { name: 'John', age: 30, city: 'New York' }

// Test case 2: Handling duplicate keys
var entries2 = [
    ['name', 'John'],
    ['age', 30],
    ['name', 'Jane']
];
var obj2 = Object.fromEntries(entries2);
$.writeln(obj2);
// Output: { name: 'Jane', age: 30 }

// Test case 3: Empty array
var entries3 = [];
var obj3 = Object.fromEntries(entries3);
$.writeln(obj3);
// Output: {}

// Test case 4: Non-array input
try {
    var entries4 = {
        foo: 'bar'
    };
    var obj4 = Object.fromEntries(entries4);
} catch (error) {
    $.writeln(error);
}
// Output: TypeError: Object.fromEntries requires an array as input

// Test case 5: Ignoring non-array entries
var entries5 = [
    ['name', 'John'], 'age', ['city', 'New York']
];
var obj5 = Object.fromEntries(entries5);
$.writeln(obj5);
// Output: { name: 'John', city: 'New York' }

// Test case 6: One dimension array - this is equals to test case 5
var entries6 = ['name', 'John'];
var obj6 = Object.fromEntries(entries6);
$.writeln(obj6);
// Output: {}

// Test case 7: Two dimension array with one element
var entries7 = [
    ['name', 'John']
];
var obj7 = Object.fromEntries(entries7);
$.writeln(obj7);
// Output: {name: John}