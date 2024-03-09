// Test 1: Removing an Element from the Middle of the Array
var array1 = [1, 2, 3, 4, 5];
var removed1 = array1.remove(2);
console.log("Test 1: ", removed1); // [1, 2, 4, 5]

// Test 2: Removing the First Element
var array2 = [1, 2, 3, 4, 5];
var removed2 = array2.remove(0);
console.log("Test 2: ", removed2); // [2, 3, 4, 5]

// Test 3: Removing the Last Element
var array3 = [1, 2, 3, 4, 5];
var removed3 = array3.remove(4);
console.log("Test 3: ", removed3); // [1, 2, 3, 4]

// Test 4: Removing an Element from an Empty Array
var array4 = [];
var removed4 = array4.remove(0);
console.log("Test 4: ", removed4); // undefined

// Test 5: Removing an Element with a Negative Index
var array5 = [1, 2, 3, 4, 5];
var removed5 = array5.remove(-1);
console.log("Test 5: ", removed5); // [1, 2, 3, 4]

// Test 6: Removing an Element with an Index Greater Than the Array's Length
try {
    var array6 = [1, 2, 3, 4, 5];
    array6.remove(10);
    console.log("Test 6: false");
} catch (e) {
    console.log("Test 6: " + (e instanceof RangeError));
}

// Test 7: Removing an Element with a Non-integer Index
var array7 = [1, 2, 3, 4, 5];
var removed7 = array7.remove(2.5);
console.log("Test 7: ", removed7) // [1, 2, 4, 5]

// Test 8: Removing an Element with a Non-numeric Index
try {
    var array8 = [1, 2, 3, 4, 5];
    array8.remove("a");
    console.log("Test 8: false");
} catch (e) {
    console.log("Test 8: " + (e instanceof Error));
}