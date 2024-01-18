// Test 1: Array
const arr = [1, 2, 3, 4];
$.writeln(Object.keys(arr)); // ["0", "1", "2", "3"]
$.writeln(Object.values(arr)); // [1, 2, 3, 4]
$.writeln(Object.entries(arr)); // [["0", 1], ["1", 2], ["2", 3], ["3", 4]]

// Test 2: String
const str = "foobar";
//~ $.writeln(Object.keys(str)); 
//~ $.writeln(Object.values(str)); // TypeError
//~ $.writeln(Object.entries(str));

// Test 3: Object
const obj = {
    foo: "bar",
    baz: 42
};
$.writeln(Object.keys(obj)); // ["foo", "baz"]
$.writeln(Object.values(obj)); // ["bar", 42]
$.writeln(Object.entries(obj)); // [["foo", "bar"], ["baz", 42]]

// Array-like object
const arrayLikeObj1 = {
    0: "a",
    1: "b",
    2: "c"
};
$.writeln(Object.keys(arrayLikeObj1)); // ["0", "1", "2"]
$.writeln(Object.values(arrayLikeObj1)); // ["a", "b", "c"]
$.writeln(Object.entries(arrayLikeObj1)); // [["0", "a"], ["1", "b"], ["2", "c"]]

// Array-like object with random key ordering
const arrayLikeObj2 = {
    100: "a",
    2: "b",
    7: "c"
};
$.writeln(Object.keys(arrayLikeObj2)); // ["100", "2", "7"]
$.writeln(Object.values(arrayLikeObj2)); // ["a", "b", "c"]
$.writeln(Object.entries(arrayLikeObj2)); // [["100", "a"], ["2", "b"], ["7", "c"]]