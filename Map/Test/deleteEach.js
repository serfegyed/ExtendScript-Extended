// Map.prototype.deleteEach()
$.writeln("\nTests Map.prototype.deleteEach() method")

var filterFunc = function (val, ky) {
    return (ky === 'key3' || val === 'value1');
};

var arr = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3'], ['key4', 'value4']];
var myMap = Map.from(arr)
$.writeln(myMap.deleteEach(filterFunc));