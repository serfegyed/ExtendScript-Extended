#include "..\\Map_full.js";
/*******************************************************************/

// Create a new Map object
var myArr = [
    [1, "one"],
    [2, "two"],
    [3, "three"],
];

var myMap1 = new Map(myArr);
console.log("Create a new Map from array");
console.log(myArr);
console.log("myMap1: " + myMap1);

var myMap2 = Object.create(myMap1);
console.log("\nCreate a new Map from previous Map");
console.log("myMap1: " + myMap1);
console.log("myMap2: " + myMap2);

var myMap = new Map();
console.log("\nTest the 'set' method");
console.log(myMap.set('key1', 'value1').set('key2', 'value2').set('key3', null));
console.log(myMap.size); // Output: 3
console.log(myMap.set('key1', 'value4').set('key4', Infinity).set('key5', NaN).set('key6', null).set('key7', undefined));
console.log(myMap.size); // Output: 7

console.log("\nTest the 'includes' method");
console.log(myMap.includes('value4')); // true
console.log(myMap.includes('value6')); // false
console.log(myMap.includes(undefined)); // true
console.log(myMap.includes(null)); // true
console.log(myMap.includes(Infinity)); // true
console.log(myMap.includes(NaN)); //true
try {
    console.log(myMap.includes()); // TypeError
} catch (e) { console.log('TypeError: missing parameter.') };

console.log("\nTest the 'find' method");
console.log(myMap.find(function (x) { return x !== null })); // value4

console.log("\nTest the 'findKey' method");
console.log(myMap.findKey(function (x) { return x === Infinity })); // key4


console.log("\nTest the 'delete' method");
console.log(myMap.delete('key1')); // true
console.log(myMap.delete('key1')); // false
console.log(myMap.toString())
console.log(myMap.size); // Output: 6

console.log("\nTest the 'clear' method");
console.log(myMap.clear()); // Output: undefined
console.log(myMap.size); // Output: 0

// Adding to map again
myMap.set('key1', 11).set('key2', '22').set('key3', 33);
console.log("\nTest the 'get' method");
console.log(myMap.get('key1')); // Output: value1
console.log(myMap.get('noKey1')); // Output: undefined

console.log("\nTest the iterator methods");
var keysIterator = myMap.keys();
var valuesIterator = myMap.values();
var entriesIterator = myMap.entries();

console.log("\nTest the 'keys' iterator method");
console.log("Map.prototype.keys() iterator");
var result = null;
while (!(result = keysIterator.next()).done) {
    console.log(result.value);
};
/*
key1
key2
key3
*/

console.log("\nTest the 'values' iterator method");
console.log("Map.prototype.values() iterator");
var result = null;
while (!(result = valuesIterator.next()).done) {
    console.log(result.value);
};
/*
11
22
33
*/

console.log();

console.log("\nTest the 'entries' iterator method");
console.log("Map.prototype.entries() iterator"); // Output: key1: value1, key2: value2, key3: value3
var result = null;
while (!(result = entriesIterator.next()).done) {
    console.log(result.value);
};
/*
["key1", 11]
["key2", "22"]
["key3", 33]
*/

console.log("\nTest the 'toArray' method");
console.log("toArray method");
console.log(myMap.toArray()); // Output: [["key1", "value1"], ["key2", "value2"], ["key3", "value3"]]

console.log("\nTest the 'toString' method");
console.log("toString method");
console.log(myMap.toString()); // Output: Map: <[key1: 11], [key2: "22"], [key3: 33]>

console.log("\nTest the 'forEach' method");
console.log("forEach method");
myMap.forEach(function (value, key) {
    console.log(key + ' ==> ' + value);
});
/* Output:
key1 ==> 11
key2 ==> 22
key3 ==> 33
*/


// Test cases for keyOf
console.log("\nTests for Map.prototype.keyOf")
var map = new Map();
map.set(1, 'one');
map.set(2, 'two');
map.set(3, 'three');
map.set(4, null);
map.set(5, NaN);
map.set(6, Infinity);
map.set(7, 'one');

console.log(map.keyOf('one')); // Output: 1
console.log(map.keyOf('two')); // Output: 2
console.log(map.keyOf('four')); // Output: undefined

// Edge cases
console.log(map.keyOf(undefined)); // Output: undefined
console.log(map.keyOf(null)); // Output: 4
console.log(map.keyOf(NaN)); // Output: 5
console.log(map.keyOf(Infinity)); // Output: 6
console.log(map.keyOf(0)); // Output: undefined
console.log(map.keyOf('1')); // Output: undefined (value is '1', not 1)


// Tests for Map.prototype.some
console.log("\nTests for Map.prototype.some")
// Test case 1: Callback returns true for at least one value
var map1 = new Map();
map1.set(1, "apple");
map1.set(2, "banana");
map1.set(3, "cherry");

var result1 = map1.some(function (value) {
    return value.length > 5;
});

console.log(result1); // Output: true

// Test case 2: Callback returns false for all values
var map2 = new Map();
map2.set(1, "apple");
map2.set(2, "banana");
map2.set(3, "cherry");

var result2 = map2.some(function (value) {
    return value === "banana";
});
console.log(result2); // Output: true
var result2 = map2.some(function (value) {
    return value === "mango";
});
console.log(result2); // Output: false

// Test case 3: Callback throws an error
var map3 = new Map();
map3.set(1, "apple");
map3.set(2, "banana");
map3.set(3, "cherry");

try {
    map3.some("not a function");
} catch (error) {
    console.log(error.message); // Output: Missing callback function
}



// Tests for Map.prototype.every
console.log("\nTests for Map.prototype.every")
// Test case 1: Callback returns true for all entries
var map1 = new Map();
map1.set('key1', 'value1');
map1.set('key2', 'value2');

var result1 = map1.every(function (value, key) {
    return value.length > 0;
});

console.log(result1); // Expected output: true

// Test case 2: Callback returns false for at least one entry
var map2 = new Map();
map2.set('key1', 'value1');
map2.set('key2', '');

var result2 = map2.every(function (value, key) {
    return value.length > 0;
});

console.log(result2); // Expected output: false

// Test case 3: Callback throws an error
var map3 = new Map();
map3.set('key1', 'value1');
map3.set('key2', 'value2');

try {
    var result3 = map3.every(null);
} catch (error) {
    console.log(error.message); // Expected output: "Missing callback function"
}



// Tests for Map.prototype.filter
console.log("\nTests for Map.prototype.filter")

var map = new Map();
map.set('a', 1);
map.set('b', 2);
map.set('c', 3);

var filteredMap = map.filter(function (value, key) {
    return value > 1;
});

console.log("\n" + filteredMap.toString()); // Map: <[b: 2], [c: 3]>
console.log(filteredMap.size); // 2
console.log(filteredMap.get('a')); // undefined
console.log(filteredMap.get('b')); // 2
console.log(filteredMap.get('c')); // 3

filteredMap = map.filter(function (value, key) {
    return key === 'a';
});

console.log("\n" + filteredMap.toString()); // Map: <[a: 1]>
console.log(filteredMap.size); // 1
console.log(filteredMap.get('a')); // 1
console.log(filteredMap.get('b')); // undefined
console.log(filteredMap.get('c')); // undefined

filteredMap = map.filter(function (value, key) {
    return this.indexOf(key) !== -1;
}, ['a', 'c']);

console.log("\n" + filteredMap.toString()); // Map: <[a: 1], [c: 3]>
console.log(filteredMap.size); // 2
console.log(filteredMap.get('a')); // 1
console.log(filteredMap.get('b')); // undefined
console.log(filteredMap.get('c')); // 3


// Tests for Map.prototype.mapValues
console.log("\nTests for Map.prototype.mapValues")
// Create a new Map
var map = new Map();
map.set('key1', 1);
map.set('key2', 2);
map.set('key3', 3);

// Test case 1: Multiply each value by 2
var multipliedMap = map.mapValues(function (value) {
    return value * 2;
});
console.log(multipliedMap.get('key1')); // Output: 2
console.log(multipliedMap.get('key2')); // Output: 4
console.log(multipliedMap.get('key3')); // Output: 6

// Test case 2: Append ' - processed' to each value
var processedMap = map.mapValues(function (value) {
    return value + ' - processed';
});
console.log(processedMap.get('key1')); // Output: '1 - processed'
console.log(processedMap.get('key2')); // Output: '2 - processed'
console.log(processedMap.get('key3')); // Output: '3 - processed'

// Test case 3: Use a custom `this` value
var thisArg = {
    multiplier: 10
};
var customMap = map.mapValues(function (value) {
    return value * this.multiplier;
}, thisArg);
console.log(customMap.get('key1')); // Output: 10
console.log(customMap.get('key2')); // Output: 20
console.log(customMap.get('key3')); // Output: 30


// Tests for Map.prototype.mapKeys
console.log("\nTests for Map.prototype.mapKeys")
var map = new Map();
map.set("a", 1).set("bb", 2).set("ccc", 3);

// Test 1: map keys to their uppercase equivalent
var newMap = map.mapKeys(function (key) {
    return key.toUpperCase();
});
console.log(newMap); // Map: <[A: 1], [BB: 2], [CCC: 3]>

// Test 2: map keys to their ASCII code
newMap = map.mapKeys(function (key) {
    return key.charCodeAt(0);
});
console.log(newMap); // Map: <[97: 1], [98: 2], [99: 3]>

// Test 3: map keys to their length (all keys have length 1)
newMap = map.mapKeys(function (key) {
    return key.length;
});
console.log(newMap); // Map: <[1: 1], [2: 2], [3: 3]>

// Edge case 1: callback function returns non-unique keys
var newMap = map.mapKeys(function (key) {
    return "x";
});
console.log(newMap); // Map: <[x: 3]>

// Edge case 2: callback function returns non-string, non-numeric keys
newMap = map.mapKeys(function (key) {
    return { key: key };
});
console.log(newMap); // Map: <[{key: "a"}: 1], [{key: "bb"}: 2], [{key: "ccc"}: 3]>

// Edge case 3: Map is empty
map = new Map();
newMap = map.mapKeys(function (key) {
    return key;
});
console.log(newMap.size); // 0


// Tests for Map.prototype.reduce
console.log("\nTests for Map.prototype.reduce")
// Test case 1: Reduce Map values to a sum
var map1 = new Map();
map1.set('a', 1).set('b', 2).set('c', 3);
var sum = map1.reduce(function (accumulator, value) {
    return accumulator + value;
}, 0);
console.log("Test 1: " + sum); // Output: 6

// Test case 2: Reduce Map values to a string concatenation
var map2 = new Map();
map2.set('a', 'Hello').set('b', 'World').set('c', '!');
var str = map2.reduce(function (accumulator, value) {
    return accumulator + value;
}, '');
console.log("Test 2: " + str); // Output: 'HelloWorld!'

// Test case 3: Reduce an empty Map without initial value
var map3 = new Map();
try {
    map3.reduce(function (accumulator, value) {
        return accumulator + value;
    });
} catch (error) {
    console.log("Test 3: " + error); // Output: Error: Map.reduce(): Empty Map without an initial value
}

// Test case 4: Reduce with different initial value
var map4 = new Map();
map4.set('a', 1).set('b', 2).set('c', 3);
var product = map4.reduce(function (accumulator, value) {
    return accumulator * value;
}, 1);
console.log("Test 4: " + product); // Output: 6

// Test case 5: Reduce Map with only one entry var
map5 = new Map()
map5.set('a', 1);
var sumSingleEntry = map5.reduce(function (accumulator, value) { return accumulator + value; });
console.log("Test 5: " + sumSingleEntry); // Output: 1

// Test case 6: Reduce Map without providing an initial value
var map6 = new Map();
map6.set('a', 1).set('b', 2).set('c', 3);
try {
    console.log("Test 6: " + map6.reduce(function (accumulator, value) { return accumulator + value; }));
}
catch (error) {
    console.log("Test 6: " + error); // Output: 6
}

// Test case 7: Reduce Map with undefined as initial value
var map7 = new Map();
map7.set('a', 1).set('b', 2).set('c', 3);
var sumWithUndefinedInitialValue = map7.reduce(function (accumulator, value) { return accumulator + value; }, undefined);
console.log("Test 7: " + sumWithUndefinedInitialValue); // Output: 6

// Test case 8: Reduce Map with null as initial value
var map8 = new Map();
map8.set('a', 1).set('b', 2).set('c', 3);
var sumWithNullInitialValue = map8.reduce(function (accumulator, value) { return accumulator + value; }, null);
console.log("Test 8: " + sumWithNullInitialValue); // Output: 6

// Test case 9: Reduce Map with non-function callback
var map9 = new Map();
map9.set('a', 1).set('b', 2).set('c', 3);
try {
    map9.reduce("invalid callback", 0);
}
catch (error) {
    console.log("Test 9: " + error); // Output: Error: Map.reduce(): Callback must be a function
}

// Test case 10: Reduce Map with callback that returns undefined
var map10 = new Map();
map10.set('a', 1).set('b', 2).set('c', 3);
try {
    map10.reduce(function (accumulator, value) { // Do something but return undefined
    }, 0);
} catch (error) {
    console.log("Test 10: " + error); // Output: Error: Map.reduce(): Reducer function returns an invalid value
}


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



// Map.prototype.setAll()
console.log("\nTests Map.prototype.setAll() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3'], ['key4', 'value4']];
var myMap = Map.from(arr)
console.log(myMap.setAll([['key5', 'value5'], ['key6', 'value6'], ['key7', 'value7'], ['key8', 'value8']]))
// <[key1: "value1"], [key2: "value2"], [key3: "value3"], [key4: "value4"], [key5: "value5"], [key6: "value6"], [key7: "value7"], [key8: "value8"]>
myMap.clear();
console.log(myMap.setAll());	// Map: <>
console.log(myMap.setAll([1, 2]));	// Map: <>
console.log(myMap.setAll([[3, 4]]));	// Map: <[3: 4]>
myMap.clear();
console.log(myMap.setAll([[]]));	// Map: <>

// Map.prototype.setEach()
console.log("\nTests Map.prototype.setEach() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'srf'], ['key4', 'value4']];
var brr = [['key3', 'qwerer'], ['key4', 'dsgsdf'], ['key5', 'jhg'], ['key6', 'mmvvbm']];
var myMap = Map.from(arr);
console.log(myMap.setEach(brr, function (value, key) { return !myMap.has(key) }, myMap));
// Map: <[key1: "value1"], [key2: "value2"], [key3: "srf"], [key4: "value4"], [key5: "jhg"], [key6: "mmvvbm"]>
console.log();

myMap.clear();
var myMap = Map.from(arr);
console.log(myMap.setEach(brr, function (value, key) { return myMap.has(key) }, myMap));
// Map: <[key1: "value1"], [key2: "value2"], [key3: "qwerer"], [key4: "dsgsdf"]>
console.log();

myMap.clear();
var myMap = Map.from(arr);
console.log(myMap.setEach(brr, function (value, key) { return (myMap.keyOf('srf') === key) }, myMap));
// Map: <[key1: "value1"], [key2: "value2"], [key3: "qwerer"], [key4: "value4"]>



// Map.prototype.deleteAll()
console.log("\nTests Map.prototype.deleteAll() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3'], ['key4', 'value4']];
var myMap = new Map.from(arr)
console.log(myMap.deleteAll('key2', 'key3', 'wrongkey')); // Map: <[key1: "value1"], [key4: "value4"]>
console.log(myMap.deleteAll('')); // Map: <[key1: "value1"], [key4: "value4"]>
console.log(myMap.deleteAll(null)); // Map: <[key1: "value1"], [key4: "value4"]>

// Map.prototype.deleteEach()
console.log("\nTests Map.prototype.deleteEach() method")

var filterFunc = function (val, ky) {
    return (ky === 'key3' || val === 'value1');
};

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3'], ['key4', 'value4']];
var myMap = Map.from(arr)
console.log(myMap.deleteEach(filterFunc)); // Map: <[key2: "value2"], [key4: "value4"]>

// Map.prototype.merge()
console.log("\nTests Map.prototype.merge() method")

var arr = [['key1', 'value1'], ['key2', 'value2']];
var myMap = Map.from(arr);
var other = new Map([['key1', 'value3'], ['key2', 'value4']]);
console.log(myMap.merge(other)); // Map: <[key1: "value3"], [key2: "value4"]>

// Map.prototype.groupBy()
const inventory = [
    { name: "asparagus", type: "vegetables", quantity: 9 },
    { name: "bananas", type: "fruit", quantity: 5 },
    { name: "goat", type: "meat", quantity: 23 },
    { name: "cherries", type: "fruit", quantity: 12 },
    { name: "fish", type: "meat", quantity: 22 },
];

const result = Map.groupBy(inventory, function (value, key) { return value.quantity < 6 ? "restock" : "sufficient" });
console.log(result.get("restock"));
console.log();
console.log(result);
// [{ name: "bananas", type: "fruit", quantity: 5 }]

const inventoryMap = new Map()
inventory.forEach(function (value, key) { inventoryMap.set(key, value); return true })
console.log("\r" + inventoryMap.size);

const result2 = Map.groupBy(inventoryMap, function (x) { return x.type })
console.log("\r" + result2.get("meat").toString());

const result3 = Map.groupBy(inventoryMap, function (x) { return (x.quantity) })
console.log("\r" + result3.toString());