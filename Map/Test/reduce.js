// Tests for Map.prototype.reduce
$.writeln("\nTests for Map.prototype.reduce")
// Test case 1: Reduce Map values to a sum
var map1 = new Map();
map1.set('a', 1).set('b', 2).set('c', 3);
var sum = map1.reduce(function (accumulator, value) {
    return accumulator + value;
}, 0);
$.writeln("Test 1: " + sum); // Output: 6

// Test case 2: Reduce Map values to a string concatenation
var map2 = new Map();
map2.set('a', 'Hello').set('b', 'World').set('c', '!');
var str = map2.reduce(function (accumulator, value) {
    return accumulator + value;
}, '');
$.writeln("Test 2: " + str); // Output: 'HelloWorld!'

// Test case 3: Reduce an empty Map without initial value
var map3 = new Map();
try {
    map3.reduce(function (accumulator, value) {
        return accumulator + value;
    });
} catch (error) {
    $.writeln("Test 3: " + error); // Output: TypeError: Empty Map without an initial value
}

// Test case 4: Reduce with different initial value
var map4 = new Map();
map4.set('a', 1).set('b', 2).set('c', 3);
var product = map4.reduce(function (accumulator, value) {
    return accumulator * value;
}, 1);
$.writeln("Test 4: " + product); // Output: 6

// Test case 5: Reduce Map with only one entry var 
map5 = new Map()
map5.set('a', 1);
var sumSingleEntry = map5.reduce(function (accumulator, value) { return accumulator + value; });
$.writeln("Test 5: " + sumSingleEntry); // Output: 1

// Test case 6: Reduce Map without providing an initial value 
var map6 = new Map();
map6.set('a', 1).set('b', 2).set('c', 3);
try {
    $.writeln("Test 6: " + map6.reduce(function (accumulator, value) { return accumulator + value; }));
}
catch (error) {
    $.writeln("Test 6: " + error); // Output: 6
}

// Test case 7: Reduce Map with undefined as initial value 
var map7 = new Map();
map7.set('a', 1).set('b', 2).set('c', 3);
var sumWithUndefinedInitialValue = map7.reduce(function (accumulator, value) { return accumulator + value; }, undefined);
$.writeln("Test 7: " + sumWithUndefinedInitialValue); // Output: 6

// Test case 8: Reduce Map with null as initial value 
var map8 = new Map();
map8.set('a', 1).set('b', 2).set('c', 3);
var sumWithNullInitialValue = map8.reduce(function (accumulator, value) { return accumulator + value; }, null);
$.writeln("Test 8: " + sumWithNullInitialValue); // Output: 6

// Test case 9: Reduce Map with non-function callback 
var map9 = new Map();
map9.set('a', 1).set('b', 2).set('c', 3);
try {
    map9.reduce("invalid callback", 0);
}
catch (error) {
    $.writeln("Test 9: " + error); // Output: TypeError: Callback must be a function 
}

// Test case 10: Reduce Map with callback that returns undefined 
var map10 = new Map();
map10.set('a', 1).set('b', 2).set('c', 3);
try {
    map10.reduce(function (accumulator, value) { // Do something but return undefined 
    }, 0);
} catch (error) {
    $.writeln("Test 10: " + error); // Output: TypeError: Reducer function returns an invalid value 
}