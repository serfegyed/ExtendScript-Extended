// Example usage
console.log(isInteger(0));        // true
console.log(isInteger(1.5));      // false
console.log(isInteger(123));      // true
console.log(isInteger(-123));     // true
console.log(isInteger('123'));    // false
console.log(isInteger(NaN));      // false
console.log(isInteger(Infinity)); // false
console.log(isInteger(-Infinity));// false