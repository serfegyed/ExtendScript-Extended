// Tests for Map.prototype.mapKeys
console.log("\nTests for Map.prototype.mapKeys")
var map = new Map();
map.set("a", 1).set("bb", 2).set("ccc", 3);

// Test 1: map keys to their uppercase equivalent
var newMap = map.mapKeys(function (key) {
    return key.toUpperCase();
});
console.log(newMap); // Map: <[A: 1], [BB: 2], [CCC: 3]>

// Test 2: map keys to their ASCII code
newMap = map.mapKeys(function (key) {
    return key.charCodeAt(0);
});
console.log(newMap); // Map: <[97: 1], [98: 2], [99: 3]>

// Test 3: map keys to their length (all keys have length 1)
newMap = map.mapKeys(function (key) {
    return key.length;
});
console.log(newMap); // Map: <[1: 1], [2: 2], [3: 3]>

// Edge case 1: callback function returns non-unique keys
var newMap = map.mapKeys(function (key) {
    return "x";
});
console.log(newMap); // Map: <[x: 3]>

// Edge case 2: callback function returns non-string, non-numeric keys
newMap = map.mapKeys(function (key) {
    return { key: key };
});
console.log(newMap); // Map: <[{key: "a"}: 1], [{key: "bb"}: 2], [{key: "ccc"}: 3]>

// Edge case 3: Map is empty
map = new Map();
newMap = map.mapKeys(function (key) {
    return key;
});
console.log(newMap.size); // 0