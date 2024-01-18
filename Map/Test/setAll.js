// Map.prototype.setAll()
$.writeln("\nTests Map.prototype.setAll() method")

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3'], ['key4', 'value4']];
var myMap = Map.from(arr)
$.writeln(myMap.setAll([['key5', 'value5'], ['key6', 'value6'], ['key7', 'value7'], ['key8', 'value8']]))

myMap.clear();
$.writeln(myMap.setAll());	//{}
$.writeln(myMap.setAll([1, 2]));	//{}
$.writeln(myMap.setAll([[3, 4]]));	//{{3=>4}}
myMap.clear();
$.writeln(myMap.setAll([[]]));	//{}