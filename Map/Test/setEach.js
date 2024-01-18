// Map.prototype.setEach()
$.writeln("\nTests Map.prototype.setEach() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'srf'], ['key4', 'value4']];
var brr = [['key3', 'qwerer'], ['key4', 'dsgsdf'], ['key5', 'jhg'], ['key6', 'mmvvbm']];
var myMap = Map.from(arr);
$.writeln(myMap.setEach(brr, function (value, key) { return !myMap.has(key) }, myMap));
$.writeln();

myMap.clear();
var myMap = Map.from(arr);
$.writeln(myMap.setEach(brr, function (value, key) { return myMap.has(key) }, myMap));
$.writeln();

myMap.clear();
var myMap = Map.from(arr);
$.writeln(myMap.setEach(brr, function (value, key) { return (myMap.keyOf('srf') === key) }, myMap));