/******************************************************/
function testJSONParse(jsonString, expectedResult, custReplacer) {
    try {
        var result = JSON.parse(jsonString);
        console.log("Test for: " + jsonString)
        console.assert(JSON.stringify(result, custReplacer) === expectedResult, "Failed: " + result)
        console.log("Result: " + JSON.stringify(result, custReplacer))
    } catch (e) {
        console.log("Test for: ", jsonString, "\n", e);
    }
    return '';
}

console.log(JSON.stringify({ "name": "John", "age": 30, reg: "\/^\\d+\/g" }))
console.log(JSON.stringify({ "name": "John", "age": 30, reg: /^\d+/g }))
console.log(JSON.stringify({ name: "John", age: 30 }))

console.log("/*************** Valid JSON strings *************/");
const test1 = '{"name": "John", "age": 30}';
const result1 = '{"name":"John","age":30}';
console.log(testJSONParse(test1, result1))

const test2 = '{"person": {"name": "John", "address": {"city": "New York", "zip": "10001"}}}';
const result2 = '{"person":{"name":"John","address":{"city":"New York","zip":"10001"}}}';
console.log(testJSONParse(test2, result2));

const test3 = '[{"name": "John"}, {"name": "Jane"}]';
const result3 = '[{"name":"John"},{"name":"Jane"}]';
console.log(testJSONParse(test3, result3));

const test4 = '[1, true, "John", null]';
const result4 = '[1,true,"John",null]';
console.log(testJSONParse(test4, result4))

console.log("/************** Edge cases **********************/");
const test5 = '{}';
const result5 = '{}';
console.log(testJSONParse(test5, result5))

const test6 = '[]';
const result6 = '[]';
console.log(testJSONParse(test6, result6))

const test7 = '{"unicode": "\\u00A9"}';
const result7 = '{"unicode":"©"}';
console.log(testJSONParse(test7, result7))

const test8 = '{"escaped": "Line\\nBreak"}';
const result8 = '{"escaped":"Line\nBreak"}';
console.log(testJSONParse(test8, result8));

console.log("/************** Error conditions ***********/");
const test9 = '[1, 2, 3,]';
const result9 = 'Error';
console.log(testJSONParse(test9, result9))

const test10 = '{"name": "John",}';
const result10 = 'Error';
console.log(testJSONParse(test10, result10))

const test11 = '{"name": "John", "age": }';
const result11 = 'Error';
console.log(testJSONParse(test11, result11))

// Because of the implementation (it uses parseFloat) this test doesn't result in an error in ExtendScript.
const test12 = '{"number": 1.2.3}';
const result12 = '{"number":1.2}';
console.log(testJSONParse(test12, result12))

const test13 = '{"text": "\\xG1"}';
const result13 = 'Error';
console.log(testJSONParse(test13, result13))

console.log("/************** Custom replacers ***********/");

console.log("*** Filtering out string properties ***");
const replacer1 = function (key, value) {
    // Filtering out properties
    if (typeof value === "string") {
        return undefined; // Skip string properties
    }
    return value;
};

var test14 = '{ "name": "John", "age": 30, "city": "New York" }';
var result14 = '{"age":30}'
console.log(testJSONParse(test14, result14, replacer1));

console.log("*** Formatting Dates ***");
const replacer2 = function (key, value) {
    if (value instanceof Date) {
        // Format the date to YYYY-MM-DD. Adjust the format as needed.
        var year = value.getFullYear();
        var month = value.getMonth() + 1; // getMonth() is zero-based
        var day = value.getDate();

        // Ensure month and day are two digits
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return year + '. ' + month + '. ' + day + '.';
    }
    return value; // Return unmodified value for non-Date types
};
var data = {
    name: "John Doe",
    birthdate: new Date(1990, 0, 1), // January 1, 1990
    enrollmentDate: new Date(2020, 8, 15) // September 15, 2020
};

var jsonString = JSON.stringify(data, replacer2);
console.log(jsonString);


console.log("*** Filtering properties with null values ***");
function replacer3(key, value) {
    if (value === null) {
        return undefined;
    }
    return value;
}
var myData = {
    name: "Alice",
    email: "alice@example.com",
    profileComplete: null,
    interests: ["reading", "hiking", "coding"]
};

var jsonString = JSON.stringify(myData, replacer3);
console.log(jsonString);