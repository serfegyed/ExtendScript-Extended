
# Math Polyfills for ExtendScript
This package provides a collection of polyfills to add support for several Math methods not natively available in ExtendScript, an extended form of ECMAScript 3. These polyfills allow developers to use modern JavaScript Math functionalities, enhancing compatibility and making scripting more efficient in environments like Adobe InDesign scripting.

## Included Polyfills
### Math.trunc 
Truncates the decimal part of a number, returning the integer part only.

Parameters: v - The number to truncate.  
Returns: The truncated integer part of the given number.
            
### Math.log10 
Calculates the base 10 logarithm of a number.

Parameters: x - The number to calculate the logarithm for.  
Returns: The base 10 logarithm of the input number.

### Math.cbrt
Calculates the cube root of a given number.

Parameters: x - The number to calculate the logarithm for.  
Returns: The base 10 logarithm of the input number.

## Usage
To use these polyfills, simply include this script in your ExtendScript project before using any of the polyfilled Math methods.The polyfills check if the method already exists before defining it, ensuring that they do not override native implementations in environments that already support these features.

```javascript
// Include the polyfills in your script
#include "path/to/math-polyfills.jsx"
```
Now, you can safely use Math.trunc, Math.log10, and Math.cbrt in your ExtendScript code as if they were natively supported:

```javascript
var truncatedValue = Math.trunc(4.9); // Returns 4
var logValue = Math.log10(100); // Returns 2
var cubeRootValue = Math.cbrt(27); // Returns 3
```
## Compatibility
These polyfills are designed for use in ExtendScript, which is based on ECMAScript 3. They have been tested in Adobe InDesign scripting environments but should be compatible with any ExtendScript environment.

## License
This project is open - source and available under the MIT License.Feel free to use, modify, and distribute this code as part of your own projects.