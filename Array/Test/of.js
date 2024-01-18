$.writeln(Array.of()); // []
$.writeln(typeof Array.of()); // object
$.writeln(Array.of().length); // 0
$.writeln(Array.isArray(Array.of())); // true

$.writeln(Array.of('foo', 2, 'bar', true)); // ["foo", 2, "bar", true]
$.writeln(Array.of(7)); // [7]
$.writeln(Array.of(1, 2, 3)); // [1,2,3]
$.writeln(Array.of(undefined)); // [undefined]
$.writeln(Array.of(NaN)); // [NaN]
$.writeln;

function NotArray(len) {
    $.writeln("NotArray called with length ", len);
}

var other = Array.of.call(NotArray, 1, 2, 3);
$.writeln(other);
// NotArray called with length 3
// NotArray { '0': 1, '1': 2, '2': 3, length: 3 }

var another = Array.of.call({}, 1);
$.writeln(another); // [ 1 ]

var third = Array.of({}, 1);
$.writeln(third); // [{}, 1]