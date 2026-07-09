
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

### Math.log2
Calculates the base 2 logarithm of a number.

Parameters: x - The number to calculate the logarithm for.  
Returns: The base 2 logarithm of the input number.

```javascript
console.log(Math.log2(-1)); // NaN
console.log(Math.log2(-0)); // -Infinity
console.log(Math.log2(0)); // -Infinity
console.log(Math.log2(1)); // 0
console.log(Math.log2(2)); // 1
console.log(Math.log2(1024)); // 10
```

### Math.log1p
Calculates the natural logarithm of 1 plus a number.

Parameters: x - The number to calculate `log(1 + x)` for.  
Returns: The natural logarithm of 1 plus the input number.

```javascript
console.log(Math.log1p(-2)); // NaN
console.log(Math.log1p(-1)); // -Infinity
console.log(Math.log1p(-0)); // -0
console.log(Math.log1p(0)); // 0
console.log(Math.log1p(1)); // 0.6931471805599453
console.log(Math.log1p(1e-8)); // 9.999999950000001e-9
```

### Math.expm1
Calculates `e` raised to a number, minus 1.

Parameters: x - The exponent.  
Returns: `Math.exp(x) - 1`, with better precision for small values.

```javascript
console.log(Math.expm1(-Infinity)); // -1
console.log(Math.expm1(-1)); // -0.6321205588285577
console.log(Math.expm1(-0)); // -0
console.log(Math.expm1(0)); // 0
console.log(Math.expm1(1)); // 1.718281828459045
console.log(Math.expm1(1e-8)); // 1.0000000050000001e-8
```

### Math.hypot
Calculates the square root of the sum of squares of its arguments.

Parameters: A comma-separated list of numbers.  
Returns: The Euclidean norm of the given values.

```javascript
console.log(Math.hypot(3, 4)); // 5
console.log(Math.hypot()); // 0
console.log(Math.hypot(Infinity, 1)); // Infinity
console.log(Math.hypot(NaN, 1)); // NaN
console.log(Math.hypot(3, "4")); // 5
```

### Math.clz32
Counts leading zero bits in the 32-bit unsigned integer conversion of a value.

Parameters: value - The value to convert and inspect.  
Returns: The number of leading zero bits.

```javascript
console.log(Math.clz32(0)); // 32
console.log(Math.clz32(1)); // 31
console.log(Math.clz32(1000)); // 22
console.log(Math.clz32(0xffffffff)); // 0
console.log(Math.clz32("16")); // 27
```

### Math.imul
Performs C-like 32-bit integer multiplication.

Parameters: a, b - The two multiplicands.  
Returns: The signed 32-bit multiplication result.

```javascript
console.log(Math.imul(2, 4)); // 8
console.log(Math.imul(-1, 8)); // -8
console.log(Math.imul(0xffffffff, 5)); // -5
console.log(Math.imul(0x7fffffff, 2)); // -2
```

### Math.sign
Calculates the sign of a number.

Parameters: x - The number to calculate the sign for.  
Returns:
```javascript
console.log(Math.sign(3));    // Expected output: 1
console.log(Math.sign(-3));   // Expected output: -1
console.log(Math.sign(0));    // Expected output: 0
console.log(Math.sign(-0));   // Expected output: -0
console.log(Math.sign(NaN));  // Expected output: NaN
console.log(Math.sign("3"));  // Expected output: 1
console.log(Math.sign("-3")); // Expected output: -1
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
### Math.mean
Calculate the mean of an array or across a specified dimension.

Parameters: A comma-separated list of numbers or a single array and an optional dimension (0 or 1).  
Returns: The mean value or an array of mean values.

```javascript
// Example usage
console.log('Mean of a list of numbers:', Math.mean(2, 5, 6, 3, 1, 7)); // Should return 4
console.log(Math.mean(1, 3, 3, 6, 7, 8, 9)); // Expected output: 5.285714285714286
console.log('Mean of a single array:', Math.mean([2, 5, 6, 3, 1, 7])); // Should return 4
console.log(Math.mean([1, 3, 3, 6, 7, 8, 9])); // Expected output: 5.285714285714286
console.log('Mean of a mixed array:', Math.mean([2, "five", 6, "three", 1, 7])); // Should return NaN

console.log('Mean of flattened array:', Math.mean([[2, 5], [6, 3], [1, [7]]])); // Should return 4
console.log('Mean across dimension 0 (raws):', Math.mean([[2, 5], [6, 3], [1, 7]], 0)); // Should return [3, 5]
console.log('Mean across dimension 1 (columns):', Math.mean([[2, 5], [6, 3], [1, 7]], 1)); // Should return [3.5, 4.5, 4]

try {
    console.log('Mean across dimension 1 (columns):', Math.mean([[2, 5], [6, 3], [1, 7, 9]], 1)); // Error (non-uniform array)
} catch (e) {
    console.log('Error:', e.message);
};

try {
    console.log('Mean across dimension 0 (raws):', Math.mean([[[2, 5], [6, 3], [1, 7]]], 0)); // Error (too many dimensions)
} catch (e) {
    console.log('Error:', e.message);
};
```


## Usage
To use all Math polyfills, include the bundle file before using any of the
polyfilled Math methods. The bundle is include-only: it contains ordered
`//@include` directives and does not copy implementation bodies.

```javascript
//@include "path/to/Math/math.js"

...
```
Individual implementations live in `Lib` and can also be included directly:

```javascript
//@include "path/to/Math/Lib/Math.cbrt.js"
//@include "path/to/Math/Lib/Math.clz32.js"
//@include "path/to/Math/Lib/Math.expm1.js"
//@include "path/to/Math/Lib/Math.hypot.js"
//@include "path/to/Math/Lib/Math.imul.js"
//@include "path/to/Math/Lib/Math.log1p.js"
//@include "path/to/Math/Lib/Math.log10.js"
//@include "path/to/Math/Lib/Math.log2.js"
//@include "path/to/Math/Lib/Math.trunc.js"
```

Now, you can safely use Math.trunc, Math.log10, and Math.cbrt in your
ExtendScript code as if they were natively supported:

```javascript
var truncatedValue = Math.trunc(4.9); // Returns 4
var logValue = Math.log10(100); // Returns 2
var cubeRootValue = Math.cbrt(27); // Returns 3

...
```

## Tests
Run `Test/tests-Math.js` in ESTK or Node. The harness disables native standard
Math methods and loads `math.js` so the project implementations and bundle
order are tested directly, while Node is used as a convenient behavior
reference.

Current Node checkpoint: **19 passed, 0 failed**.

## Compatibility
These polyfills are designed for use in ExtendScript, which is based on ECMAScript 3. They have been tested in Adobe InDesign scripting environments but should be compatible with any ExtendScript environment.

## License
This project is open - source and available under the MIT License.Feel free to use, modify, and distribute this code as part of your own projects.
