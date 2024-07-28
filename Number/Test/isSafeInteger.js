// Example usage of isSafeInteger
console.log(Number.isSafeInteger(0));                  // true
console.log(Number.isSafeInteger(Math.pow(2, 53)));    // false, because it's outside the safe integer range
console.log(Number.isSafeInteger(Math.pow(2, 53) - 1));// true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)); // false
console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1)); // false