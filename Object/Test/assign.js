const target = {};
const source1 = { b: 4, c: 5 };
const source2 = { a: undefined, b: null, d: 'name' };

const returnedTarget = Object.assign(target, source1, source2);

$.writeln(target.toString());
// Expected output: {b: null, c: 5, a: undefined, d: name}

$.writeln(returnedTarget === target);
// Expected output: true
