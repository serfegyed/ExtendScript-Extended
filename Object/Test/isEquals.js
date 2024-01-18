//*******************************************************************
// Test case 0: simple values
$.writeln("Test case 0: simple values")
var obj1 = 1
var obj2 = 1
var obj3 = 2
$.writeln(Object.isEquals(obj1, obj2)) // Expected output: true
$.writeln(Object.isEquals(obj1, obj3)) // Expected output: false

// Test case 00: strings
$.writeln("Test case 00: strings")
$.writeln(Object.isEquals("First string", "First string")) // true
$.writeln(Object.isEquals("First string", "Second string")) // false

// Test case 1: Objects with array property values
$.writeln("Test case 1: Objects with array property values")
var obj1 = { name: "John", hobbies: ["reading", "hiking", "cooking"] }
var obj2 = { name: "John", hobbies: ["reading", "hiking", "booking"] }
$.writeln(Object.isEquals(obj1, obj2)) // Expected output: false

// Test case 2: Objects with different property values
$.writeln("Test case 2: Objects with different property values")
var obj3 = { name: "John", age: 30 }
var obj4 = { name: "John", age: 25 }
$.writeln(Object.isEquals(obj3, obj4)) // Expected output: false

// Test case 3: Objects with different number of properties
$.writeln("Test case 3: Objects with different number of properties")
var obj5 = { name: "John", age: 30 }
var obj6 = { name: "John", age: 30, city: "New York" }
$.writeln(Object.isEquals(obj5, obj6)) // Expected output: false

// Test case 4: Objects with nested objects
$.writeln("Test case 4: Objects with nested objects")
var obj7 = { name: "John", address: { city: "New York", country: "USA" } }
var obj8 = { name: "John", address: { city: "New York", country: "USA" } }
var obj9 = { name: "John", address: { city: "New York", country: "CAN" } }
$.writeln(Object.isEquals(obj7, obj8)) // Expected output: true
$.writeln(Object.isEquals(obj7, obj9)) // Expected output: false

// Test case 5: Objects with circular reference
$.writeln("Test case 5: Objects with circular reference")
var obj9 = { name: "John" }
obj9.self = obj9
var obj10 = { name: "John" }
obj10.self = obj10
var obj11 = { name: "Jonah" }
obj11.self = obj11
$.writeln(Object.isEquals(obj9, obj10)) // Expected output: true
$.writeln(Object.isEquals(obj9, obj11)) // Expected output: false

// Test case 6: Objects with null values
$.writeln("Test case 6: Objects with null values")
var obj11 = { name: "John", age: null }
var obj12 = { name: "John", age: null }
var obj13 = { name: "John", age: undefined }
$.writeln(Object.isEquals(obj11, obj12)) // Expected output: true
$.writeln(Object.isEquals(obj11, obj13)) // Expected output: false

// Test case 7: Objects with undefined values
$.writeln("Test case 7: Objects with undefined values")
var obj13 = { name: "John", age: undefined }
var obj14 = { name: "John", age: undefined }
var obj15 = { name: "John", age: NaN }
$.writeln(Object.isEquals(obj13, obj14)) // Expected output: true
$.writeln(Object.isEquals(obj13, obj15)) // Expected output: false

// Test case 8: Objects with NaN values
$.writeln("Test case 8: Objects with NaN values")
var obj13 = { name: "John", age: NaN }
var obj14 = { name: "John", age: NaN }
var obj15 = { name: "John", age: 27 }
$.writeln(Object.isEquals(obj13, obj14)) // Expected output: true
$.writeln(Object.isEquals(obj13, obj15)) // Expected output: false

// tests different arrays containing simple values
$.writeln("Testing compare method on simple array:")
var arr1 = [1, 2, 3]
var arr2 = [1, 2, 3]
var arr3 = [1, 2, 4]
$.writeln(Object.isEquals(arr1, arr2)) // true
$.writeln(Object.isEquals(arr1, arr3)) // false

$.writeln("Testing compare method on arrays containing objects:")
var arr4 = [
    { a: 1, b: 2 },
    { c: 3, d: 4 },
]
var arr5 = [
    { a: 1, b: 2 },
    { c: 3, d: 4 },
]
var arr6 = [
    { a: 1, b: 2 },
    { c: 3, d: undefined },
]
$.writeln(Object.isEquals(arr4, arr5)) // true
$.writeln(Object.isEquals(arr4, arr6)) // false

$.writeln("Testing compare method on arrays containing nested objects:")
var arr7 = [
    { a: 1, b: { c: 2 } },
    { d: 3, e: { f: 4 } },
]
var arr8 = [
    { a: 1, b: { c: 2 } },
    { d: 3, e: { f: 4 } },
]
var arr9 = [
    { a: 1, b: { c: 2 } },
    { d: 3, e: { f: null } },
]
$.writeln(Object.isEquals(arr7, arr8)) // true
$.writeln(Object.isEquals(arr7, arr9)) // false

$.writeln("Testing compare method on arrays containing nested arrays:")
var arr1 = [1, 2, 3, [4, [5]]]
var arr2 = [1, 2, 3, [4, [5]]]
var arr3 = [1, 2, 3, [4, [5, 6]]]
$.writeln(Object.isEquals(arr1, arr2)) // true
$.writeln(Object.isEquals(arr1, arr3)) // false

$.writeln(
    "Testing compare method on arrays containing nested arrays with 'NaN':"
)
var arr1 = [1, 2, 3, [4, [NaN]]]
var arr2 = [1, 2, 3, [4, [NaN]]]
var arr3 = [1, 2, 3, [4, [NaN, 6]]]
$.writeln(Object.isEquals(arr1, arr2)) // true
$.writeln(Object.isEquals(arr1, arr3)) // false

$.writeln(
    "Testing compare method on arrays containing nested arrays with 'Infinity':"
)
var arr1 = [1, 2, 3, [4, [Infinity]]]
var arr2 = [1, 2, 3, [4, [Infinity]]]
var arr3 = [1, 2, 3, [4, [Infinity, 6]]]
$.writeln(Object.isEquals(arr1, arr2)) // true
$.writeln(Object.isEquals(arr1, arr3)) // false

$.writeln("Testing compare method on arrays containing nested empty arrays:")
var arr1 = [1, 2, 3, [4, []]]
var arr2 = [1, 2, 3, [4, []]]
var arr3 = [1, 2, 3, [4, [, 6]]]
$.writeln(Object.isEquals(arr1, arr2)) // true
$.writeln(Object.isEquals(arr1, arr3)) // false

$.writeln("Testing compare method on arrays containing nested empty objects:")
var arr7 = [
    { a: 1, b: {} },
    { d: 3, e: {} },
]
var arr8 = [
    { a: 1, b: {} },
    { d: 3, e: {} },
]
var arr9 = [
    { a: 1, b: {} },
    { d: 3, undefined: {} },
]
$.writeln(Object.isEquals(arr7, arr8)) // true
$.writeln(Object.isEquals(arr7, arr9)) // false

$.writeln("Testing compare method on empty array:")
var arr1 = []
var arr2 = []
var arr3 = [[], []]
$.writeln(Object.isEquals(arr1, arr2)) // true
$.writeln(Object.isEquals(arr1, arr3)) // false

$.writeln("Testing compare method on sparse arrays:")
var arr1 = []
var arr2 = []
var arr3 = [,]
$.writeln(Object.isEquals(arr1, arr2)) // true
$.writeln(Object.isEquals(arr1, arr3)) // false

$.writeln("Testing compare method on array like objects:")
const arrayLike1 = {
    length: 3, // ignored by compare() since arrayLike is an object
    0: 4,
    1: 7,
    2: 5.3,
    3: 99,
}
const arrayLike2 = {
    length: 3, // ignored by compare() since arrayLike is an object
    0: 4,
    1: 7,
    2: 5.3,
    3: 99,
}
const arrayLike3 = {
    length: 3, // ignored by compare() since arrayLike is an object
    0: 4,
    1: 7,
    2: 5.3,
    3: 999,
}
$.writeln(Object.isEquals(arrayLike1, arrayLike2)) // true
$.writeln(Object.isEquals(arrayLike1, arrayLike3)) // false

$.writeln("Testing compare method on strings:")
$.writeln(Object.isEquals("First string", "First string")) // true
$.writeln(Object.isEquals("First string", "Second string")) // false

//**********************************************************************

$.writeln(
    Object.isEquals(
        { a: [2, { e: NaN }], b: [null], c: "foo" },
        { a: [2, { e: NaN }], b: [null], c: "foo" }
    )
) //

$.writeln(Object.isEquals([1, 2, 3], { 0: 1, 1: 2, 2: 3 })) //

$.writeln(Object.isEquals([1, 2, 3])) //

$.writeln(Object.isEquals(2, 2)) //