// Mapping an array of numbers using a function containing an argument
const numbers = [1, 4, 9];
const doubles = numbers.map(function(num) {
    return num * 2
});

$.writeln(doubles); // [2, 8, 18]
$.writeln(numbers); // [1, 4, 9]


// Calling map() on non-array objects
const arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 4,
};
$.writeln(Array.prototype.map.call(arrayLike, function(x) {
    return x * x
}));
// [ 4, 9, 16 ]


// Using map to reformat objects in an array
const kvArray = [{
        key: 1,
        value: 10
    },
    {
        key: 2,
        value: 20
    },
    {
        key: 3,
        value: 30
    },
];

var reformattedArray = kvArray.map(function(obj) {
    var rObj = {};
    rObj[obj.key] = obj.value;
    return rObj;
});

$.writeln(reformattedArray); // [{ 1: 10 }, { 2: 20 }, { 3: 30 }]
$.writeln(kvArray);
// [
//   { key: 1, value: 10 },
//   { key: 2, value: 20 },
//   { key: 3, value: 30 }
// ]


// Using map() on sparse arrays
$.writeln(
    [1, , 3].map(function(x, index) {
        $.writeln("Visit " + index);
        return x * 2;
    })
);
// Visit 0
// Visit 2
// [2, empty, 6]


// Using parseInt() with map()
$.writeln(["1", "2", "3"].map(parseInt));
// While one might expect [1, 2, 3], the actual result is [1, NaN, NaN].


// Mapped array contains undefined
var filteredNumbers = [1, 2, 3, 4].map(function(num, index) {
    if (index < 3) {
        return num
    }
});
$.writeln(filteredNumbers);

// index goes from 0, so the filterNumbers are 1,2,3 and undefined.
// filteredNumbers is [1, 2, 3, undefined]
// numbers is still [1, 2, 3, 4]