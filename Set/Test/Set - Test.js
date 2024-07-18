// Tests ***********************************************************
// Create a new set
var mySet = new Set();
console.log("Initialised without elements: " + mySet.toString());
console.log("Size: " + mySet.size); // should print 0

var arr = [1, 2, 3, 4, 5];
var mySet = new Set(arr);
console.log("Initialised with array : " + arr.toString());
console.log(mySet.toString());
console.log("Size: " + mySet.size); // should print 5

// Test adding values to the set
console.log(mySet.add("foo"));
console.log(mySet.add("bar").add("baz")); // can chaining
console.log("Size: " + mySet.size); // should print 8
console.log();

// Test adding several elements
var mySet = new Set();
console.log(mySet.from(["foo", "bar", "baz"]));
console.log("Size: " + mySet.size); // should print 3
var mySet2 = new Set();
console.log(mySet2.from(["qux", "qix", "qax"]));
console.log(mySet2.from(mySet));
console.log("Size: " + mySet2.size); // should print 6
console.log();

// Test checking if values are in the set
console.log("Check 'foo': " + mySet.has("foo")); // should print true
console.log("Check 'qux': " + mySet.has("qux")); // should print false
console.log();

// Test deleting values from the set
console.log("Delete 'bar': ", mySet.delete("bar")); // true
console.log("Size: " + mySet.size); // should print 2
console.log("Has 'bar': " + mySet.has("bar")); // should print false
console.log("Delete 'bar': ", mySet.delete("bar")); // false
console.log();

// Test clearing the set
mySet.clear();
mySet2.clear();
console.log("Cleared set");
console.log("Size: " + mySet.size); // should print 0
console.log("Size: " + mySet2.size); // should print 0
console.log();

// Test iterating over the set with forEach
console.log("Test iterating over the set with forEach");
mySet.add("foo");
mySet.add("bar").add("bar").add("bar").add("bar").add("bar"); // adding multiple times
mySet.add("baz");
mySet.add(NaN).add(NaN); // Trying duplicate NaN
mySet.add(undefined);
mySet.add(null);
mySet.forEach(function (value) {
    console.log("~~~" + value + "~~~");
});
/* should print
    ~~~foo~~~
    ~~~bar~~~
    ~~~baz~~~
    ~~~NaN~~~
    ~~~undefined~~~
    ~~~null~~~
*/
console.log();

// Test converting the set to an array
var array = mySet.toArray();
console.log("toArray(): \n" + array); // should print ["foo", "bar", "baz", NaN, undefined, null]
console.log();

// Test converting the set to a string
console.log("toString(): \n" + mySet.toString()); // should print {"foo", "bar", "baz", NaN, undefined, null}
console.log();

console.log("Test iterating with Set iterators");
// Iterator test: values()
console.log("Set.prototype.values()");
var iterator = mySet.values();
// 1 Using by variable
console.log("1 Using by variable");
var result = iterator.next();
while (!result.done) {
    console.log(result.value);
    result = iterator.next();
}
console.log();

// 2 Direct call
console.log("2 Direct call");
var iterator = mySet.values(); // Must reinitialize again!
var result = undefined;
while (!(result = iterator.next()).done) {
    console.log(result.value);
}
console.log();

console.log("Set.prototype.keys()");
var iterator = mySet.keys();
// Direct usage
var iterator = mySet.keys(); // Must be reinitialize again!
var result = undefined;
while (!(result = iterator.next()).done) {
    console.log(result.value);
}

console.log();
console.log("Set.prototype.entries()");
var iterator = mySet.entries();
// Direct usage
var iterator = mySet.entries(); // Must be reinitialize again!
var result = undefined;
while (!(result = iterator.next()).done) {
    console.log(result.value);
}
/*
    ["foo", "foo"]
    ["bar", "bar"]
    ["baz", "baz"]
    [NaN, NaN]
    [undefined, undefined]
    [null, null]
*/

//~ // Test Set.prototype.from() method
console.log("\nTest Set.prototype.from() method");
var mySet = new Set();
console.log("\nAdd some primitives: " + '1, "2", "string", NaN, null, Infinity, [], {}, undefined');
mySet.from(1, "2", "string", NaN, null, Infinity, [], {}, undefined);
console.log(mySet.toString()); // {1, "2", "string", NaN, null, Infinity, [], {}, undefined}
console.log("Size: " + mySet.size); // should print 9

var mySet = new Set();
var arr = [1, "2", "string", NaN, null, Infinity, [], {}, undefined];
console.log("\nAdd values of array: ");
console.log(arr.toString());
mySet.from(arr);
console.log(mySet.toString()); // {1, "2", "string", NaN, null, Infinity, [], {}, undefined}
console.log("Size: " + mySet.size); // should print 9

var mySet = new Set();
var arr = [1, "2", "string", NaN, null];
var arr2 = [Infinity, [], {}, undefined];
console.log("\nAdd values of two arrays: ");
console.log(arr.toString());
console.log(arr2.toString());
mySet.from(arr, arr2);
console.log(mySet.toString()); // {1, "2", "string", NaN, null, Infinity, [], {}, undefined}
console.log("Size: " + mySet.size); // should print 9

var mySet = new Set();
var myObj = { name: "foo", age: 23, hight: 5.2 };
console.log("\nAdd keys of object: ");
console.log(myObj.toString());	// {name: "foo", age: 23, hight: 5.2}
mySet.from(myObj);
console.log(mySet.toString()); // {"name", "age", "hight"}
console.log("Size: " + mySet.size); // should print 3

console.log("\nAdd another Set: ");
var mySet = new Set(["A", "B", "C", "D"])
console.log(mySet.toString());
var mySet2 = new Set(["C", "D", "E", "F"])
console.log(mySet2.toString());

var myUnion = mySet.from(mySet2);
console.log(myUnion.toString()); //
console.log("Size: " + myUnion.size); // should print 6

var mySet = new Set();
var arrayLike = {
    length: 2,
    0: 2,
    1: 3,
    2: 4,
};
console.log("\nAdd keys of array-like object: ");
console.log(arrayLike.toString());	// {length: 2, A: 2, key: 3, 2: 4}
mySet.from(arrayLike);
console.log(mySet.toString()); // {2, 3}
console.log("Size: " + mySet.size); // should print 2


// Test Set.prototype.some() method
console.log("\nTest Set.prototype.some() method");

// Test 1: Check if any element is divisible by 2
var set1 = new Set([1, 2, 3, 4, 5]);
var result1 = set1.some(function (item) {
    return item % 2 === 0;
});
console.log(result1); // Output: true

// Test 2: Check if any element is a string
var set2 = new Set([1, 2, 3, "four", 5]);
var result2 = set2.some(function (item) {
    return typeof item === "string";
});
console.log(result2); // Output: true

// Test 3: Check if any element is greater than 10
var set3 = new Set([1, 2, 3, 4, 5]);
var result3 = set3.some(function (item) {
    return item > 10;
});
console.log(result3); // Output: false

// Test Set.prototype.every() method
console.log("\nTest Set.prototype.every() method");

// Test 1: Check if every element is divisible by 2
var set1 = new Set([1, 2, 3, 4, 5]);
var result1 = set1.every(function (item) {
    return item % 2 === 0;
});
console.log(result1); // Output: false

// Test 2: Check if every element is a string
var set2 = new Set([1, 2, 3, "four", 5]);
var result2 = set2.every(function (item) {
    return typeof item === "number";
});
console.log(result2); // Output: false

// Test 3: Check if every element is less than 10
var set3 = new Set([1, 2, 3, 4, 5]);
var result3 = set3.every(function (item) {
    return item < 10;
});
console.log(result3); // Output: true

// Test Set.prototype.filter() method
console.log("\nTest Set.prototype.filter() method");
// Create a new Set
var set = new Set();

// Add some elements to the Set
set.add(1).add(2).add(3);

// Define the callback function
function callback(value) {
    return value > 1;
}

// Call the filter method
var filteredSet = set.filter(callback);
console.log(filteredSet);
// Output: {2, 3}

// Test Set.prototype.map() method
console.log("\nTest Set.prototype.map() method");

// Test case 1: Map the Set values to their squares
var set1 = new Set();
set1.add(1).add(2).add(3);
console.log("Test case 1: Map the Set values to their squares");
console.log(set1);	// {1, 2, 3}
var mappedSet1 = set1.map(function (value) {
    return value * value;
});
console.log("Mapped Set 1: \n", mappedSet1); // Should print: Mapped Set 1: {1, 4, 9}

// Test case 2: Map the Set values to their lengths
var set2 = new Set();
set2.add("apple").add("banana").add("orange");
console.log("\nTest case 2: Map the Set values to their lengths");
console.log(set2);	// {"apple", "banana", "orange"}
var mappedSet2 = set2.map(function (fruit) {
    return fruit.length;
});
console.log("Mapped Set 2: \n", mappedSet2); // Should print: Mapped Set 2: {5, 6}

// Test case 3: Map the Set values using a custom callback and thisArg
var set3 = new Set();
set3.add(10).add(20).add(30);
console.log("\nTest case 3: Map the Set values using a custom callback and thisArg");
console.log(set3);	// {10, 20, 30}
var thisArg = { multiplier: 3, };
var mappedSet3 = set3.map(function (value) {
    return this.multiplier * value;
}, thisArg);
console.log("Mapped Set 3: \n", mappedSet3); // Should print: Mapped Set 3: {30, 60, 90}

// Test Set.prototype.find() method
console.log("\nTest Set.prototype.find() method");
// Create a Set and add some values
var set = new Set();
set.add(1).add(2).add(3).add(4);
console.log(set); // {1, 2, 3, 4}
// Define the callback function to find the first even number in the Set
function findEven(value) {
    return value % 2 === 0;
}
console.log("Search for the first even number");
// Use the find() method to search for the first even number
var result = set.find(findEven);

console.log("Result:", result); // Should print: Result: 2

// Test Set.prototype.reduce() method
console.log("\nTest Set.prototype.reduce() method");
// Test case 1: Regular reduction with numbers
console.log("\nTest case 1: Regular reduction with numbers");
var set1 = new Set();
set1.add(1).add(2).add(3).add(4);

function sumReducer(accumulator, currentValue) {
    return accumulator + currentValue;
}

var result1 = set1.reduce(sumReducer, 0);
console.log("Result 1: ", result1); // Should print: Result 1: 10 (1 + 2 + 3 + 4)

// Test case 2: Regular reduction with strings
console.log("\nTest case 2: Regular reduction with strings");
var set2 = new Set();
set2.add("hello").add(" ").add("world");

function concatReducer(accumulator, currentValue) {
    return accumulator + currentValue;
}

var result2 = set2.reduce(concatReducer, "");
console.log("Result 2: ", result2); // Should print: Result 2: hello world

// Test case 3: Regular reduction with arrays
console.log("\nTest case 3: Regular reduction with arrays");
var set3 = new Set();
var arr = [1, 2];
var brr = [3, 4];
var crr = [5, 6];
set3.add(arr).add(brr).add(crr);

function mergeArraysReducer(acc, cValue) {
    return acc.concat(cValue);
}

var result3 = set3.reduce(mergeArraysReducer, []);
console.log("Result 3: ", result3); // Should print: Result 3: [1, 2, 3, 4, 5, 6]

// Test case 4: Type mismatch with numbers and strings
console.log("\nTest case 4: Type mismatch with numbers and strings");
var set4 = new Set();
set4.add(1).add("hello");

try {
    var result4 = set4.reduce(sumReducer, 0);
    console.log("Result 4: ", result4); // Should throw TypeError
} catch (error) {
    console.log("Result 4: ", error.message); // Should print: Result 4: Type mismatch in Set.reduce(). All elements must be of the same type.
}

// Test case 5: Type mismatch with array and number
console.log("\nTest case 5: Type mismatch with array and number");
var set5 = new Set();
set5.add([1, 2]).add(3);

try {
    var result5 = set5.reduce(mergeArraysReducer, []);
    console.log("Result 5: ", result5); // Should throw TypeError
} catch (error) {
    console.log("Result 5: ", error.message); // Should print: Result 5: Type mismatch in Set.reduce(). All elements must be of the same type.
}

// Test case 6: Empty Set without an initial value
console.log("\nTest case 6: Empty Set without an initial value");
var set6 = new Set();

try {
    var result6 = set6.reduce(sumReducer);
    console.log("Result 6: ", result6); // Should throw TypeError
} catch (error) {
    console.log("Result 6: ", error.message); // Should print: Result 6: Empty Set without an initial value
}

// Test case 7: Empty Set with an initial value
console.log("\nTest case 7: Empty Set with an initial value");
var set7 = new Set();

var initialValue = 100;

var result7 = set7.reduce(sumReducer, initialValue);
console.log("Result 7: ", result7); // Should print: Result 7: 100 (Initial value is returned)

// Test Set.prototype.union() method
console.log("\nTest Set.prototype.union() method");

var setA = new Set(["A", "B", "C", "D", "E"]);
var setB = new Set(["C", "D", "E", "F", "G"]);
console.log("setA: " + setA.toString());
console.log("setB: " + setB.toString());
var setC = setA.union(setB);
console.log("Union: " + setC); // Output: {{A, B, C, D, E, F, G}}

// Check dependency
console.log("\nChecking dependency");
setA.delete("A");
setB.delete("G");
console.log(setC); // Output: {{A, B, C, D, E, F, G}}
setC.delete("D");
console.log("setA: " + setA.toString()); // setA: {B, C, D, E}
console.log("setB: " + setB.toString()); // setB: {C, D, E, F}

console.log("\nChecking empty set");
var setD = new Set();
var setE = setD.union(setC);
console.log(setE); // {A, B, C, E, F, G}

console.log("\nChecking two empty sets");
var setD = new Set();
var setE = new Set();
console.log(setD.union(setE)); // {}

console.log("\nChecking wrong parameter");
var setD = new Set();
var setE = "This is not a Set!";
try {
    console.log(setD.union(setE));
} catch (error) {
    console.log(error.message); // Should print: Set.union: wrong parameter type.
}

// Test Set.prototype.difference() method
console.log("\nTest Set.prototype.difference() method");
var setA = new Set(["A", "B", "C", "D", "E"]);
var setB = new Set(["C", "D", "E", "F", "G"]);
console.log("setA: " + setA.toString());
console.log("setB: " + setB.toString());
var setC = setA.difference(setB);
console.log("Difference: " + setC); // Output: {A, B}

// Test Set.prototype.symmetricDifference() method
console.log("\nTest Set.prototype.symmetricDifference() method");
var setA = new Set(["A", "B", "C", "D", "E"]);
var setB = new Set(["C", "D", "E", "F", "G"]);
console.log("setA: " + setA.toString());
console.log("setB: " + setB.toString());
var setC = setA.symmetricDifference(setB);
console.log("SymmetricDifference: " + setC); // Output: {A, B, F, G}

// Test Set.prototype.intersection() method
console.log("\nTest Set.prototype.intersection() method");
var setA = new Set(["A", "B", "C", "D", "E"]);
var setB = new Set(["C", "D", "E", "F", "G"]);
console.log("setA: " + setA.toString());
console.log("setB: " + setB.toString());
var setC = setA.intersection(setB);
console.log("Intersection: " + setC); // Output: {C, D, E}

// Test Set.isSet() and Set.isEmpty static methods
console.log("\nTest Set.isSet() static method");
console.log("Parameter is 'number' :" + Set.isSet(28));
console.log("Parameter is 'string' :" + Set.isSet("42"));
console.log("Parameter is 'array' :" + Set.isSet([1, 2]));
console.log("Parameter is 'set' :" + Set.isSet(new Set([1, 2])));

console.log("\nTest Set.isEmpty() static method");
try {
    console.log("Parameter is 'number' :" + Set.isEmpty(0));
} catch (error) {
    console.log("Error: " + error.message);
}
try {
    console.log("Parameter is 'string' :" + Set.isEmpty(false));
} catch (error) {
    console.log("Error: " + error.message);
}
try {
    console.log("Parameter is 'array' :" + Set.isEmpty([]));
} catch (error) {
    console.log("Error: " + error.message);
}
console.log("Parameter is 'set' :" + Set.isEmpty(new Set([1, 2])));
console.log("Parameter is 'set' :" + Set.isEmpty(new Set()));

// Test Set.prototype.isSubsetOf() method
console.log("\nTest Set.prototype.isSubsetOf() method");
var aSet = new Set([1, 2, 3, 4, 5]);
var bSet = new Set([1, 2, 3, 4, 5]);
var cSet = new Set();
var dSet = new Set([2, 3, 4]);
var eSet = new Set();
console.log(aSet.isSubsetOf(bSet)); // Two identical set: true
console.log(bSet.isSubsetOf(aSet)); // They're subset of each other: true
console.log(cSet.isSubsetOf(dSet)); // Empty is subset any Set: true
console.log(dSet.isSubsetOf(aSet)); // Proper subset: true
console.log(aSet.isSubsetOf(dSet)); // false
console.log(dSet.isSubsetOf(eSet)); // false
console.log(cSet.isSubsetOf(eSet)); // Empty is subset empty too: true
try {
    console.log(aSet.isSubsetOf()); // Missing second Set: Error: isSubsetOf(): wrong parameter type
} catch (error) {
    console.log("Error :" + error.message);
}

// Test Set.prototype.isSupersetOf() method
console.log("\nTest Set.prototype.isSupersetOf() method");
console.log(aSet.isSupersetOf(bSet)); // Two identical set: true
console.log(bSet.isSupersetOf(aSet)); // They're superset of each other: true
console.log(cSet.isSupersetOf(dSet)); // Empty is subset any Set: false
console.log(dSet.isSupersetOf(aSet)); // false
console.log(aSet.isSupersetOf(dSet)); // Proper superset: true
console.log(dSet.isSupersetOf(eSet)); // Proper superset: true
console.log(cSet.isSupersetOf(eSet)); // Empty is superset empty too: true

// Test Set.prototype.isDisjointFrom() method
console.log("\nTest Set.prototype.isDisjointFrom() method");
console.log(aSet.isDisjointFrom(bSet)); // Two identical set: false
console.log(bSet.isDisjointFrom(aSet)); // Two identical set: false
console.log(cSet.isDisjointFrom(dSet)); // Empty is disjoint any set: true
console.log(dSet.isDisjointFrom(aSet)); // There are common elements: false
console.log(aSet.isDisjointFrom(dSet)); // There are common elements: false
console.log(dSet.isDisjointFrom(eSet)); // No common elements: true
console.log(cSet.isDisjointFrom(eSet)); // Empty is disjoint empty too: true

// Test Set.prototype.isEqual() method
console.log("\nTest Set.prototype.isEqual() method");
console.log(aSet.isEqual(bSet)); // Two identical set: true
console.log(bSet.isEqual(aSet)); // Two identical set: true
console.log(cSet.isEqual(dSet)); // Empty isn't equal any set: false
console.log(dSet.isEqual(aSet)); // Any set isn't equal empty sets: false
console.log(aSet.isEqual(dSet)); // Sizes are not the same: false
console.log(dSet.isEqual(eSet)); // Sizes are not the same: false
console.log(cSet.isEqual(eSet)); // Empty is equal empty too: true

// Test two empty sets
console.log("\nTest two empty sets");
console.log("isSubsetOf: " + cSet.isSubsetOf(eSet)); // true
console.log("isSupersetOf: " + cSet.isSupersetOf(eSet)); // true
console.log("isDisjointFrom: " + cSet.isDisjointFrom(eSet)); // true
console.log("isEqual: " + cSet.isEqual(eSet)); // true


/**********************************************************/
// Test addAll()
console.log("\n********************** addAll()");
var mySet = new Set();
var arr = [1, 2, 3];
mySet.from(arr);
var brr = [5, 6, 7, 8, 9];
mySet.addAll(brr);
console.log(mySet, mySet.size === 8); // {"1", "2", "3", "5", "6", "7", "8", "9"}true

var mySet = new Set();
var arr = [1, 2, 3];
mySet.from(arr);
var brr = [1, 2, 3, 8, 9];
mySet.addAll(brr);
console.log(mySet, mySet.size === 5); // {"1", "2", "3", "8", "9"}true

var mySet = new Set();
var brr = [];
mySet.addAll(brr);
console.log(mySet, mySet.size === 0); // {}true
console.log();

/*********************************************************/
//Test addEach
console.log("********************** addEach()");
var mySet = new Set();
var arr = [1, 2, 3];
mySet.from(arr);
var brr = [1, 2, 3, 8, 9];
mySet.addEach(brr, function (x) { return mySet.has(x) });
console.log(mySet); //	{"1", "2", "3"}

var mySet = new Set();
var arr = [1, 2, 3];
mySet.from(arr);
var brr = [1, 2, 3, 7, 8, 9];
mySet.addEach(brr, function (x) { return !mySet.has(x) && (x % 2 !== 0) });
console.log(mySet); //	{"1", "2", "3", "7", "9"}
console.log();

/*********************************************************/
// Test deleteAll
console.log("********************** deleteAll()");
var mySet = new Set([1, 2, 3, 4, 5]);
console.log(mySet.deleteAll(2, 3));	//{"1", "4", "5"}
console.log(mySet.size === 3); // true

var mySet = new Set([1, 2, 3]);
console.log(mySet.deleteAll(4, 5));	// {"1", "2", "3"}
console.log(mySet.size === 3); // true
console.log();

/********************************************************/
// Test deleteEach
console.log("********************** deleteEach()");
var mySet = new Set([1, 2, 3, 4, 5]);
console.log(mySet.deleteEach(function (x) { return (x % 2 === 0) }));
console.log(mySet.size === 3); // true

var mySet = new Set([1, 2, 3]);
console.log(mySet.deleteEach(function (x) { return false; })); // No operation
console.log(mySet.size === 3); // true
console.log();

/********************************************************/
// Test join()
console.log("********************** join()");
var mySet = new Set([1, 2, 3]);
console.log(mySet.join('=>')); // 1=>2=>3
console.log(mySet.join() === "1,2,3"); // true
console.log(mySet.join("|") === "1,2,3"); // false

var mySet = new Set();
console.log("->" + mySet.join() + "<-");//-><-
console.log(mySet.join("-") === ""); // true