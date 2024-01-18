// Calling Object.group() on array object
const array = [
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 },
    { name: 'Bob', age: 25 },
];
$.writeln("\nCalling Object.group() on Array object" + "\n" + Object.groupBy(array, function (x) { return x.age }));

// Calling Object.group() on array of numbers
const narr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
$.writeln("\nCalling Object.group() on Array of numbers" + "\n" + Object.groupBy(narr, function (x) { return (x % 2 === 0 ? "Even" : "Odd") }));


// Calling Object.group() on String object
const str = "Hovanscsina";
$.writeln("\nCalling Object.group() on String object" + "\n" + Object.groupBy(str, function (x) { return x === x.toUpperCase() ? "Upper" : "Lower" }));

// Calling Object.group() on Map object
const arr = [[1, { name: 'John' }], [2, { name: 'Jane' }], [3, { name: 'Bob' }]];
const map = new Map(arr);
$.writeln("\nCalling Object.group() on Map object" + "\n" + Object.groupBy(map, function (x) { return (x.name === "Bob" ? "Bob's record" : "Others") }));

// Calling Object.group() on Set object
const brr = ['John', 'Jane', 'Bob'];
const set = new Set(brr);
$.writeln("\nCalling Object.group() on Set object" + "\n" + Object.groupBy(set, function (x) { return (x[0] + " initial") }));

// Calling Object.group() on non-array but array-like object
const arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 4,
};

function mod(x) { return (x % 2 === 0 ? "Even" : "Odd") };
$.writeln("\nCalling Object.group() on non-array but array-like object" + "\n" + Object.groupBy(arrayLike, mod));
// {Even: [2, 4], Odd: [3]}


try {
    $.writeln(Object.groupBy(28, function (x) { return x }))
} catch (error) {
    $.writeln("Error: 'Object.groupBy(): works on iterables only.'")
};
