// Tests for Map.prototype.every
console.log("\nTests for Map.prototype.every")
// Test case 1: Callback returns true for all entries
var map1 = new Map();
map1.set('key1', 'value1');
map1.set('key2', 'value2');

var result1 = map1.every(function (value, key) {
    return value.length > 0;
});

console.log(result1); // Expected output: true

// Test case 2: Callback returns false for at least one entry
var map2 = new Map();
map2.set('key1', 'value1');
map2.set('key2', '');

var result2 = map2.every(function (value, key) {
    return value.length > 0;
});

console.log(result2); // Expected output: false

// Test case 3: Callback throws an error
var map3 = new Map();
map3.set('key1', 'value1');
map3.set('key2', 'value2');

try {
    var result3 = map3.every(null);
} catch (error) {
    console.log(error.message); // Expected output: "Missing callback function"
}