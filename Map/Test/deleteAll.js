// Map.prototype.deleteAll()
$.writeln("\nTests Map.prototype.deleteAll() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3'], ['key4', 'value4']];
var myMap = Map.from(arr)
$.writeln(myMap.deleteAll('key2', 'key3', 'wrongkey'));
$.writeln(myMap.deleteAll(''));
$.writeln(myMap.deleteAll(null));