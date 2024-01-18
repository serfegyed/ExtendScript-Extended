const obj = {
    a: null,
    b: false,
    c: true,
    d: 0,
    e: undefined,
    f: '',
    g: 'a',
    h: [null, false, '', true, 1, 'a'],
    i: { j: 0, k: false, l: 'a' }
};

const arr = [1, 2, "qwer", null, "", {}, undefined, { name: null }, 0, { age: 28 }];

$.writeln(Object.compact(obj))
// {c: true, g: "a", h: [true, 1, "a"], i: {l: "a"}}

$.writeln(Object.compact(arr))
// [1, 2, "qwer", {}, {}, {age: 28}]

try {
    $.writeln(Object.compact("qwer")) // Error
} catch (err) {
    $.writeln(err.message)	// "Object.compact: string is not an object."
};

try {
    $.writeln(Object.compact(undefined)) // Error
} catch (err) {
    $.writeln(err.message)	// "Object.compact: undefined is not an object."
};

try {
    $.writeln(Object.compact(/\d+/g)) // Error
} catch (err) {
    $.writeln(err.message)	// "Object.compact: function is not an object."
};

try {
    $.writeln(Object.compact(NaN)) // Error
} catch (err) {
    $.writeln(err.message)	// "Object.compact: number is not an object."
};