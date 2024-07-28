// Example usage:
console.log(Number.isNaN(NaN));      // true
console.log(Number.isNaN(123));      // false
console.log(Number.isNaN('123'));    // false
console.log(Number.isNaN('NaN'));    // false
console.log(Number.isNaN(undefined)); // false
console.log();


console.log(isNaN('11')) // false
console.log(isNaN('ccc')) // true
console.log(isNaN('a')) // true
console.log(isNaN(NaN)) // true
console.log();

console.log(Number.isNaN('11')) // false
console.log(Number.isNaN('ccc')) // false
console.log(Number.isNaN('a')) // false
console.log(Number.isNaN(NaN)) // true