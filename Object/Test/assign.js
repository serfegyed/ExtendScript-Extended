const target = {};
const source1 = { b: 4, c: 5 };
const source2 = { a: undefined, b: null, d: 'name' };

const returnedTarget = Object.assign(target, source1, source2);
console.log(target.toString());
// Expected output: {b: null, c: 5, a: undefined, d: name}

console.log(returnedTarget === target);
// Expected output: true


// Array input
const arr = ['Car', 'Bike', 'Truck'];
const obj1 = Object.assign({}, arr);
$.writeln(obj1)
//Expected output: {0:'Car', 1:'Bike', 2:'Bike'}

// Merging objects
var o1 = { a: 1 };
var o2 = { b: 2 };
var o3 = { c: 3 };

var obj2 = Object.assign(o1, o2, o3);
console.log(obj2); // { a: 1, b: 2, c: 3 }
console.log(o1); // { a: 1, b: 2, c: 3 }, target object itself is changed.

// Merging objects with same properties
var o1 = { a: 1, b: 1, c: 1 };
var o2 = { b: 2, c: 2 };
var o3 = { c: 3 };

var obj3 = Object.assign({}, o1, o2, o3);
console.log(obj3); // { a: 1, b: 2, c: 3 }

// Primitives will be wrapped to objects
var v1 = "abc";
var v2 = true;
var v3 = 10;

var obj4 = Object.assign({}, v1, null, v2, undefined, v3);
// Primitives will be wrapped, null and undefined will be ignored.
// Note, only string wrappers can have own enumerable properties.
console.log(obj4); // { "0": "a", "1": "b", "2": "c" }