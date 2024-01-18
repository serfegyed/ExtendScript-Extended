// Tests
var inventory = [{
    name: "asparagus",
    type: "vegetables",
    quantity: 5
},
{
    name: "bananas",
    type: "fruit",
    quantity: 0
},
{
    name: "goat",
    type: "meat",
    quantity: 23
},
{
    name: "cherries",
    type: "fruit",
    quantity: 5
},
{
    name: "fish",
    type: "meat",
    quantity: 22
},
];

// Basic example
function typeFunc(x) {
    return x.type
};
const result = inventory.group(typeFunc);
$.writeln(result);

// Create groups inferred from values in one or more properties of the elements
function stockFunc(x) {
    return x.quantity > 5 ? "ok" : "restock"
};
const result2 = inventory.group(stockFunc);
$.writeln(result2);

// Using group() on sparse arrays
function func(x) {
    return x
};
$.writeln([1, , 3].group(func)); // { 1: [1], undefined: [undefined], 3: [3] }

// Calling group() on non-array objects
const arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 4,
};

function mod(x) {
    return x % 2
};
$.writeln(Array.prototype.group.call(arrayLike, mod));
// { 0: [2, 4], 1: [3] }

// Using thisArg with the group() method
var obj = {
    property: 'value',
    callback: function (element) {
        // Use this.property within the callback function
        return element + this.property;
    }
};

const arr = ['a', 'b', 'c'];
$.writeln(arr.group(obj.callback, obj));
// result is { avalue: ['a'], bvalue: ['b'], cvalue: ['c'] }