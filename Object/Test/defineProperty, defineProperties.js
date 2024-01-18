// Test

const object1 = {};

Object.defineProperties(object1, {name: {value: 'Toby'}, age: {value: 24}});
$.writeln(object1.toString());
// Expected output: {name: Toby, age: 24}

Object.defineProperty(object1, 'age', {value: 42});
$.writeln(object1.toString());
// Expected output: {name: Toby, age: 42}

Object.defineProperty(object1, 'breed', {value: 'goblin'});
$.writeln(object1.toString());
// Expected output: {name: Toby, age: 42, breed: goblin}