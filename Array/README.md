# ExtendScript-Array

ES6+ Array functions for ExtendScript (ES3)

These are possible implementation of the modern JavaScript built-in Array functions.

## The available methods

### Standard methods

- `at()` - Returns the item at that index, allowing for positive and negative integers
- `copyWithin()` - Copies part of an array to another location in the same array.
- `entries()` - Returns a new array iterator object that contains the key/value pairs for each index in the array.
- `every()` - Tests whether _all_ elements in the array pass the test
- `fill()` - Changes all elements in an array to a static value, from a start index to an end index
- `filter()` - Creates a new array with all elements that pass the test
- `find()` - Returns the first element in the provided array that satisfies the provided testing function
- `findIndex()` - Returns the index of the first element in an array that satisfies the provided testing function
- `findLast()` - Returns the value of the last element that satisfies the provided testing function
- `findLastIndex()` - Returns the index of the last element that satisfies the provided testing function
- `flat()` - Flattens nested arrays
- `flatMap()` - Maps each element to an array using a callback function and then flattens the resulting array.
- `forEach()` - Executes a provided function once per array element
- `from()` - Creates a new, shallow-copied Array instance from an array-like or iterable object
- `includes()` - Returns `true` if the given element exists
- `indexOf()` - Returns the first index at the element can be found
- `isArray()` - Tests if object is an array
- `keys()` - Returns a new array iterator object that contains the keys for each index in the array.
- `lastIndexOf()` - Returns the last index at the element can be found
- `map()` - Calls a provided function on every element and returns a new array
- `of()` - Creates a new Array instance from a variable number of arguments
- `reduce()` - Applies a function on each value of the array as to reduce it to a single value
- `reduceRight()` - Applies a function against two values of the array (from right-to-left)
- `some()` - Tests whether _some_ element pasts the test
- `toReversed()` - Copying version of reverse()
- `toSorted()`- Copying version of sort()
- `toSpliced()` - Copying version of splice()
- `toString()` - A neater version of toString()
- `values()` - Returns a new array iterator object that contains the values of each index in the array
- `with()` - The copying version of using the bracket notation to change the value of a given index

### Non-standard methods

*(They are mostly methods in some stage of tc39 proposal phase)*

- `clear()` - Removes all array elements.
- `compact()` - Returns a copy of the array with all falsy values removed
- `first()` - Returns the first item of this array
- `groupBy()` - Groups the elements according to the string values returned by a callback function
- `indexAfter()` - Does what it says
- `insert()` - Inserts an element into the array at given index. Returns a new enlarged array
- `isEmpty()` - Checks is parameter is an empty array
- `isSorted()` - Checks if the array is sorted
- `last()` - Returns the last item of this array
- `max()` - Returns the maximum value in an array
- `merge()` - Merges multiple arrays into the current array.
- `min()` - The minimum value in an array
- `pluck()` - Quickly pluck a single attribute from an array of objects
- `random()` - Generates a random element from the array
- `reject()` - The inverse of `filter`. Returns all elements that DON'T pass the test.
- `remove()` - Removes element at given index. Returns a new shrinked array.
- `rotate()` - Rotates an array
- `sum()` - The sum of all array values
- `unique()` - A` function that returns an array with only unique elements.

## Externals

- `Object.deepCopy()` - Method implemented in the 'ExtendScript-Object' repository that makes a deep copy of an array.
