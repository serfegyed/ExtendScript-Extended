/**
 * Creates a new Map by applying a mapping function to the elements of an iterable object.
 *
 * @param {Object|Array|Map} iterable - The iterable object whose elements will be mapped.
 * @param {Function} mapFunc - The function to be applied to each element of the iterable. (default: identity function)
 * @param {Object} thisArg - The value to use as `this` when executing the map function.
 * @return {Map} A new Map object containing the mapped key-value pairs.
 */
Map.from = function (iterable, mapFunc, thisArg) {
    if (!iterable || typeof iterable !== 'object') {
        throw new TypeError("Expected an object for 'iterable' but received: " + (typeof iterable));
    }

    // Default identity function if no mapFunc is provided.
    mapFunc = mapFunc || function (value, key) { return [key, value]; };

    var result = new Map();

    function processEntry(value, key) {
        var transformed = mapFunc.call(thisArg, value, key);
        if (!Array.isArray(transformed) || transformed.length !== 2) {
            throw new TypeError(iterable + " is not an object.");
        }
        result.set(transformed[0], transformed[1]);
    }

    if (iterable instanceof Array) {
        for (var i = 0; i < iterable.length; i++) {
            if (Array.isArray(iterable[i]) && iterable[i].length === 2) {
                processEntry(iterable[i][1], iterable[i][0]);
            }
        }
    } else if (iterable instanceof Map) {
        for (var j = 0; j < iterable._entries.length; j++) {
            processEntry(iterable._entries[j][1], iterable._entries[j][0]);
        }
    } else if (typeof iterable.length === 'number') { // Handling for array-like objects
        for (var k = 0; k < iterable.length; k++) {
            processEntry(iterable[k], k);
        }
    } else {
        for (var key in iterable) {
            if (iterable.hasOwnProperty(key)) {
                processEntry(iterable[key], key);
            }
        }
    }

    return result;
};