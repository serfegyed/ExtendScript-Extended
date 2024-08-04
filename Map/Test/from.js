// Map.from()
console.log("\nTests Map.prototype.from() method")

// Test case 1: Array
var arr = [['key1', 'value1'], ['key2', 'value2']];
var myMap = Map.from(arr);
console.log("\nTest 1: " + myMap);	// Test 1: Map: <[key1: "value1"], [key2: "value2"]>
console.log(myMap.get('key1') === 'value1'); // Expected output: true
console.log(myMap.get('key2') === 'value2'); // Expected output: true

// Test case 2: Another Map instance
var anotherMap = new Map();
anotherMap.set('key3', 'value3');
anotherMap.set('key4', 'value4');
myMap = Map.from(anotherMap)
console.log("\nTest 2: " + myMap);	// Test 2: Map: <[key3: "value3"], [key4: "value4"]>
console.log(myMap.get('key3') === 'value3'); // Expected output: true
console.log(myMap.get('key4') === 'value4'); // Expected output: true

// Test case 3: Array-like object with key/value pairs and length
var myMap = new Map();
var arrayLike = {
    length: 3,
    0: 2,
    1: null,
    2: undefined,
    3: 5,
};
myMap = Map.from(arrayLike)
console.log("\nTest 3: " + myMap);	// Test 3: Map: <[0: 2], [1: null], [2: undefined]>
console.log(myMap.get(1) === null); // Expected output: true
console.log(myMap.get('3') === 5); // Expected output: false, because the `length` === 3

// Test case 4: Empty iterable
var emptyArr = [];
myMap = Map.from(emptyArr);
console.log("\nTest 4: " + myMap);	// Test 4: Map: <>
console.log(myMap.size); // Expected output: 0

// Test case 5: Iterable with invalid entries
var invalidArr = [[1, 2], [3], [4, 5, 6]];
myMap = Map.from(invalidArr);
console.log("\nTest 5: " + myMap);	//Test 5: Map: <[1: 2]>, invalid entries omitted

// Test case 6: Iterable with null entry
var nullArr = [[null, 'value']];
myMap = Map.from(nullArr)
console.log("\nTest 6: " + myMap);	// Test 6: Map: <[null: "value"]>
console.log(myMap.get(null) === 'value'); // Expected output: true

// Test case 7: Iterable with undefined entry
var undefinedArr = [[undefined, 'value']];
myMap = Map.from(undefinedArr)
console.log("\nTest 7: " + myMap);	// Test 7: Map: <[undefined: "value"]>
console.log(myMap.get(undefined) === 'value'); // Expected output: true

// Test case 8: Iterable with duplicate keys
var duplicateArr = [['key1', 'value1'], ['key1', 'value2']];
myMap = Map.from(duplicateArr);
console.log("\nTest 8: " + myMap);	// Test 8: Map: <[key1: "value2"]>
console.log(myMap.get('key1') === 'value2'); // Expected output: true

// Test case 9: Iterable with non-string keys
var nonStringKeysArr = [[123, 'value']];
myMap = Map.from(nonStringKeysArr)
console.log("\nTest 9: " + myMap);	// Test 9: Map: <[123: "value"]>
console.log(myMap.get(123) === 'value'); // Expected output: true

// Test case 10: Object with key/value pairs wo length
var myMap = object = {
    0: 2,
    1: 3,
    2: 4,
    3: 5,
};
myMap = Map.from(object)
console.log("\nTest 10: " + myMap);	// Test 10: Map: <[0: 2], [1: 3], [2: 4], [3: 5]>
console.log(myMap.get('3') === 5); // Expected output: true
console.log(myMap.get('1') === 3); // Expected output: true

//****************************************************************************
console.log("\nTests Map.prototype.from() method using the callback function")
// Test case 1: Converting an array of arrays into a map
var array1 = [[1, 'one'], [2, 'two']];
var arrayMap1 = Map.from(array1, function (value, key) { value = value.toUpperCase(); return [key, value] });
console.log("\nTest 1: " + arrayMap1); // Map: <[1: "ONE"], [2: "TWO"]>

// Test case 2: Converting a map into another map
var sourceMap2 = new Map();
sourceMap2.set(1, 'one');
sourceMap2.set(2, 'two');
var resultMap2 = Map.from(sourceMap2);
console.log("\nTest 2: " + resultMap2); // Map: <[1: "one"], [2: "two"]>

// Test case 3: Converting an object into a map
var obj3 = { a: 'apple', b: 'banana' };
var objMap3 = Map.from(obj3);
console.log("\nTest 3: " + objMap3); // Map: <[a: "apple"], [b: "banana"]>

// Test case 4: Using a custom mapping function
var array4 = [[1, 2]];
var customMap4 = Map.from(array4, function (value, key) { return [key, value * 2] });
console.log("\nTest 4: " + customMap4); // Map: <[1: 4]>

// Edge case 5: An empty array should result in an empty map
var emptyArrayMap5 = Map.from([]);
console.log("\nTest 5: " + emptyArrayMap5); // Map: <>

// Edge case 6: Passing null should throw a TypeError
try {
    var nullMap6 = Map.from(null);
    console.log(nullMap6);
} catch (error) {
    console.log("\nTest 6: " + error); // Error: Expected an object for 'iterable' but received: object
}

// Edge case 7: Passing undefined should throw a TypeError
try {
    var undefinedMap7 = Map.from(undefined);
    console.log(undefinedMap7);
} catch (error) {
    console.log("\nTest 7: " + error); // Error: Expected an object for 'iterable' but received: undefined
}

// Edge case 8: Using a custom mapping function with thisArg
var arrayWithThis8 = [[1, 2]];
var customMapWithThis8 = Map.from(arrayWithThis8, function (value, key) {
    return [key, value * this.revenue];
}, { revenue: 10 });
console.log("\nTest 8: " + customMapWithThis8); // Map: <[1: 20]>