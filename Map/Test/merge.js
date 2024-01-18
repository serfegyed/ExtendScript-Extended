// Map.prototype.merge()
$.writeln("\nTests Map.prototype.merge() method")

var arr = [['key1', 'value1'], ['key2', 'value2']];
var myMap = Map.from(arr);
var other = new Map([['key1', 'value3'], ['key2', 'value4']]);
$.writeln(myMap.merge(other));