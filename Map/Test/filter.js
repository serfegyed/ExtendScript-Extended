// Tests for Map.prototype.filter
console.log("\nTests for Map.prototype.filter")

var map = new Map();
map.set('a', 1);
map.set('b', 2);
map.set('c', 3);

var filteredMap = map.filter(function (value, key) {
    return value > 1;
});

console.log("\n" + filteredMap.toString()); // Map: <[b: 2], [c: 3]>
console.log(filteredMap.size); // 2
console.log(filteredMap.get('a')); // undefined
console.log(filteredMap.get('b')); // 2
console.log(filteredMap.get('c')); // 3

filteredMap = map.filter(function (value, key) {
    return key === 'a';
});

console.log("\n" + filteredMap.toString()); // Map: <[a: 1]>
console.log(filteredMap.size); // 1
console.log(filteredMap.get('a')); // 1
console.log(filteredMap.get('b')); // undefined
console.log(filteredMap.get('c')); // undefined

filteredMap = map.filter(function (value, key) {
    return this.indexOf(key) !== -1;
}, ['a', 'c']);

console.log("\n" + filteredMap.toString()); // Map: <[a: 1], [c: 3]>
console.log(filteredMap.size); // 2
console.log(filteredMap.get('a')); // 1
console.log(filteredMap.get('b')); // undefined
console.log(filteredMap.get('c')); // 3