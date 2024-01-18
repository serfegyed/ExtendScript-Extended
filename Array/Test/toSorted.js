// Sorting an array
const months = ["Mar", "Jan", "Feb", "Dec"];
const sortedMonths = months.toSorted();
$.writeln(sortedMonths); // ['Dec', 'Feb', 'Jan', 'Mar']
$.writeln(months); // ['Mar', 'Jan', 'Feb', 'Dec']

const values = [1, 10, 21, 2];
const sortedValues = values.toSorted(function(a, b) {
    return a - b
});
$.writeln(sortedValues); // [1, 2, 10, 21]
$.writeln(values); // [1, 10, 21, 2]


// Using toSorted() on sparse arrays
$.writeln(["a", "c", , "b"].toSorted()); // ['a', 'b', 'c', undefined]
$.writeln([, undefined, "a", "b"].toSorted()); // ["a", "b", undefined, undefined]


// Calling toSorted() on non-array objects
const arrayLike = {
    length: 3,
    unrelated: "foo",
    0: 5,
    2: 4,
    3: 3, // ignored by toSorted() since length is 3
};
$.writeln(Array.prototype.toSorted.call(arrayLike));
// {length: 3, unrelated: "foo", 0: 4, 2: undefined, 3: 3, 1: 5}
// The ExtendScript's sort() method is non-standard 
// The output would be: [4, 5, undefined]
// 