console.log(new Date(1955,11,30,13,45,19,321).toString());

var date = new Date(1955,11,30,13,45,19,321);
console.log(date.toString());

var specificDate = new Date(date.toString()); 
console.log("From 'toString()': " + specificDate.toISOString());

var specificDate = new Date(date); 
console.log("From other Date object: " + specificDate.toISOString());

var specificDate = new Date(date.toUTCString()); 
console.log("From 'toUTCString': " + specificDate.toISOString());

var timestamp = Date.parse(date.toString());
var parsed = new Date(timestamp);
console.log("Parsed: " + parsed.toISOString());

var timestamp = Date.parse(date.toUTCString());
var parsed = new Date(timestamp);
console.log("Parsed: " + parsed.toISOString());

var timestamp = Date.parse(date.toLocaleString());
var parsed = new Date(timestamp);
console.log("Parsed: " + parsed.toISOString());

var date = new Date(0);
console.log(date.toString());

var date = new Date(0);
console.log(date.toISOString());

var date = new Date();
console.log(date.toISOString());

var date = new Date(-1,11,30,13,45,19,321);
console.log(date.toISOString());

var date = new Date(-1901,11,30,13,45,19,321);
console.log(date.toISOString());

var date = new Date(-10000,11,30,13,45,19,321);
console.log(date.toString());

var date = new Date(10000,11,30,13,45,19,321);
console.log(date.toISOString());

try {
	console.log("Date(NaN): " + (new Date(NaN)).toISOString())
} catch (e) {console.log(e.toString())};

try {
	console.log("Date('foo'): " + (new Date("foo")).toISOString())
} catch (e) {console.log(e.toString())};

try {
	console.log("Date({}): " + (new Date({})).toISOString())
} catch (e) {console.log(e.toString())};

try {
	console.log("Date(true): " + (new Date(true)).toISOString())
} catch (e) {console.log(e.toString())};

try {
	console.log("Date(false): " + (new Date(false)).toISOString())
} catch (e) {console.log(e.toString())};