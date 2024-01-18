// Tests for Map.prototype.mapKeys
$.writeln("\nTests for Map.prototype.mapKeys")
var map = new Map();
map.set("a", 1).set("b", 2).set("c", 3);

// Test 1: map keys to their uppercase equivalent
var newMap = map.mapKeys(function (key) {
    return key.toUpperCase();
});
$.writeln(newMap); // {{A=>1}, {B=>2}, {C=>3}}

// Test 2: map keys to their ASCII code
newMap = map.mapKeys(function (key) {
    return key.charCodeAt(0);
});
$.writeln(newMap); // {{97=>1}, {98=>2}, {99=>3}}

// Test 3: map keys to their length (all keys have length 1)
newMap = map.mapKeys(function (key) {
    return key.length;
});
$.writeln(newMap); // {{1=>3}}

// Edge case 1: callback function returns non-unique keys
var newMap = map.mapKeys(function (key) {
    return "x";
});
$.writeln(newMap); // {{x=>3}}

// Edge case 2: callback function returns non-string, non-numeric keys
newMap = map.mapKeys(function (key) {
    return { key: key };
});
$.writeln(newMap); // {{{key: "a"}=>1}, {{key: "b"}=>2}, {{key: "c"}=>3}}

// Edge case 3: Map is empty
map = new Map();
newMap = map.mapKeys(function (key) {
    return key;
});
$.writeln(newMap.size()); // 0