const array1 = ['a', 'b', 'c', 'd', 'e'];

// Copy to index 0 the element at index 3
$.writeln(array1.copyWithin(0, 3, 4));
// Expected output: Array ["d", "b", "c", "d", "e"]

// Copy to index 1 all elements from index 3 to the end
$.writeln(array1.copyWithin(1, 3));
// Expected output: Array ["d", "d", "e", "d", "e"]

$.writeln([1, 2, 3, 4, 5].copyWithin(2));
// [1, 2, 1, 2, 3]; move all elements to the right by 2 positions

$.writeln([1, 2, 3, 4, 5].copyWithin(0, 3));
// [4, 5, 3, 4, 5]

$.writeln([1, 2, 3, 4, 5].copyWithin(0, 3, 4));
// [4, 2, 3, 4, 5]

$.writeln([1, 2, 3, 4, 5].copyWithin(-2, -3, -1));
// [1, 2, 3, 3, 4]

/**********************************************************************/
const arrayLike = {
    length: 5,
    3: 1,
};
$.writeln(Array.prototype.copyWithin.call(arrayLike, 0, 3));
// { '0': 1, '3': 1, length: 5 }
$.writeln(Array.prototype.copyWithin.call(arrayLike, 3, 1));
// { '0': 1, length: 5 }
// The '3' property is deleted because the copied source is an empty slot