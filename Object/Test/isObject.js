Object.isObject = function (obj) {
    // return (obj instanceof Object);
    return typeof obj === 'object' && obj !== null;
};

const map = new Map()
map.set(1, 2)

const arr = [];
const obj1 = {};
const obj2 = [{}, { big: 5555566666 }];
const obj3 = { name: '23' };
const str = "";
const date = new Date(Date());
const regex = new RegExp();

// Map 
$.writeln(Object.isObject(map)); // true
// Array	
$.writeln(Object.isObject(arr));	// true

// Empty object
$.writeln(Object.isObject(obj1));	// true

// Array of objects
$.writeln(Object.isObject(obj2));	// true

// Object
$.writeln(Object.isObject(obj3));	// true

// Empty object
$.writeln(Object.isObject({}));	  // true

// Empty string
$.writeln(Object.isObject(str));	// false

// null
$.writeln(Object.isObject(null));	// false

// undefined
$.writeln(Object.isObject(undefined));	// false

// function
$.writeln(Object.isObject(function (x) { return x }));	// true

// Date
$.writeln(Object.isObject(date));	// true

// RegExp
$.writeln(Object.isObject(regex));	// true