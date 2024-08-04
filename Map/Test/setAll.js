// Map.prototype.setAll()
console.log("\nTests Map.prototype.setAll() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3'], ['key4', 'value4']];
var myMap = Map.from(arr)
console.log(myMap.setAll([['key5', 'value5'], ['key6', 'value6'], ['key7', 'value7'], ['key8', 'value8']]))
// <[key1: "value1"], [key2: "value2"], [key3: "value3"], [key4: "value4"], [key5: "value5"], [key6: "value6"], [key7: "value7"], [key8: "value8"]>
myMap.clear();
console.log(myMap.setAll());	// Map: <>
console.log(myMap.setAll([1, 2]));	// Map: <>
console.log(myMap.setAll([[3, 4]]));	// Map: <[3: 4]>
myMap.clear();
console.log(myMap.setAll([[]]));	// Map: <>