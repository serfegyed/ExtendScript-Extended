
# Math Polyfills for ExtendScript
This package provides a collection of polyfills to add support for several Math methods not natively available in ExtendScript, an extended form of ECMAScript 3. These polyfills allow developers to use modern JavaScript Math functionalities, enhancing compatibility and making scripting more efficient in environments like Adobe InDesign scripting.

## Included Polyfills

### Math.cbrt
Calculates the cube root of a given number.

Parameters: x - The number to calculate the cube root for.  
Returns: cube root of the input number.
```javascript
console.log(Math.cbrt(-Infinity)); // -Infinity
console.log(Math.cbrt(-1)); // -1
console.log(Math.cbrt(-0)); // -0
console.log(Math.cbrt(0)); // 0
console.log(Math.cbrt(1)); // 1
console.log(Math.cbrt(2)); // 1.2599210498948732
console.log(Math.cbrt(Infinity)); // Infinity
console.log(Math.cbrt(NaN))	// NaN
console.log(Math.cbrt("27"))	// 3
console.log(Math.cbrt("-27"))	// -3
```

### Math.log10 
Calculates the base 10 logarithm of a number.

Parameters: x - The number to calculate the logarithm for.  
Returns: The base 10 logarithm of the input number.

```javascript
console.log(Math.log10(-2)); // NaN
console.log(Math.log10(-0)); // -Infinity
console.log(Math.log10(0)); // -Infinity
console.log(Math.log10(1)); // 0
console.log(Math.log10(2)); // 0.3010299956639812
console.log(Math.log10(100000)); // 5
console.log(Math.log10(Infinity)); // Infinity
```

### Math.sign
Calculates the sign of a number.

Parameters: x - The number to calculate the sign for.  
Returns:
```javascript
console.log(Math.sign(3));    // Expected output: 1
console.log(Math.sign(-3));   // Expected output: -1
console.log(Math.sign(0));    // Expected output: 0
console.log(Math.sign(-0));   // Expected output: -0, but in ESTK 0 as it doesn't support -0
console.log(Math.sign(NaN));  // Expected output: NaN
console.log(Math.sign("3"));  // Expected output: 1
console.log(Math.sign("-3")); // Expected output: 1
``` 
### Math.sum
Calculates the sum of numbers in a given list of arguments or an array.

Parameters: A comma-separated list of numbers or a single array.
Returns: The sum of the numbers.

```javascript
console.log(Math.sum(1, 2, 3, 4, 5, 3, 2, 1)); // Expected output: 21
console.log(Math.sum([1, 2, 3, 4, 5, 3, 2, 1])); // Expected output: 21
console.log(Math.sum([1, [2, 3], [4, [5, [[3, 2, 1]]]]])); // Expected output: 21
console.log(Math.sum([1, , 3])); // Expected output: 4
console.log(Math.sum([])); // Expected output: 0
console.log(Math.sum()); // Expected output: 0
console.log(Math.sum([1, 'two', 3, null, 5, undefined, '6', true])); // Expected output: 9, ignoring non-number elements
```
### Math.trunc 
Truncates the decimal part of a number, returning the integer part only.

Parameters: v - The number to truncate.  
Returns: The truncated integer part of the given number.
```javascript
console.log(Math.trunc(-Infinity)); // -Infinity
console.log(Math.trunc("-1.123")); // -1
console.log(Math.trunc(-0.123)); // -0
console.log(Math.trunc(-0)); // -0
console.log(Math.trunc(0)); // 0
console.log(Math.trunc(0.123)); // 0
console.log(Math.trunc(12.34)); // 12
console.log(Math.trunc(Infinity)); // Infinity
console.log(Math.trunc(NaN)); // NaN
console.log(Math.trunc(0.123456e3)); // 123
```
### Math.median
Calculates the median of numbers in a given list of arguments or an array.

Parameters: A comma-separated list of numbers or a single array.
Returns: The median of the numbers.
```javascript
// Example usage
console.log(Math.median(1, 3, 3, 6, 7, 8, 9)); // Expected output: 6
console.log(Math.median([1, 3, 3, 6, 7, 8, 9])); // Expected output: 6
console.log(Math.median(1, 3, 3, 6, 7, 8)); // Expected output: 4.5
console.log(Math.median([1, 3, 3, 6, 7, 8])); // Expected output: 4.5
console.log(Math.median([0])); // Expected output: 0
console.log(Math.median([1])); // Expected output: 1

console.log(Math.median([])); // Expected output: NaN
console.log(Math.median()); // Expected output: NaN
console.log(Math.median(NaN)); // Expected output: NaN

console.log(Math.median('string', 'other string')); // Expected output: NaN
console.log(Math.median('1', '3', '3', '6', '7', '8')); // Expected output: 18 because ('3' + '6') / 2.0 === 18 ;)
```


## Usage
To use these polyfills, simply include this script in your ExtendScript project before using any of the polyfilled Math methods.The polyfills check if the method already exists before defining it, ensuring that they do not override native implementations in environments that already support these features.

```javascript
// Include the polyfills in your script
#include "path/to/Math.cbrt.js"
#include "path/to/Math.log10.js"
#include "path/to/Math.trunc.js"

...
```
Now, you can safely use Math.trunc, Math.log10, and Math.cbrt in your ExtendScript code as if they were natively supported:

```javascript
var truncatedValue = Math.trunc(4.9); // Returns 4
var logValue = Math.log10(100); // Returns 2
var cubeRootValue = Math.cbrt(27); // Returns 3

...
```
## Compatibility
These polyfills are designed for use in ExtendScript, which is based on ECMAScript 3. They have been tested in Adobe InDesign scripting environments but should be compatible with any ExtendScript environment.

## License
This project is open - source and available under the MIT License.Feel free to use, modify, and distribute this code as part of your own projects.