# ExtendScript-Set

A lightweight Set class extension for Adobe ExtendScript.

This Set class is an implementation of the JavaScript built-in Set object.

## Standard methods for the Set object

* `add(value)` - Adds a value to the set.
* `clear()` - Clears all element in the set and sets the size to 0.
* `delete(value)` - Deletes the given value from the set.
* `entries()` - Returns a new set iterator object that contains the value/value pairs for each element in the set.
* `forEach()` - Iterates through each element of the set and applies a callback function.
* `has(value)` - Checks if the given value exists in the set object or not.
* `keys()` - The keys() method is an alias for the values() method.
* `size()` - Returns the number of elements in the set.
* `values()` - Returns a new set iterator object that contains the values for each element in the set.

## Standard property for the Set object

* `size` - Returns the number of elements in the set.

## Non-standard methods
*(They are mostly (but not exclusively) Array-like methods mostly in some stage of tc39 proposal phase)*

* `addAll()` - Adds elements defined as parameters to the set.
* `addEach()` - Adds elements defined as parameters to the set based on the result of a callback function
* `deleteAll()` - Removes elements defined as parameters from the set.
* `deleteEach()` - Removes elements defined by a callback function from the set.
* `every()` - Checks if all elements in the set satisfy the provided callback function
* `filter()` - Filters the elements of a Set object based on a provided callback function
* `find()` - Finds the first element in the set that satisfies the provided testing function
* `from()` - Adds values from iterable(s) and/or primitive(s)to the Set.
* `isEmpty()` - Determines whether the given parameter is an empty Set.
* `isSet()` - Checks if an object is a Set.
* `join()` - Joins all elements of a Set into a string with a given separator
* `map()` - Applies a callback function to each element in the set and returns a new set with the results.
* `reduce()` - Reduce the set to a single value by applying a callback function
* `some()` - Checks if any element in the set satisfies the provided callback function
* `toArray()` - Returns an array representation of the set.
* `toString()` - Returns a string representation of the set.

## Set composition

* `union()` - Returns a new Set with the union of the two sets
* `difference()` - Calculates the difference between the current set and another set.
* `symmetricDifference()` - Calculates the symmetric difference between this set and another set.
* `intersection()` - Calculates the intersection of two sets.
* `isSubsetOf()` - Checks if the current set is a subset of another set
* `isSupersetOf()` - Checks if the current set is a superset of another set
* `isDisjointFrom()` - Checks if the current set is a disjoint of another set
* `isEqual()` - Checks if the current set is equal to another set

## Externals

* `Object.isEmpty()` - Checks if an object is empty.
* `sameValueZero()` - Determines if two values are equal using the SameValueZero algorithm.
* `isPrimitive()` - Check if the given value is a primitive data type or null/undefined.
* `isArrayLike()` - Checks if a given object is array-like.