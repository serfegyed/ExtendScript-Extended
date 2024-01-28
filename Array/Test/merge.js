// Test Merge Sorted Arrays
console.assert(
    [1, 2, 3].merge([4, 5, 6]).join(',') === '1,2,3,4,5,6',
    'Merging sorted arrays should work correctly'
);
console.log([1, 2, 3].merge([4, 5, 6]).join(','));

// Test Merge Non-Sorted Arrays (should just concatenate)
console.assert(
    [3, 1, 2].merge([6, 4, 5]).join(',') === '3,1,2,6,4,5',
    'Merging non-sorted arrays should concatenate without sorting'
);
console.log([3, 1, 2].merge([6, 4, 5]).join(','));

// Test Merge Two Non-Sparse Arrays
var array1 = [1, 2, 3];
var array2 = [4, 5, 6];
console.assert(
    array1.merge(array2).join(',') === '1,2,3,4,5,6',
    'Merging two non-sparse arrays should concatenate correctly'
);
console.log(array1);

// Test Merge with an Empty Array
var array1 = [1, 2, 3];
var array3 = [];
console.assert(
    array1.merge(array3).join(',') === '1,2,3',
    'Merging with an empty array should leave the original array unchanged'
);
console.log(array1);

// Test Merge Arrays with Different Types
var array2 = [4, 5, 6];
var array4 = ['a', 'b', 'c'];
console.assert(
    array2.merge(array4).join(',') === '4,5,6,a,b,c',
    'Merging arrays with different types should concatenate correctly'
);
console.log(array2);

// Test Merge Sparse Array with Non-Sparse Array
var sparseArray = new Array(3);
sparseArray[0] = 1; // sparseArray is now [ <2 empty slots>, 1]
var nonSparseArray = [2, 3];
console.assert(
    sparseArray.merge(nonSparseArray).join(',') === '1,2,3,,',
    'Merging sparse array with non-sparse array should handle empty slots correctly'
);
console.log(sparseArray);

// Test Merge Two Sparse Arrays
var sparseArray1 = new Array(2);
sparseArray1[0] = 4; // sparseArray1 is now [<1 empty slot>, 4]
var sparseArray2 = new Array(3);
sparseArray2[0] = 5; // sparseArray2 is now [<2 empty slots>, 5]
console.assert(
    sparseArray1.merge(sparseArray2).join(',') === '4,5,,,',
    'Merging two sparse arrays should handle empty slots correctly'
);
console.log(sparseArray1);

// Test Merge Sparse Array with Empty Array
var sparseArray = new Array(3);
sparseArray[0] = 1; // sparseArray is now [1, <2 empty slots>]
var emptyArray = [];
console.assert(
    sparseArray.merge(emptyArray).join(',') === '1,,',
    'Merging sparse array with empty array should maintain sparse array structure'
);
console.log(sparseArray);

// Test Merge Non-Sparse Array with Sparse Array
var nonSparseArray = [2, 3];
var sparseArray = new Array(3);
sparseArray[0] = 1; // sparseArray is now [1, <2 empty slots>]
console.assert(
    nonSparseArray.merge(sparseArray).join(',') === '1,2,3,,',
    'Merging non-sparse array with sparse array should handle empty slots correctly'
);
console.log(nonSparseArray);
