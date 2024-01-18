// Tests
// all following calls return true
$.writeln(Array.isArray([]));
$.writeln(Array.isArray([1]));
$.writeln(Array.isArray(new Array()));
$.writeln(Array.isArray(new Array("a", "b", "c", "d")));
$.writeln(Array.isArray(new Array(3)));
// Little known fact: Array.prototype itself is an array:
$.writeln(Array.isArray(Array.prototype));

// all following calls return false
$.writeln(Array.isArray());
$.writeln(Array.isArray({}));
$.writeln(Array.isArray(null));
$.writeln(Array.isArray(undefined));
$.writeln(Array.isArray(17));
$.writeln(Array.isArray("Array"));
$.writeln(Array.isArray(true));
$.writeln(Array.isArray(false));
$.writeln(Array.isArray({
    __proto__: Array.prototype
}));