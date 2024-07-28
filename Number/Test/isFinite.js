// Example usage:
console.log(Number.isFinite(123));        // true
console.log(Number.isFinite(Infinity));   // false
console.log(Number.isFinite(-Infinity));  // false
console.log(Number.isFinite(NaN));        // false
console.log(Number.isFinite('123'));      // false
console.log(Number.isFinite(undefined));  // false
console.log();

console.log(isFinite(123));        // true
console.log(isFinite(Infinity));   // false
console.log(isFinite(-Infinity));  // false
console.log(isFinite(NaN));        // false
console.log(isFinite('123'));      // true
console.log(isFinite(undefined));  // false