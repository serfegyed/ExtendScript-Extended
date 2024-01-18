$.writeln([1, 2, 3].includes(2)); // true
$.writeln([1, 2, 3].includes(4)); // false
$.writeln([1, 2, 3].includes(3, 3)); // false
$.writeln([1, 2, 3].includes(3, -1)); // true
$.writeln([1, NaN, 3].includes(NaN)); // true
$.writeln(["1", "2", "3"].includes(3)); // false
$.writeln([1, 2, undefined].includes(undefined)); // true
$.writeln([1, 2, ,].includes()); // true
$.writeln([1, 2, ,Infinity].includes(Infinity)); // true
$.writeln()

var arr = ["a", "b", "c"];
$.writeln(arr.includes("a", -100)); // true
$.writeln(arr.includes("b", -100)); // true
$.writeln(arr.includes("c", -100)); // true
$.writeln(arr.includes("a", -2)); // false
