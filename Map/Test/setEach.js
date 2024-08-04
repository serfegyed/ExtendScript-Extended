// Map.prototype.setEach()
console.log("\nTests Map.prototype.setEach() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'srf'], ['key4', 'value4']];
var brr = [['key3', 'qwerer'], ['key4', 'dsgsdf'], ['key5', 'jhg'], ['key6', 'mmvvbm']];
var myMap = Map.from(arr);
console.log(myMap.setEach(brr, function (value, key) { return !myMap.has(key) }, myMap));
// Map: <[key1: "value1"], [key2: "value2"], [key3: "srf"], [key4: "value4"], [key5: "jhg"], [key6: "mmvvbm"]>
console.log();

myMap.clear();
var myMap = Map.from(arr);
console.log(myMap.setEach(brr, function (value, key) { return myMap.has(key) }, myMap));
// Map: <[key1: "value1"], [key2: "value2"], [key3: "qwerer"], [key4: "dsgsdf"]>
console.log();

myMap.clear();
var myMap = Map.from(arr);
console.log(myMap.setEach(brr, function (value, key) { return (myMap.keyOf('srf') === key) }, myMap));
// Map: <[key1: "value1"], [key2: "value2"], [key3: "qwerer"], [key4: "value4"]>