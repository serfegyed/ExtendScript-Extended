// Tests ***********************************************************
// Create a new set
var mySet = new Set();
$.writeln("Initialised without elements: " + mySet.toString());
$.writeln("Size: " + mySet.size()); // should print 0

var arr = [1, 2, 3, 4, 5];
var mySet = new Set(arr);
$.writeln("Initialised with array : " + arr.toString());
$.writeln(mySet.toString());
$.writeln("Size: " + mySet.size()); // should print 5

// Test adding values to the set
$.writeln(mySet.add("foo"));
$.writeln(mySet.add("bar").add("baz")); // can chaining
$.writeln("Size: " + mySet.size()); // should print 8
$.writeln();

// Test adding several elements
var mySet = new Set();
$.writeln(mySet.from(["foo", "bar", "baz"]));
$.writeln("Size: " + mySet.size()); // should print 3
var mySet2 = new Set();
$.writeln(mySet2.from(["qux", "qix", "qax"]));
$.writeln(mySet2.from(mySet));
$.writeln("Size: " + mySet2.size()); // should print 6
$.writeln();

// Test checking if values are in the set
$.writeln("Check 'foo': " + mySet.has("foo")); // should print true
$.writeln("Check 'qux': " + mySet.has("qux")); // should print false
$.writeln();

// Test deleting values from the set
$.writeln("Delete 'bar': ", mySet.delete("bar")); // true
$.writeln("Size: " + mySet.size()); // should print 2
$.writeln("Has 'bar': " + mySet.has("bar")); // should print false
$.writeln("Delete 'bar': ", mySet.delete("bar")); // false
$.writeln();

// Test clearing the set
mySet.clear();
mySet2.clear();
$.writeln("Cleared set");
$.writeln("Size: " + mySet.size()); // should print 0
$.writeln("Size: " + mySet2.size()); // should print 0
$.writeln();

// Test iterating over the set with forEach
$.writeln("Test iterating over the set with forEach");
mySet.add("foo");
mySet.add("bar").add("bar").add("bar").add("bar").add("bar"); // adding multiple times
mySet.add("baz");
mySet.add(NaN).add(NaN); // Trying duplicate NaN
mySet.add(undefined);
mySet.add(null);
mySet.forEach(function (value) {
    $.writeln("~~~" + value + "~~~");
});
/* should print 
    ~~~foo~~~
    ~~~bar~~~
    ~~~baz~~~
    ~~~NaN~~~
    ~~~undefined~~~
    ~~~null~~~
*/
$.writeln();

// Test converting the set to an array
var array = mySet.toArray();
$.writeln("toArray(): \n" + array); // should print ["foo", "bar", "baz", NaN, undefined, null]
$.writeln();

// Test converting the set to a string
$.writeln("toString(): \n" + mySet.toString()); // should print {"foo", "bar", "baz", NaN, undefined, null}
$.writeln();

$.writeln("Test iterating with Set iterators");
// Iterator test: values()
$.writeln("Set.prototype.values()");
var iterator = mySet.values();
// 1 Using by variable
$.writeln("1 Using by variable");
var result = iterator.next();
while (!result.done) {
    $.writeln(result.value);
    result = iterator.next();
}
$.writeln();

// 2 Direct call
$.writeln("2 Direct call");
var iterator = mySet.values(); // Must reinitialize again!
var result = undefined;
while (!(result = iterator.next()).done) {
    $.writeln(result.value);
}
$.writeln();

$.writeln("Set.prototype.keys()");
var iterator = mySet.keys();
// Direct usage
var iterator = mySet.keys(); // Must be reinitialize again!
var result = undefined;
while (!(result = iterator.next()).done) {
    $.writeln(result.value);
}

$.writeln();
$.writeln("Set.prototype.entries()");
var iterator = mySet.entries();
// Direct usage
var iterator = mySet.entries(); // Must be reinitialize again!
var result = undefined;
while (!(result = iterator.next()).done) {
    $.writeln(result.value);
}
/*
    ["foo", "foo"]
    ["bar", "bar"]
    ["baz", "baz"]
    [NaN, NaN]
    [undefined, undefined]
    [null, null]
*/

// Test Set.prototype.from() method
$.writeln("\nTest Set.prototype.from() method");
var mySet = new Set();
$.writeln("\nAdd some primitives: " + '1, "2", "string", NaN, null, Infinity, [], {}, undefined');
mySet.from(1, "2", "string", NaN, null, Infinity, [], {}, undefined);
$.writeln(mySet.toString()); // {1, "2", "string", NaN, null, Infinity, [], {}, undefined}
$.writeln("Size: " + mySet.size()); // should print 9

var mySet = new Set();
var arr = [1, "2", "string", NaN, null, Infinity, [], {}, undefined];
$.writeln("\nAdd values of array: ");
$.writeln(arr.toString());
mySet.from(arr);
$.writeln(mySet.toString()); // {1, "2", "string", NaN, null, Infinity, [], {}, undefined}
$.writeln("Size: " + mySet.size()); // should print 9

var mySet = new Set();
var myObj = { name: "foo", age: 23, hight: 5.2 };
$.writeln("\nAdd keys of object: ");
$.writeln(myObj.toString());	// {name: "foo", age: 23, hight: 5.2}
mySet.from(myObj);
$.writeln(mySet.toString()); // {"name", "age", "hight"}
$.writeln("Size: " + mySet.size()); // should print 3

// Test Set.prototype.some() method
$.writeln("\nTest Set.prototype.some() method");

// Test 1: Check if any element is divisible by 2
var set1 = new Set([1, 2, 3, 4, 5]);
var result1 = set1.some(function (item) {
    return item % 2 === 0;
});
$.writeln(result1); // Output: true

// Test 2: Check if any element is a string
var set2 = new Set([1, 2, 3, "four", 5]);
var result2 = set2.some(function (item) {
    return typeof item === "string";
});
$.writeln(result2); // Output: true

// Test 3: Check if any element is greater than 10
var set3 = new Set([1, 2, 3, 4, 5]);
var result3 = set3.some(function (item) {
    return item > 10;
});
$.writeln(result3); // Output: false

// Test Set.prototype.every() method
$.writeln("\nTest Set.prototype.every() method");

// Test 1: Check if every element is divisible by 2
var set1 = new Set([1, 2, 3, 4, 5]);
var result1 = set1.every(function (item) {
    return item % 2 === 0;
});
$.writeln(result1); // Output: false

// Test 2: Check if every element is a string
var set2 = new Set([1, 2, 3, "four", 5]);
var result2 = set2.every(function (item) {
    return typeof item === "number";
});
$.writeln(result2); // Output: false

// Test 3: Check if every element is less than 10
var set3 = new Set([1, 2, 3, 4, 5]);
var result3 = set3.every(function (item) {
    return item < 10;
});
$.writeln(result3); // Output: true

// Test Set.prototype.filter() method
$.writeln("\nTest Set.prototype.filter() method");
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
$.writeln(filteredSet);
// Output: {2, 3}

// Test Set.prototype.map() method
$.writeln("\nTest Set.prototype.map() method");

// Test case 1: Map the Set values to their squares
var set1 = new Set();
set1.add(1).add(2).add(3);
$.writeln("Test case 1: Map the Set values to their squares");
$.writeln(set1);	// {1, 2, 3}
var mappedSet1 = set1.map(function (value) {
    return value * value;
});
$.writeln("Mapped Set 1: \n", mappedSet1); // Should print: Mapped Set 1: {1, 4, 9}

// Test case 2: Map the Set values to their lengths
var set2 = new Set();
set2.add("apple").add("banana").add("orange");
$.writeln("\nTest case 2: Map the Set values to their lengths");
$.writeln(set2);	// {"apple", "banana", "orange"}
var mappedSet2 = set2.map(function (fruit) {
    return fruit.length;
});
$.writeln("Mapped Set 2: \n", mappedSet2); // Should print: Mapped Set 2: {5, 6}

// Test case 3: Map the Set values using a custom callback and thisArg
var set3 = new Set();
set3.add(10).add(20).add(30);
$.writeln("\nTest case 3: Map the Set values using a custom callback and thisArg");
$.writeln(set3);	// {10, 20, 30}
var thisArg = { multiplier: 3, };
var mappedSet3 = set3.map(function (value) {
    return this.multiplier * value;
}, thisArg);
$.writeln("Mapped Set 3: \n", mappedSet3); // Should print: Mapped Set 3: {30, 60, 90}

// Test Set.prototype.find() method
$.writeln("\nTest Set.prototype.find() method");
// Create a Set and add some values
var set = new Set();
set.add(1).add(2).add(3).add(4);
$.writeln(set); // {1, 2, 3, 4}
// Define the callback function to find the first even number in the Set
function findEven(value) {
    return value % 2 === 0;
}
$.writeln("Search for the first even number");
// Use the find() method to search for the first even number
var result = set.find(findEven);

$.writeln("Result:", result); // Should print: Result: 2

// Test Set.prototype.reduce() method
$.writeln("\nTest Set.prototype.reduce() method");
// Test case 1: Regular reduction with numbers
$.writeln("\nTest case 1: Regular reduction with numbers");
var set1 = new Set();
set1.add(1).add(2).add(3).add(4);

function sumReducer(accumulator, currentValue) {
    return accumulator + currentValue;
}

var result1 = set1.reduce(sumReducer, 0);
$.writeln("Result 1: ", result1); // Should print: Result 1: 10 (1 + 2 + 3 + 4)

// Test case 2: Regular reduction with strings
$.writeln("\nTest case 2: Regular reduction with strings");
var set2 = new Set();
set2.add("hello").add(" ").add("world");

function concatReducer(accumulator, currentValue) {
    return accumulator + currentValue;
}

var result2 = set2.reduce(concatReducer, "");
$.writeln("Result 2: ", result2); // Should print: Result 2: hello world

// Test case 3: Regular reduction with arrays
$.writeln("\nTest case 3: Regular reduction with arrays");
var set3 = new Set();
var arr = [1, 2];
var brr = [3, 4];
var crr = [5, 6];
set3.add(arr).add(brr).add(crr);

function mergeArraysReducer(acc, cValue) {
    return acc.concat(cValue);
}

var result3 = set3.reduce(mergeArraysReducer, []);
$.writeln("Result 3: ", result3); // Should print: Result 3: [1, 2, 3, 4, 5, 6]

// Test case 4: Type mismatch with numbers and strings
$.writeln("\nTest case 4: Type mismatch with numbers and strings");
var set4 = new Set();
set4.add(1).add("hello");

try {
    var result4 = set4.reduce(sumReducer, 0);
    $.writeln("Result 4: ", result4); // Should throw TypeError
} catch (error) {
    $.writeln("Result 4: ", error.message); // Should print: Result 4: Type mismatch in Set.reduce(). All elements must be of the same type.
}

// Test case 5: Type mismatch with array and number
$.writeln("\nTest case 5: Type mismatch with array and number");
var set5 = new Set();
set5.add([1, 2]).add(3);

try {
    var result5 = set5.reduce(mergeArraysReducer, []);
    $.writeln("Result 5: ", result5); // Should throw TypeError
} catch (error) {
    $.writeln("Result 5: ", error.message); // Should print: Result 5: Type mismatch in Set.reduce(). All elements must be of the same type.
}

// Test case 6: Empty Set without an initial value
$.writeln("\nTest case 6: Empty Set without an initial value");
var set6 = new Set();

try {
    var result6 = set6.reduce(sumReducer);
    $.writeln("Result 6: ", result6); // Should throw TypeError
} catch (error) {
    $.writeln("Result 6: ", error.message); // Should print: Result 6: Empty Set without an initial value
}

// Test case 7: Empty Set with an initial value
$.writeln("\nTest case 7: Empty Set with an initial value");
var set7 = new Set();

var initialValue = 100;

var result7 = set7.reduce(sumReducer, initialValue);
$.writeln("Result 7: ", result7); // Should print: Result 7: 100 (Initial value is returned)

// Test Set.prototype.union() method
$.writeln("\nTest Set.prototype.union() method");

var setA = new Set(["A", "B", "C", "D", "E"]);
var setB = new Set(["C", "D", "E", "F", "G"]);
$.writeln("setA: " + setA.toString());
$.writeln("setB: " + setB.toString());
var setC = setA.union(setB);
$.writeln("Union: " + setC); // Output: {{A, B, C, D, E, F, G}}

// Check dependency
$.writeln("\nChecking dependency");
setA.delete("A");
setB.delete("G");
$.writeln(setC); // Output: {{A, B, C, D, E, F, G}}
setC.delete("D");
$.writeln("setA: " + setA.toString()); // setA: {B, C, D, E}
$.writeln("setB: " + setB.toString()); // setB: {C, D, E, F}

$.writeln("\nChecking empty set");
var setD = new Set();
var setE = setD.union(setC);
$.writeln(setE); // {A, B, C, E, F, G}

$.writeln("\nChecking two empty sets");
var setD = new Set();
var setE = new Set();
$.writeln(setD.union(setE)); // {}

$.writeln("\nChecking wrong parameter");
var setD = new Set();
var setE = "This is not a Set!";
try {
    $.writeln(setD.union(setE));
} catch (error) {
    $.writeln(error.message); // Should print: Set.union: wrong parameter type.
}

// Test Set.prototype.difference() method
$.writeln("\nTest Set.prototype.difference() method");
var setA = new Set(["A", "B", "C", "D", "E"]);
var setB = new Set(["C", "D", "E", "F", "G"]);
$.writeln("setA: " + setA.toString());
$.writeln("setB: " + setB.toString());
var setC = setA.difference(setB);
$.writeln("Difference: " + setC); // Output: {A, B}

// Test Set.prototype.symmetricDifference() method
$.writeln("\nTest Set.prototype.symmetricDifference() method");
var setA = new Set(["A", "B", "C", "D", "E"]);
var setB = new Set(["C", "D", "E", "F", "G"]);
$.writeln("setA: " + setA.toString());
$.writeln("setB: " + setB.toString());
var setC = setA.symmetricDifference(setB);
$.writeln("SymmetricDifference: " + setC); // Output: {A, B, F, G}

// Test Set.prototype.intersection() method
$.writeln("\nTest Set.prototype.intersection() method");
var setA = new Set(["A", "B", "C", "D", "E"]);
var setB = new Set(["C", "D", "E", "F", "G"]);
$.writeln("setA: " + setA.toString());
$.writeln("setB: " + setB.toString());
var setC = setA.intersection(setB);
$.writeln("Intersection: " + setC); // Output: {C, D, E}

// Test Set.isSet() and Set.isEmpty static methods
$.writeln("\nTest Set.isSet() static method");
$.writeln("Parameter is 'number' :" + Set.isSet(28));
$.writeln("Parameter is 'string' :" + Set.isSet("42"));
$.writeln("Parameter is 'array' :" + Set.isSet([1, 2]));
$.writeln("Parameter is 'set' :" + Set.isSet(new Set([1, 2])));

$.writeln("\nTest Set.isEmpty() static method");
try {
    $.writeln("Parameter is 'number' :" + Set.isEmpty(0));
} catch (error) {
    $.writeln("Error: " + error.message);
}
try {
    $.writeln("Parameter is 'string' :" + Set.isEmpty(false));
} catch (error) {
    $.writeln("Error: " + error.message);
}
try {
    $.writeln("Parameter is 'array' :" + Set.isEmpty([]));
} catch (error) {
    $.writeln("Error: " + error.message);
}
$.writeln("Parameter is 'set' :" + Set.isEmpty(new Set([1, 2])));
$.writeln("Parameter is 'set' :" + Set.isEmpty(new Set()));

// Test Set.prototype.isSubset() methods
$.writeln("\nTest Set.prototype.isSubset() method");
var aSet = new Set([1, 2, 3, 4, 5]);
var bSet = new Set([1, 2, 3, 4, 5]);
var cSet = new Set();
var dSet = new Set([2, 3, 4]);
var eSet = new Set();
$.writeln(aSet.isSubset(bSet)); // Two identical set: true
$.writeln(bSet.isSubset(aSet)); // They're subset of each other: true
$.writeln(cSet.isSubset(dSet)); // Empty is subset any Set: true
$.writeln(dSet.isSubset(aSet)); // Proper subset: true
$.writeln(aSet.isSubset(dSet)); // false
$.writeln(dSet.isSubset(eSet)); // false
$.writeln(cSet.isSubset(eSet)); // Empty is subset empty too: true
try {
    $.writeln(aSet.isSubset()); // Missing second Set: Error: isSubset(): wrong parameter type
} catch (error) {
    $.writeln("Error :" + error.message);
}

// Test Set.prototype.isSuperset() methods
$.writeln("\nTest Set.prototype.isSuperset() method");
$.writeln(aSet.isSuperset(bSet)); // Two identical set: true
$.writeln(bSet.isSuperset(aSet)); // They're superset of each other: true
$.writeln(cSet.isSuperset(dSet)); // Empty is subset any Set: false
$.writeln(dSet.isSuperset(aSet)); // false
$.writeln(aSet.isSuperset(dSet)); // Proper superset: true
$.writeln(dSet.isSuperset(eSet)); // Proper superset: true
$.writeln(cSet.isSuperset(eSet)); // Empty is superset empty too: true

// Test Set.prototype.isDisjoint() methods
$.writeln("\nTest Set.prototype.isDisjoint() method");
$.writeln(aSet.isDisjoint(bSet)); // Two identical set: false
$.writeln(bSet.isDisjoint(aSet)); // Two identical set: false
$.writeln(cSet.isDisjoint(dSet)); // Empty is disjoint any set: true
$.writeln(dSet.isDisjoint(aSet)); // There are common elements: false
$.writeln(aSet.isDisjoint(dSet)); // There are common elements: false
$.writeln(dSet.isDisjoint(eSet)); // No common elements: true
$.writeln(cSet.isDisjoint(eSet)); // Empty is disjoint empty too: true

// Test Set.prototype.isEqual() methods
$.writeln("\nTest Set.prototype.isEqual() method");
$.writeln(aSet.isEqual(bSet)); // Two identical set: true
$.writeln(bSet.isEqual(aSet)); // Two identical set: true
$.writeln(cSet.isEqual(dSet)); // Empty isn't equal any set: false
$.writeln(dSet.isEqual(aSet)); // Any set isn't equal empty sets: false
$.writeln(aSet.isEqual(dSet)); // Sizes are not the same: false
$.writeln(dSet.isEqual(eSet)); // Sizes are not the same: false
$.writeln(cSet.isEqual(eSet)); // Empty is equal empty too: true

// Test two empty sets
$.writeln("\nTest two empty sets");
$.writeln("isSubset: " + cSet.isSubset(eSet)); // true
$.writeln("isSuperset: " + cSet.isSuperset(eSet)); // true
$.writeln("isDisjoint: " + cSet.isDisjoint(eSet)); // true
$.writeln("isEqual: " + cSet.isEqual(eSet)); // true


/**********************************************************/
// Test addAll()
$.writeln("********************** addAll()");
var mySet = new Set();
var arr = [1, 2, 3];
mySet.from(arr);
var brr = [5, 6, 7, 8, 9];
mySet.addAll(brr);
$.writeln(mySet, mySet.size() === 8); // {"1", "2", "3", "5", "6", "7", "8", "9"}true

var mySet = new Set();
var arr = [1, 2, 3];
mySet.from(arr);
var brr = [1, 2, 3, 8, 9];
mySet.addAll(brr);
$.writeln(mySet, mySet.size() === 5); // {"1", "2", "3", "8", "9"}true

var mySet = new Set();
var brr = [];
mySet.addAll(brr);
$.writeln(mySet, mySet.size() === 0); // {}true
$.writeln();

/*********************************************************/
//Test addEach
$.writeln("********************** addEach()");
var mySet = new Set();
var arr = [1, 2, 3];
mySet.from(arr);
var brr = [1, 2, 3, 8, 9];
mySet.addEach(brr, function (x) { return mySet.has(x) });
$.writeln(mySet); //	{"1", "2", "3"}

var mySet = new Set();
var arr = [1, 2, 3];
mySet.from(arr);
var brr = [1, 2, 3, 7, 8, 9];
mySet.addEach(brr, function (x) { return !mySet.has(x) && (x % 2 !== 0) });
$.writeln(mySet); //	{"1", "2", "3", "7", "9"}
$.writeln();

//~ var mySet = new Set();
//~ var arr = [1, 2, 3];
//~ mySet.from(arr);
//~ var brr = [1, 2, 3, 8, 9];
//~ mySet.addEach(brr, function(x) { if (mySet.has(x)){mySet.}else{ return ()}});
//~ $.writeln(mySet.has(undefined)); // true

/*********************************************************/
// Test deleteAll
$.writeln("********************** deleteAll()");
var mySet = new Set([1, 2, 3, 4, 5]);
$.writeln(mySet.deleteAll(2, 3));	//{"1", "4", "5"}
$.writeln(mySet.size() === 3); // true

var mySet = new Set([1, 2, 3]);
$.writeln(mySet.deleteAll(4, 5));	// {"1", "2", "3"}
$.writeln(mySet.size() === 3); // true
$.writeln();

/********************************************************/
// Test deleteEach
$.writeln("********************** deleteEach()");
var mySet = new Set([1, 2, 3, 4, 5]);
$.writeln(mySet.deleteEach(function (x) { return (x % 2 === 0) }));
$.writeln(mySet.size() === 3); // true

var mySet = new Set([1, 2, 3]);
$.writeln(mySet.deleteEach(function (x) { return false; })); // No operation
$.writeln(mySet.size() === 3); // true
$.writeln();



/********************************************************/
// Test join()
$.writeln("********************** join()");
var mySet = new Set([1, 2, 3]);
$.writeln(mySet.join('=>'));
$.writeln(mySet.join() === "1,2,3"); // true
$.writeln(mySet.join("|") === "1,2,3"); // true

var mySet = new Set();
$.writeln(mySet.join());	// 1=>2=>3
$.writeln(mySet.join("-") === ""); // true

