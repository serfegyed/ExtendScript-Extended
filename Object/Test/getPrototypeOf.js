// Define some test objects and prototypes
function Animal() { }
function Dog() { }
Dog.prototype = new Animal();

var myDog = new Dog();
var emptyObj = {};
var nullObj = null;
var nonObj = "I am a string";

function runTests() {
    console.log("Test 1: Prototype of myDog should be Dog.prototype");
    console.assert(Object.getPrototypeOf(myDog) === Dog.prototype, "Test 1 Failed");

    console.log("Test 2: Prototype of Dog.prototype should be Animal.prototype");
    console.assert(Object.getPrototypeOf(Dog.prototype) === Animal.prototype, "Test 2 Failed");

    console.log("Test 3: Prototype of emptyObj should be Object.prototype");
    console.assert(Object.getPrototypeOf(emptyObj) === Object.prototype, "Test 3 Failed");

    console.log("Test 4: Prototype of Object.prototype should be null");
    console.assert(Object.getPrototypeOf(Object.prototype) === null, "Test 4 Failed");

    console.log("Test 5: Calling with null should throw TypeError");
    try {
        Object.getPrototypeOf(nullObj);
        console.error("Test 5 Failed: No error thrown");
    } catch (e) {
        console.assert(e instanceof TypeError, "Test 5 Failed: Wrong error type");
    }

    console.log("Test 6: Calling with a non-object should throw TypeError");
    try {
        Object.getPrototypeOf(nonObj);
        console.error("Test 6 Failed: No error thrown");
    } catch (e) {
        console.assert(e instanceof TypeError, "Test 6 Failed: Wrong error type");
    }

    console.log("All tests completed.");
}

// Run the tests
runTests();
