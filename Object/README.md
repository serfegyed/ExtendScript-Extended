
# ExtendScript-Object

ES6 Object functions for ExtendScript (ES3)

These are possible implementation of the JavaScript built-in Object static methods.

## Built-in Extendscript Object functions (these are for information only, they are not implemented here)

  `hasOwnProperty()`  
  `isPrototypeOf()`  
  `isValid()`  
  `propertyIsEnumerable()`  
  `toLocaleString()`  
  `toSource()`  
  `toString()`  
  `unwatch()`  
  `valueOf()`  
  `watch()`  

## Implemented functions
  
* `Object.assign()`             - Copies all enumerable own properties from source object(s) to target object.  
* `Object.create()`             - Creates a new Object, using an existing object as the prototype.
* `Object.defineProperty()`     - Defines or modifies a property directly on an object.  
* `Object.defineProperties()`   - Defines new or modifies existing properties directly on an object.  
* `Object.entries()`            - Returns an array of a given object's own string-keyed property key-value pairs  
* `Object.fromEntries()`        - Creates a new Object from an array of key-value pairs.The reverse of Object.entries().  
* `Object.getOwnPropertyNames()` - Returns an array of a given object's own enumerable string-keyed property names  
* `Object.groupBy()`            - Groups the items based on the provided callback function.  
* `Object.hasOwn()`             - The preferred method over hasOwnProperty()  
* `Object.is()`                 - Determines whether two values are the same value or both NaN.  
* `Object.keys()`               - Returns an array of a given object's string-keyed property names
* `Object.prototype.toString()` - Returns a string of a given object's own property key-value pairs.  
* `Object.values()`             - Returns an array of a given object's own enumerable string-keyed property values

## Non-standard functions

* `Object.compact()`          - Compacts an object or an array by removing any falsy values.
* `Object.deepCopy()`           - Returns a new `deep copy` of an Object, Array, Date or any types
* `Object.safeDeepCopy()`       - Implements a safe `deep copy` with handling circular references.
* `Object.isCyclic()`           - Detects cyclic references in an object.
* `Object.isEmpty()`            - Tests if a passed object is empty
* `Object.isEquals()`           - Compares two objects for equality.
* `Object.isObject()`           - Tests if a passed data is Object
* `Object.prototype.merge()`    - Merges two Objects and returns a new Object. Handles nested Objects/Arrays.

## Ddependecies

`Array.isArray()`, `isPrimitive()`, `sameValueZero()`
