// Example usage:
const object = {
    name: "Steve Rogers",
    job: "Avenger",
    id: "1945",
    country: "usa",
    movie: {
        name: "captain america first avenger",
        release: {
            first: "2011",
            second: "2012"
        }
    }
}
const flatCopyObject = Object.flat(object)

console.log(object)

console.log(flatCopyObject)


function testFlatObject() {
    // Test 1: Nested object
    var nestedObject = {
        a: 1,
        b: { c: 2, d: { e: 3 } },
    };
    console.log("Test 1: Nested object", Object.flat(nestedObject));

    // Test 2: Object with array (expecting the array to not be flattened)
    var arrayWithObject = {
        name: "Array Test",
        items: [1, 2, { a: 3 }]
    };
    console.log("Test 2: Object with array", Object.flat(arrayWithObject));

    // Test 3: Object with null values
    var objectWithNull = {
        a: null,
        b: { c: null, d: 4 }
    };
    console.log("Test 3: Object with null values", Object.flat(objectWithNull));

    // Test 4: Empty object
    var emptyObject = {};
    console.log("Test 4: Empty object", Object.flat(emptyObject));

    // Test 5: Flat object (no nested objects)
    var flatObjectExample = {
        name: "Flat",
        value: 10
    };
    console.log("Test 5: Flat object", Object.flat(flatObjectExample));

    // Test 6: Object with boolean and string
    var mixedValues = {
        isValid: true,
        description: "This is a test"
    };
    console.log("Test 6: Object with boolean and string", Object.flat(mixedValues));
}

testFlatObject();

// Edge cases

// Test 1: Non-object input (e.g., number)
var numberInput = 123;
console.log('Test 1: Non-object input (number)', Object.flat(numberInput));

// Test 1a: Non-object input (e.g., number)
var numberInput = NaN;
console.log('Test 1a: Non-object input (NaN)', Object.flat(numberInput));

// Test 2: Non-object input (e.g., string)
var stringInput = "test string";
console.log('Test 2: Non-object input (string)', Object.flat(stringInput));

// Test 3: Non-object input (e.g., null)
var nullInput = null;
console.log('Test 3: Non-object input (null)', Object.flat(nullInput));

// Test 4: Special object type (Date)
var dateObject = {
    today: new Date()
};
console.log('Test 4: Special object type (Date)', Object.flat(dateObject));

// Test 4a: Special object type (Date)
today: new Date()
console.log('Test 4a: Special object type (Date)', Object.flat(new Date()));

// Test 5: Object with inherited properties
function BaseObject() {
    this.inheritedProperty = "inherited";
}
BaseObject.prototype.prototypeProperty = "prototypeValue";

var childObject = new BaseObject();
childObject.ownProperty = "ownValue";
console.log('Test 5: Object with inherited properties', Object.flat(childObject));

// Additional test to document and understand behavior

// Test 6: Array handling
var arrayWithObjects = {
    array: [1, 2, { a: "nested within array" }],
    normalProp: "normal"
};
console.log('Test 6: Array handling', Object.flat(arrayWithObjects));
