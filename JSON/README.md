# JSON Polyfill for ExtendScript

## Overview

This JSON polyfill provides a way to serialize and deserialize data in ExtendScript, which doesn't natively support the JSON object found in modern JavaScript environments. The polyfill includes two main methods: `JSON.stringify` and `JSON.parse`, closely mimicking the functionality found in ECMAScript 5+. They designed to enable JSON serialization of JavaScript values, including objects, arrays, strings, numbers, and booleans, with support for custom replacer functions. 

## Features

- **JSON Serialization:** Converts JavaScript values to their JSON string representation.
- **Custom Replacer Function:** Allows for filtering or transforming values and properties during serialization.
- **Compatibility:** Designed to work in environments lacking native JSON support, specifically targeting Adobe ExtendScript environments.

## Usage

To use this polyfill in your project, include the JavaScript file in your ExtendScript project and call`JSON.stringify` and `JSON.parse` as you would in a standard JavaScript environment.

### JSON.stringify

```javascript
var myObject = {
  name: "John Doe",
  age: 30,
  isAdmin: true
};

var jsonString = JSON.stringify(myObject);
console.log(jsonString);
// Output: '{"name":"John Doe","age":30,"isAdmin":true}'
```

#### Using the Replacer Function

```javascript
// Filtering out properties
const replacer1 = function (key, value) {

    if (typeof value === "string") {
        return undefined; // Skip string properties
    }
    return value;
};

var test14 = '{ "name": "John", "age": 30, "city": "New York" }';

console.log(JSON.Stringify(test14, replacer1));
// Output: '{"age":30}'
```

```javascript
// Formatting Dates
const replacer2 = function (key, value) {
    if (value instanceof Date) {
        // Format the date. Adjust the format as needed.
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
// Output: '{"name":"John Doe","birthdate":"1990. 01. 01.","enrollmentDate":"2020. 09. 15."}'
```

```javascript
// Filtering properties with null values
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
// Output: '{"name":"Alice","email":"alice@example.com","interests":["reading","hiking","coding"]}'
```

### JSON.parse()
To parse a JSON string and convert it back into a JavaScript value, use JSON.parse(jsonString). 

```javascript
var jsonString = '{"unicode": "\\u00A9"}';
var myObject = JSON.parse(jsonString);
console.log(myObject);
// Output: {unicode: "©"}
```

## Implementation Notes
- The polyfill is designed to be as compatible as possible with ECMAScript 3 standards, making it suitable for use in ExtendScript environments.
- Special characters in strings are correctly escaped during stringification, and Unicode characters can be properly serialized and deserialized.
- The parser does not evaluate the JSON string using eval, providing a safer alternative to executing dynamic code.

## Limitations

- This polyfill focuses on providing basic JSON serialization capabilities and not fully replicate all features of the native JSON.stringify method found in modern JavaScript environments. 
- Specifically, it may not handle all edge cases or advanced features such as custom toJSON methods, space argument for pretty-printing, JSON.parse 'reviever' function, etc.
- The polyfill does not support undefined, Function, Symbol, Map, Set, WeakMap, WeakSet, or any non-JSON data types. Attempting to serialize these types will result in them being omitted or replaced with null.
- Circular references in the object to be serialized will cause an error, as JSON does not support them.
- The performance of this polyfill may be slower than native JSON support in environments that provide it. However, it offers a viable solution for environments without JSON support.

## License

This project is open-sourced under the MIT License. See the LICENSE file for more details.
