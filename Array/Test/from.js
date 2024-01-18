$.writeln(Array.from('foo'));
// Expected output: Array ["f", "o", "o"]

$.writeln(Array.from([1, 2, 3], function(x) {
    return x + x
}));
// Expected output: Array [2, 4, 6]

var notConstructor = Array.from.call({}, {
    length: 1,
    0: "foo"
});
$.writeln(notConstructor); // [ 'foo' ]

//******************************************
// Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP, etc.)
const range = function(start, stop, step) {
    return Array.from({
        length: Math.floor((stop - start) / step + 1)
    }, function(_, i) {
        return start + i * step
    });
};

// Generate numbers range 0..4
var r1 = range(0, 4, 1);
$.writeln(r1); // [0, 1, 2, 3, 4]

// Generate numbers range 1..10 with step of 2
var r2 = range(1, 10, 2);
$.writeln(r2); // [1, 3, 5, 7, 9]

// Generate the alphabet using Array.from making use of it being ordered as a sequence
var r3 = range("A".charCodeAt(0), "Z".charCodeAt(0), 1).map(function(x) {
    return String.fromCharCode(x)
});
$.writeln(r3);
// ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]