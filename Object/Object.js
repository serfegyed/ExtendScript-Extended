/*************************************************************************************************************************
*	Object methods 	- a possible implementation some of Extendscript's missing Object functions
*
*	Egyed Serf, 2023

* Based on: https://github.com/debrouwere/Extendables/blob/master/patches/object.jsx
*
***************************************************************************************************************************/
/**
	Built-in Extendscript Object functions (these are for information only, they are not implemented here):
		hasOwnProperty()
		isPrototypeOf()
		isValid()
		propertyIsEnumerable()
		toLocaleString()
		toSource()
		toString()
		unwatch()
		valueOf()
		watch()

	Implemented functions:
		Object.assign()             - Copies all enumerable own properties from source object(s) to target object.
		Object.create()             - Creates a new Object, using an existing object as the prototype.
		Object.defineProperty()     - Defines or modifies a property directly on an object.
		Object.defineProperties()   - Defines new or modifies existing properties directly on an object.
		Object.entries()            - Returns an array of a given object's own string-keyed property key-value pairs			
		Object.fromEntries()        - Creates a new Object from an array of key-value pairs.The reverse of Object.entries().
		Object.getOwnPropertyNames() - Returns an array of a given object's own enumerable string-keyed property names
		Object.groupBy()            - Groups the items based on the provided callback function.
		Object.hasOwn()             - The preferred method over hasOwnProperty()
		Object.is()                 - Determines whether two values are the same value or both NaN.
		Object.keys()               - Returns an array of a given object's string-keyed property names
		Object.prototype.toString() - Returns a string of a given object's own property key-value pairs.
		Object.values()             - Returns an array of a given object's own enumerable string-keyed property values

	Non-standard functions:
		Object.Compact()
		Object.deepCopy()           - Returns a new `deep copy` of an Object, Array, Date or any types
		Object.safeDeepCopy()       - Implements a safe `deep copy` with handling circular references.
		Object.isCyclic()           - Detects cyclic references in an object.
		Object.isEmpty()            - Tests if a passed object is empty
		Object.isEquals()           - Compares two objects for equality.
		Object.isObject()           - Tests if a passed data is Object
		Object.prototype.merge()    - Merges two Objects and returns a new Object. Handles nested Objects/Arrays.

 * @dependecies: Array.isArray(), isPrimitive(), sameValueZero())

**/
/**
 * Checks if the given object is an instance of the Object class.
 *
 * @param {any} obj - The object to be checked.
 * @return {boolean} Returns true if the object is an instance of the Object class, false otherwise.
 */
if (!Object.isObject) {
	Object.isObject = function (obj) {
		return typeof obj === 'object' && obj !== null;
	};
};

/**
 * Checks if an object is empty.
 *
 * @param {Object} obj - The object to check.
 * @return {boolean} Returns true if the object is empty, false otherwise.
 */
if (!Object.isEmpty) {
	Object.isEmpty = function (obj) {
		if (obj.__class__ !== "Object") throw new TypeError(obj.toString() + " is not an Object");
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	};
};

/**
 * Deeply compares two objects for equality.
 *
 * @param {any} obj1 - The first object to compare.
 * @param {any} obj2 - The second object to compare.
 * @return {boolean} Returns true if the objects are deeply equal, false otherwise.
 */
if (!Object.isEquals) {
	Object.isEquals = function (obj1, obj2) {
		// ES3 version
		var alreadyCompared = []

		function innerCompare(a, b) {
			if (sameValueZero(a, b)) return true

			// Check if objects have already been compared
			for (var i = 0; i < alreadyCompared.length; i++) {
				if (alreadyCompared[i][0] === a && alreadyCompared[i][1] === b) {
					return true
				}
			}

			// No, add objects
			alreadyCompared.push([a, b])

			if (a instanceof Date && b instanceof Date)
				return a.getTime() === b.getTime()

			if (a instanceof RegExp && b instanceof RegExp)
				return a.toString() === b.toString()

			if (!a || !b || (typeof a !== "object" && typeof b !== "object"))
				return sameValueZero(a, b)

			if (a.__proto__ !== b.__proto__) return false

			const keys = Object.keys(a)
			if (keys.length !== Object.keys(b).length) return false

			return keys.every(function (k) {
				return innerCompare(a[k], b[k])
			})
		}
		return innerCompare(obj1, obj2)
	}
};

/**
 * Returns an array containing the enumerable property names of an object.
 *
 * @param {object} obj - The object to retrieve the property names from.
 * @return {Array} An array containing the property names of the object.
 */
if (!Object.keys) {
	Object.keys = function (obj) {
		if (!obj || typeof obj !== "object") throw new TypeError(obj.toString() + " is not an object");

		var results = [];
		for (var key in obj) {
			(obj.hasOwnProperty ? obj.hasOwnProperty(key) : key in obj) && results.push(key);
		}
		return results;
	};
};

/**
 * Returns an array of all the values in the given object.
 *
 * @param {Object} obj - The object to extract values from.
 * @return {Array} An array of all the values in the object.
 */
if (!Object.values) {
	Object.values = function (obj) {
		if (!obj || typeof obj !== "object") throw new TypeError(obj.toString() + " is not an object");

		var results = [];
		for (var key in obj) {
			(obj.hasOwnProperty ? obj.hasOwnProperty(key) : key in obj) && results.push(obj[key]);
		}
		return results;
	};
};

/**
 * Returns an array of key-value pairs representing the properties of an object.
 *
 * @param {Object} obj - The object to extract the properties from.
 * @return {Array} An array of key-value pairs representing the properties of the object.
 */
if (!Object.entries) {
	Object.entries = function (obj) {
		if (!obj || typeof obj !== "object") throw new TypeError(obj.toString() + " is not an object");
		var results = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) results.push([key, obj[key]]);
		}
		return results;
	};
};

/**
 * Copies an object deeply, including nested objects, arrays, and Date objects.
 *
 * @param {object} obj - The object to be copied.
 * @return {object} The deep copy of the object.
 * @dependecy Object.isCyclic()
 */
if (!Object.deepCopy) {
	Object.deepCopy = function (obj) {
		if (Object.isCyclic(obj)) {
			throw new Error("Object.deepCopy(): Object has cyclic reference.");
		}

		if (obj === null) return null;
		if (typeof obj !== 'object') return obj; // Primitives

		if (obj instanceof Date) { 	// Handle Date objects
			new Date(obj);
		}

		if (obj instanceof RegExp) {	// Handle RegExp objects
			return new RegExp(obj);
		}

		const clonedObj = Array.isArray(obj) ? [] : {};

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				clonedObj[key] = Object.deepCopy(obj[key]);
			}
		}

		return clonedObj;
	};
};

/**
 * A deep copy function that safely copies objects and arrays to avoid circular references.
 *
 * @param {object|array} obj - The object or array to be copied.
 * @param {array} cache - An optional parameter to store the copied objects and arrays to check for circular references.
 * @return {object|array} - The deep copied object or array.
 * @dependency Map() class
 */
if (!Object.safeDeepCopy) {
	Object.safeDeepCopy = function (obj, hash) { // Handle circular references.
		if (!hash) { var hash = new Map() }
		if (obj === null) return null;
		if (typeof obj !== 'object') return obj; // Primitives

		if (obj instanceof Date) { 	// Handle Date objects
			new Date(obj);
		}

		if (obj instanceof RegExp) {	// Handle RegExp objects
			return new RegExp(obj);
		}

		// Gotcha Alert: Circular references? We got them covered!
		if (hash.has(obj)) return hash.get(obj);

		const clonedObj = Array.isArray(obj) ? [] : {};
		hash.set(obj, clonedObj);

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				clonedObj[key] = Object.safeDeepCopy(obj[key], hash);
			}
		}

		return clonedObj;
	};
};

/**
 * Merges the properties of the given object with the properties of the current object.
 *
 * @param {Object} obj - The object to merge with the current object.
 * @throws {TypeError} Throws a TypeError if the provided object is not an object.
 * @return {Object} Returns a new object with the merged properties.
 */
if (!Object.prototype.merge) {
	Object.prototype.merge = function (obj) {
		if (!obj || obj.__class__ !== "Object")
			throw new TypeError(obj.toString() + " is not an object");
		var thisObj = Object.deepCopy(this);
		var secondObj = Object.deepCopy(obj);
		var mergedObj = {};
		for (var prop in thisObj) {
			if (thisObj.hasOwnProperty(prop)) mergedObj[prop] = thisObj[prop];
		}
		for (var prop in secondObj) {
			if (secondObj.hasOwnProperty(prop)) mergedObj[prop] = obj[prop];
		}
		return mergedObj;
	};
};

/**
 * Checks if an object has a specific property.
 *
 * @param {object} obj - The object to check.
 * @param {string} key - The key to check for.
 * @return {boolean} Returns true if the object has the property, false otherwise.
 */
if (!Object.hasOwn) {
	Object.hasOwn = function (obj, key) {
		for (var k in obj) {
			if (k === key) return true;
		}
		return false;
	};
};

/**
 * Creates a new object with the specified prototype and properties.
 *
 * @param {Object} prototype - The prototype object.
 * @param {Object} properties - The properties to be added to the new object.
 * @return {Object} The newly created object.
 */
if (!Object.create) {
	Object.create = function (prototype, properties) {
		function F() { }
		F.prototype = prototype;
		const obj = new F();
		if (typeof properties === "object") {
			for (var prop in properties) {
				if (properties.hasOwnProperty(prop)) {
					obj[prop] = properties[prop];
				}
			}
		}
		return obj;
	};
};

/**
 * Overrides the default `toString` method of `Object` prototype
 * to return a string representation of the object.
 *
 * @return {string} A string representation of the object.
 */
Object.prototype.toString = function () {
	var results = "";
	var obj = this;
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (results !== "") results += ", ";
			results += key + ": " + (typeof obj[key] === "string" ? '"' + obj[key] + '"' : obj[key]);
		}
	}
	return "{" + results + "}";
};

/**
 * Defines or modifies a property on an object.
 *
 * @param {Object} obj - The object on which to define or modify the property.
 * @param {string} prop - The name or Symbol of the property to be defined or modified.
 * @param {Object} descriptor - The descriptor for the property being defined or modified.
 * @throws {TypeError} If obj is not an object or is null.
 * @throws {TypeError} If descriptor is not an object or is null.
 * @return {Object} The object that was passed to the function.
 */
if (!Object.defineProperty) {
	Object.defineProperty = function (obj, prop, descriptor) {
		if (typeof obj !== "object" || obj === null) {
			throw new TypeError("Object.defineProperty called on non-object");
		}

		if (typeof descriptor !== "object" || descriptor === null) {
			throw new TypeError("Property description must be an object");
		}

		if (typeof descriptor.value !== "undefined") {
			obj[prop] = descriptor.value;
		}

		// Other descriptor attributes (writable, enumerable, configurable) are not supported in ES3

		return obj;
	};
};

/**
 * Defines new or modifies existing properties directly on an object, returning the object.
 *
 * @param {object} obj - The object on which to define or modify properties.
 * @param {object} properties - An object whose keys represent the names of properties to be defined or modified
 * and whose values are objects defining the attributes for the properties to be defined or modified.
 * ({desc1: {value: data}, desc2:...}) For example:({name: {value: "John"}, ...})
 * @throws {TypeError} If obj is not an object or is null, or if properties is not an object or is null.
 * @return {object} The object with the defined or modified properties.
 */
if (!Object.defineProperties) {
	Object.defineProperties = function (obj, properties) {
		if (typeof obj !== "object" || obj === null) {
			throw new TypeError("Object.defineProperties called on non-object");
		}
		if (typeof properties !== "object" || properties === null) {
			throw new TypeError(
				"Object.defineProperties called with non-object properties argument"
			);
		}

		for (var prop in properties) {
			if (properties.hasOwnProperty(prop)) {
				Object.defineProperty(obj, prop, properties[prop]);
			}
		}

		return obj;
	};
};

/**
 * Creates an object from an array of key-value pairs. (Counterpart of Object.entries())
 *
 * @param {Array} entries - The array of key-value pairs.
 * @return {Object} The resulting object.
 */
if (!Object.fromEntries) {
	Object.fromEntries = function (entries) {
		if (!Array.isArray(entries)) {
			throw new TypeError("Object.fromEntries requires an array as input");
		}

		var obj = {};
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];

			if (Array.isArray(entry) && entry.length === 2) {
				var key = entry[0];
				var value = entry[1];
				obj[key] = value;
			}
		}

		return obj;
	};
};

/**
 * Assigns enumerable properties from one or more source objects to a target object.
 *
 * @param {Object} targetObj - The object to assign the properties to.
 * @param {Object} sourceObj - The source object(s) containing the properties to assign.
 * @return {Object} - The target object with the assigned properties.
 */
if (!Object.assign) {
	Object.assign = function (targetObj, sourceObj /*, sourceObj2, sourceObjN*/) {
		if (!targetObj || targetObj.__class__ !== "Object")
			throw new TypeError("Target is not an Object");
		for (var i = 1; i < arguments.length; i++) {
			if (arguments[i].__class__ !== "Object")
				throw new TypeError(arguments[i].toString() + " is not an object");
		}
		for (var j = 1; j < arguments.length; j++) {
			for (var prop in arguments[j]) {
				if (arguments[j].hasOwnProperty(prop)) {
					targetObj[prop] = arguments[j][prop];
				}
			}
		}

		return targetObj;
	};
};

/**
 * Determines whether two values are the same value or both NaN.
 *
 * @param {any} x - The first value to compare.
 * @param {any} y - The second value to compare.
 * @return {boolean} Returns true if the values are the same value or both NaN; otherwise, false.
 */
if (!Object.is) {
	Object.is = function (x, y) {
		// Helper function to check for NaN
		var isItNaN = function (v) {
			return v !== v;
		};

		// Check for same value or if both are NaN
		if (x === y) {
			// Handle +/- 0
			return x !== 0 || 1 / x === 1 / y;
		} else {
			// Handle NaN
			return isItNaN(x) && isItNaN(y);
		}
	};
};

/**
 * Detects cyclic references in an object.
 *
 * @param {Object} obj - The object to check for cyclic references.
 * @return {boolean} True if the object contains cyclic references, false otherwise.
 */
if (!Object.isCyclic) {
	Object.isCyclic = function (obj) {
		var visited = [];
		var detected = false;

		function detect(obj) {
			if (isPrimitive(obj)) {
				return false;
			};
			if (visited.indexOf(obj) !== -1) {
				return detected = true;
			}

			visited.push(obj)
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					detect(obj[key])
				};
			};
			visited.pop();
		}
		detect(obj);
		return detected;
	};
};

/**
 * Groups the items based on the provided callback function.
 *
 * @param {Array|String|Map|Set|Object} items - The array, string, or iterable object to be grouped.
 * @param {function} callback - The function to be called on each item to determine the group.
 * @throws {TypeError} If the callback parameter is not a function or if the items parameter is not an iterable.
 * @return {Object} An object containing the groups as keys and arrays of items as values.
 */
if (!Object.groupBy) {
	Object.groupBy = function (items, callback) {
		if (!items) {
			throw new TypeError("Object.groupBy(): Iterable is not provided.");
		};
		if (typeof callback !== "function") {
			throw new TypeError("Object.groupBy(): You must provide a function.");
		}

		if (typeof items.length !== 'number' && typeof items.size !== 'number') {
			throw new TypeError("Object.groupBy(): works on iterables only.");
		}

		var groups = {};
		var groupName;

		if (typeof items.length === 'number') {	// Array, String or array-like iterable
			for (var i = 0; i < items.length; i++) {
				groupName = callback.call(null, items[i], i);

				groups[groupName] = groups[groupName] || [];
				groups[groupName].push(items[i]);
			}

		} else {	// Set and Map has 'size' instead of 'length'
			items.forEach(helper);

			function helper(value, key) {
				groupName = callback.call(null, value, key);

				groups[groupName] = groups[groupName] || [];
				groups[groupName].push([key, value]);
			};
		};

		return groups;
	};
};

/**
 * Compacts an object or an array by removing any falsy values.
 *
 * @param {Object|Array} val - The object or array to be compacted.
 * @throws {TypeError} If val is not an object or array.
 * @return {Object|Array} The compacted object or array.
 */
Object.compact = function (val) {
	if (!Object.isObject(val) && !Array.isArray(val)) {
		throw new TypeError("Object.compact: " + typeof val + " is not an Object.");
	};
	const data = Array.isArray(val) ? val.filter(Boolean) : val;
	return Object.keys(data).reduce(
		function (acc, key) {
			const value = data[key];
			if (Boolean(value))
				acc[key] = typeof value === 'object' ? Object.compact(value) : value;
			return acc;
		},
		Array.isArray(val) ? [] : {}
	);
};

/**
 * Compares two objects for equality.
 *
 * @param {*} a - The first object to compare.
 * @param {*} b - The second object to compare.
 * @return {boolean} - True if the objects are equal, false otherwise.
 */
Object.isEquals = function (a, b) {	// ES3 version
	if (sameValueZero(a, b)) return true;

	if (a instanceof Date && b instanceof Date)
		return a.getTime() === b.getTime();

	if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
		return sameValueZero(a, b);

	if (a.__proto__ !== b.__proto__) return false;

	const keys = Object.keys(a);
	if (keys.length !== Object.keys(b).length) return false;

	return keys.every(function (k) { return isEquals(a[k], b[k]) });
};

/**
 * Returns an array of all properties (including non-enumerable properties) 
 * found directly on a given object.
 *
 * @param {object} obj - The object to retrieve the property names from.
 * @return {array} An array of property names.
 */
if (!Object.getOwnPropertyNames) { // ChatGPT version
	Object.getOwnPropertyNames = function (obj) {
		if (obj !== Object(obj)) {
			throw new TypeError('Object.getOwnPropertyNames: called on non-object');
		}

		var propNames = [];
		for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				propNames.push(prop);
			}
		}
		return propNames;
	};
};