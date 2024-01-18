// Map.from()
$.writeln("\nTests Map.prototype.from() method")

// Test case 1: Array
var myMap = new Map();
var arr = [['key1', 'value1'], ['key2', 'value2']];
$.writeln("\nTest 1: " + myMap.from(arr));	// Test 1: {{key1=>"value1"}, {key2=>"value2"}}
$.writeln(myMap.get('key1') === 'value1'); // Expected output: true
$.writeln(myMap.get('key2') === 'value2'); // Expected output: true

// Test case 2: Another Map instance
var myMap = new Map();
var anotherMap = new Map();
anotherMap.set('key3', 'value3');
anotherMap.set('key4', 'value4');
$.writeln("\nTest 2: " + myMap.from(anotherMap));	// Test 2: {{key3=>"value3"}, {key4=>"value4"}}
$.writeln(myMap.get('key3') === 'value3'); // Expected output: true
$.writeln(myMap.get('key4') === 'value4'); // Expected output: true

// Test case 3: Object with key/value pairs
var myMap = new Map();
var arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 4,
    3: 5
};
$.writeln("\nTest 3: " + myMap.from(arrayLike));	// Test 3: {{length=>3}, {0=>2}, {1=>3}, {2=>4}, {3=>5}}
$.writeln(myMap.get('length') === 3); // Expected output: true
$.writeln(myMap.get(1) === 3); // Expected output: true

// Test case 4: Empty iterable
var myMap = new Map();
var emptyArr = [];
$.writeln("\nTest 4: " + myMap.from(emptyArr));	// Test 4: {}
$.writeln(myMap.size()); // Expected output: 0

// Test case 5: Iterable with invalid entries
var myMap = new Map();
var invalidArr = [[1, 2], [3], [4, 5, 6]];
$.writeln("\nTest 5: " + myMap.from(invalidArr));	//Test 5: {{1=>2}, {3=>undefined}, {4=>5}}

// Test case 6: Iterable with null entry
var myMap = new Map();
var nullArr = [[null, 'value']];
$.writeln("\nTest 6: " + myMap.from(nullArr));	// Test 6: {{null=>"value"}}
$.writeln(myMap.get(null) === 'value'); // Expected output: true

// Test case 7: Iterable with undefined entry
var myMap = new Map();
var undefinedArr = [[undefined, 'value']];
$.writeln("\nTest 7: " + myMap.from(undefinedArr));	// Test 7: {{undefined=>"value"}}
$.writeln(myMap.get(undefined) === 'value'); // Expected output: true

// Test case 8: Iterable with duplicate keys
var myMap = new Map();
var duplicateArr = [['key1', 'value1'], ['key1', 'value2']];
$.writeln("\nTest 8: " + myMap.from(duplicateArr));	// Test 8: {{key1=>"value2"}}
$.writeln(myMap.get('key1') === 'value2'); // Expected output: true

// Test case 9: Iterable with non-string keys
var myMap = new Map();
var nonStringKeysArr = [[123, 'value']];
$.writeln("\nTest 9: " + myMap.from(nonStringKeysArr));	// Test 8: {{key1=>"value2"}}
$.writeln(myMap.get(123) === 'value'); // Expected output: true

//****************************************************************************
$.writeln("\nTests Map.prototype.from() method using the callback function")
// Test case 1: Converting an array of arrays into a map
var array1 = [[1, 'one'], [2, 'two']];
var arrayMap1 = Map.from(array1, function (arr) { arr[1] = arr[1].toUpperCase(); return arr; });
$.writeln("\nTest 1: " + arrayMap1);

// Test case 2: Converting a map into another map
var sourceMap2 = new Map();
sourceMap2.set(1, 'one');
sourceMap2.set(2, 'two');
var resultMap2 = Map.from(sourceMap2);
$.writeln("\nTest 2: " + resultMap2);

// Test case 3: Converting an object into a map
var obj3 = { a: 'apple', b: 'banana' };
var objMap3 = Map.from(obj3);
$.writeln("\nTest 3: " + objMap3);

// Test case 4: Using a custom mapping function
var array4 = [[1, 2, 3]];
var customMap4 = Map.from(array4, function (item) { return [item[0], item[1] * 2]; });
$.writeln("\nTest 4: " + customMap4);

// Edge case 5: An empty array should result in an empty map
var emptyArrayMap5 = Map.from([]);
$.writeln("\nTest 5: " + emptyArrayMap5);

// Edge case 6: Passing null should throw a TypeError
try {
    var nullMap6 = Map.from(null);
    $.writeln(nullMap6);
} catch (error) {
    $.writeln("\nTest 6: " + error); // Should throw a TypeError
}

// Edge case 7: Passing undefined should throw a TypeError
try {
    var undefinedMap7 = Map.from(undefined);
    $.writeln(undefinedMap7);
} catch (error) {
    $.writeln("\nTest 7: " + error); // Should throw a TypeError
}

// Edge case 8: Using a custom mapping function with thisArg
var arrayWithThis8 = [[1, 2, 3]];
var customMapWithThis8 = Map.from(arrayWithThis8, function (item) {
    return [item[0], item[1] * this.value];
}, { value: 10 });
$.writeln("\nTest 8: " + customMapWithThis8);