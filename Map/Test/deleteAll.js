// Map.prototype.deleteAll()
console.log("\nTests Map.prototype.deleteAll() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3'], ['key4', 'value4']];
var myMap = new Map.from(arr)
console.log(myMap.deleteAll('key2', 'key3', 'wrongkey')); // Map: <[key1: "value1"], [key4: "value4"]>
console.log(myMap.deleteAll('')); // Map: <[key1: "value1"], [key4: "value4"]>
console.log(myMap.deleteAll(null)); // Map: <[key1: "value1"], [key4: "value4"]>