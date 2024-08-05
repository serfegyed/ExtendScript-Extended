/*******************************************************************/

// Create a new Map object
var myArr = [
    [1, "one"],
    [2, "two"],
    [3, "three"],
];

var myMap1 = new Map(myArr);
console.log("Insert key into a Map");
console.log(myMap1);
console.log("myMap1: " + myMap1.insert(2, "New two"));
console.log(myMap1);
console.log("myMap1: " + myMap1.insert(5, "New five"));
console.log(myMap1);

console.log("myMap1: " + myMap1.update(5, "New SIX!"));
console.log(myMap1);
console.log("myMap1: " + myMap1.update(9, "NINE!"));
console.log(myMap1);

var myMap = new Map();
myMap.set('count', 10);

// Multiply the count by 4.27 to the current value
myMap.update('count', 4.27, function (currentValue, multiplier) {
    return currentValue * multiplier;
});

console.log(myMap.get('count')); // Outputs: 15

// Update the count directly without using a function
myMap.update('count', 20);
console.log(myMap.get('count')); // Outputs: 20

// Attempt to update a non-existent key
var result = myMap.update('missingKey', 30);
console.log(result); // Outputs: false, as the key 'missingKey' does not exist
console.log();
console.log();


/********************************* emplace *************************/
var myMap = new Map();

// Insert a new value
myMap.emplace('count', {
    insert: function (key, map) {
        return 1; // Set initial value
    }
});	// Set `count` to 1
console.log(myMap.get('count')); // Outputs: 1

// Update an existing value
myMap.emplace('count', {
    insert: function (key, map) {
        return 1; // This will not be called since the key exists
    },
    update: function (currentValue, key, map) {
        return currentValue + 1; // Increment the current value
    }
});
console.log(myMap.get('count')); // Outputs: 2

// Try to overwrite existing value
myMap.emplace('count', {
    insert: function (key, map) {
        return 19; // `count` remains 2
    }
});
console.log(myMap.get('count')); // Outputs: 2

// Another key with only insert logic
myMap.emplace('total', {
    insert: function (key, map) {
        return 10; // Initial value
    }
});
console.log(myMap.get('total')); // Outputs: 10


