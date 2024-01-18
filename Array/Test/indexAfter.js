// Test function to compare expected and actual values
function assertEqual(actual, expected, testName) {
    if (actual === expected) {
        $.writeln(testName + ": Passed");
    } else {
        $.writeln(testName + ": Failed (Expected " + expected + ", but got " + actual + ")");
    }
}

// Test 1: Normal case - Element in the middle of the array
var array1 = [1, 2, 3, 4, 5];
assertEqual(array1.indexAfter(2), 2, "Test 1");

// Test 2: Element is the first in the array
var array2 = [1, 2, 3, 4, 5];
assertEqual(array2.indexAfter(1), 1, "Test 2");

// Test 3: Element is the last in the array
var array3 = [1, 2, 3, 4, 5];
assertEqual(array3.indexAfter(5), -1, "Test 3");

// Test 4: Element is not in the array
var array4 = [1, 2, 3, 4, 5];
assertEqual(array4.indexAfter(6), -1, "Test 4");

// Test 5: Empty array
var array5 = [];
assertEqual(array5.indexAfter(1), -1, "Test 5");

// Test 6: Array with duplicate elements
var array6 = [1, 2, 3, 2, 4];
assertEqual(array6.indexAfter(2), 2, "Test 6");

// Test 7: Array with one element
var array7 = [1];
assertEqual(array7.indexAfter(1), -1, "Test 7");
