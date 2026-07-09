# Number Polyfills for ExtendScript
This package provides a collection of polyfills to add support for several Number methods and constants not natively available in ExtendScript, an extended form of ECMAScript 3. These polyfills allow developers to use modern JavaScript Number functionalities, enhancing compatibility and making scripting more efficient in environments like Adobe InDesign scripting.

## Bundle

```javascript
//@include "Number.js"
```

`Number.js` is an include-only bundle. Every method and constant has its own
individually include-able file under `Lib`.

## Included Polyfills

### Number constants

```javascript
Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
Number.MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
Number.EPSILON = Math.pow(2, -52);
```

### Number.isFinite
Checks if a given number is finite.


Parameters: x - The number to calculate the cube root for.
```javascript
// Example usage:
console.log(Number.isFinite(123));        // true
console.log(Number.isFinite(Infinity));   // false
console.log(Number.isFinite(-Infinity));  // false
console.log(Number.isFinite(NaN));        // false
console.log(Number.isFinite('123'));      // false
console.log(Number.isFinite(undefined));  // false

```

### Number.isInteger
Check if the given value is an integer.


```javascript
// Example usage
console.log(isInteger(0));        // true
console.log(isInteger(1.5));      // false
console.log(isInteger(123));      // true
console.log(isInteger(-123));     // true
console.log(isInteger('123'));    // false
console.log(isInteger(NaN));      // false
console.log(isInteger(Infinity)); // false
console.log(isInteger(-Infinity));// false
```

### Number.isNaN
Checks if the given value is NaN (Not a Number).

```javascript
// Example usage
console.log(Number.isNaN(NaN));      // true
console.log(Number.isNaN(123));      // false
console.log(Number.isNaN('123'));    // false
console.log(Number.isNaN('NaN'));    // false
console.log(Number.isNaN(undefined)); // false
```
### Number.isSafeInteger
Checks if the given value is a safe integer.


```javascript
// Example usage
console.log(Number.isSafeInteger(0));                  // true
console.log(Number.isSafeInteger(Math.pow(2, 53)));    // false, because it's outside the safe integer range
console.log(Number.isSafeInteger(Math.pow(2, 53) - 1));// true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)); // false
console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1)); // false
```

### Number.parseInt
Wrapper for the global `parseInt()` function with Node-compatible default
radix handling. When `radix` is missing or `0`, decimal is used except for
`0x`/`0X` hex prefixes.

```javascript
console.log(Number.parseInt("42"));        // 42
console.log(Number.parseInt("  -42px"));  // -42
console.log(Number.parseInt("0x10"));     // 16
console.log(Number.parseInt("010"));      // 10 in Node
console.log(Number.parseInt("101", 2));   // 5
```

### Number.parseFloat
Wrapper for the global `parseFloat()` function.

```javascript
console.log(Number.parseFloat("3.14"));       // 3.14
console.log(Number.parseFloat("  -3.14px"));  // -3.14
console.log(Number.parseFloat("Infinity"));   // Infinity
console.log(Number.parseFloat("0x10"));       // 0
```

## Usage
To use these polyfills, simply include this script in your ExtendScript project before using any of the polyfilled Number methods. The polyfills check if the method already exists before defining it, ensuring that they do not override native implementations in environments that already support these features.

```javascript
// Include the polyfills in your script
//@include "path/to/Number/Number.js"
...
```

Individual files can also be included from `Lib`.

## Tests
Run `Test/tests-Number.js` in ESTK or Node. The harness disables native Number
methods so the project implementations are tested directly, while Node is used
as a convenient behavior reference.

Current Node checkpoint: **8 passed, 0 failed**.

## Compatibility
These polyfills are designed for use in ExtendScript, which is based on ECMAScript 3. They have been tested in Adobe InDesign scripting environments but should be compatible with any ExtendScript environment.

## License
This project is open - source and available under the MIT License.Feel free to use, modify, and distribute this code as part of your own projects.
