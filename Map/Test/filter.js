// Tests for Map.prototype.filter
$.writeln("\nTests for Map.prototype.filter")

var map = new Map();
map.set('a', 1);
map.set('b', 2);
map.set('c', 3);

var filteredMap = map.filter(function (value, key) {
    return value > 1;
});

$.writeln("\n" + filteredMap.toString()); // {{b=>2}, {c=>3}}
$.writeln(filteredMap.size()); // 2
$.writeln(filteredMap.get('a')); // undefined
$.writeln(filteredMap.get('b')); // 2
$.writeln(filteredMap.get('c')); // 3

filteredMap = map.filter(function (value, key) {
    return key === 'a';
});

$.writeln("\n" + filteredMap.toString()); // {{a=>1}}
$.writeln(filteredMap.size()); // 1
$.writeln(filteredMap.get('a')); // 1
$.writeln(filteredMap.get('b')); // undefined
$.writeln(filteredMap.get('c')); // undefined

filteredMap = map.filter(function (value, key) {
    return ['a', 'c'].indexOf(key) !== -1;
});

$.writeln("\n" + filteredMap.toString()); // {{a=>1}, {c=>3}}
$.writeln(filteredMap.size()); // 2
$.writeln(filteredMap.get('a')); // 1
$.writeln(filteredMap.get('b')); // undefined
$.writeln(filteredMap.get('c')); // 3