// Tests for Map.prototype.mapValues
console.log("\nTests for Map.prototype.mapValues")
// Create a new Map
var map = new Map();
map.set('key1', 1);
map.set('key2', 2);
map.set('key3', 3);

// Test case 1: Multiply each value by 2
var multipliedMap = map.mapValues(function (value) {
    return value * 2;
});
console.log(multipliedMap.get('key1')); // Output: 2
console.log(multipliedMap.get('key2')); // Output: 4
console.log(multipliedMap.get('key3')); // Output: 6

// Test case 2: Append ' - processed' to each value
var processedMap = map.mapValues(function (value) {
    return value + ' - processed';
});
console.log(processedMap.get('key1')); // Output: '1 - processed'
console.log(processedMap.get('key2')); // Output: '2 - processed'
console.log(processedMap.get('key3')); // Output: '3 - processed'

// Test case 3: Use a custom `this` value
var thisArg = {
    multiplier: 10
};
var customMap = map.mapValues(function (value) {
    return value * this.multiplier;
}, thisArg);
console.log(customMap.get('key1')); // Output: 10
console.log(customMap.get('key2')); // Output: 20
console.log(customMap.get('key3')); // Output: 30