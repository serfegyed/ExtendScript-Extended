#include "..\\Lib\\Map.js";
/*******************************************************************/

// Create a new Map object
var myArr = [
    [1, "one"],
    [2, "two"],
    [3, "three"],
];

var myMap1 = new Map(myArr);
$.writeln("Create a new Map from array");
$.writeln(myArr);
$.writeln("myMap1: " + myMap1);

var myMap2 = new Map(myMap1);
$.writeln("\nCreate a new Map from previous Map");
$.writeln("myMap1: " + myMap1);
$.writeln("myMap2: " + myMap2);

var myObj3 = { key: "Key", value: "Value", name: "Name" };
var myMap3 = new Map(myObj3);
$.writeln("\nCreate a new Map from object");
$.writeln(myObj3);
$.writeln("myMap3: " + myMap3);

var myMap = new Map();
$.writeln("\nTest the 'set' method");
$.writeln(myMap.set('key1', 'value1').set('key2', 'value2').set('key3', null));
$.writeln(myMap.size()); // Output: 3
$.writeln(myMap.set('key1', 'value4').set('key4', Infinity).set('key5', NaN).set('key6', null).set('key7', undefined));
$.writeln(myMap.size()); // Output: 7

$.writeln("\nTest the 'includes' method");
$.writeln(myMap.includes('value4')); // true
$.writeln(myMap.includes('value6')); // false
$.writeln(myMap.includes(undefined)); // true
$.writeln(myMap.includes(null)); // true
$.writeln(myMap.includes(Infinity)); // true
$.writeln(myMap.includes(NaN)); //true
try {
    $.writeln(myMap.includes()); // TypeError
} catch (e) { $.writeln('TypeError: missing parameter.') }

$.writeln("\nTest the 'find' method");
$.writeln(myMap.find(function (x) { return x !== null })); // value4

$.writeln("\nTest the 'findKey' method");
$.writeln(myMap.findKey(function (x) { return x === Infinity })); // key4

$.writeln("\nTest the 'keyOf' method");	// key5
$.writeln(myMap.keyOf(NaN));

$.writeln("\nTest the 'delete' method");
$.writeln(myMap.delete('key1')); // true
$.writeln(myMap.delete('key1')); // false
$.writeln(myMap.toString())
$.writeln(myMap.size()); // Output: 2

$.writeln("\nTest the 'clear' method");
$.writeln(myMap.clear()); // Output: undefined
$.writeln(myMap.size()); // Output: 0

// Adding to map again
myMap.set('key1', 'value1').set('key2', 'value2').set('key3', 'value3');
$.writeln("\nTest the 'get' method");
$.writeln(myMap.get('key1')); // Output: value1
$.writeln(myMap.get('noKey1')); // Output: undefined

$.writeln("\nTest the iterator methods");
var keysIterator = myMap.keys();
var valuesIterator = myMap.values();
var entriesIterator = myMap.entries();

$.writeln("\nTest the 'keys' iterator method");
$.writeln("Map.prototype.keys() iterator");
var result = null;
while (!(result = keysIterator.next()).done) {
    $.writeln(result.value);
};
/*
key1
key2
key3
*/

$.writeln("\nTest the 'values' iterator method");
$.writeln("Map.prototype.values() iterator");
var result = null;
while (!(result = valuesIterator.next()).done) {
    $.writeln(result.value);
};
/*
value1
value2
value3	
*/

$.writeln();

$.writeln("\nTest the 'entries' iterator method");
$.writeln("Map.prototype.entries() iterator"); // Output: key1: value1, key2: value2, key3: value3
var result = null;
while (!(result = entriesIterator.next()).done) {
    $.writeln(result.value);
};
/*
["key1", "value1"]
["key2", "value2"]
["key3", "value3"]	
*/

$.writeln("\nTest the 'toArray' method");
$.writeln("toArray method");
$.writeln(myMap.toArray()); // Output: [["key1", "value1"], ["key2", "value2"], ["key3", "value3"]]

$.writeln("\nTest the 'toString' method");
$.writeln("toString method");
$.writeln(myMap.toString()); // Output: {{key1=>"value1"}, {key2=>"value2"}, {key3=>"value3"}}

$.writeln("\nTest the 'forEach' method");
$.writeln("forEach method");
myMap.forEach(function (value, key) {
    $.writeln(key + ' ==> ' + value);
});
/* Output:
key1 ==> value1
key2 ==> value2
key3 ==> value3
*/


















