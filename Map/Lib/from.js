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
        throw new TypeError(iterable + " is not an object.");
    }

    mapFunc = mapFunc || function (item) { return item; };

    var result = new Map();
    var processEntry = function (entry) {
        var elem = mapFunc.call(thisArg, entry);
        result.set(elem[0], elem[1]);
    };

    if (iterable instanceof Array) {
        iterable.forEach(function (item, index) {
            if (item instanceof Array) {
                processEntry(item);
            }
        });
    } else if (iterable instanceof Map) {
        iterable.forEach(function (value, key) {
            processEntry([key, value]);
        });
    } else {
        for (var key in iterable) {
            if (iterable.hasOwnProperty(key)) {
                processEntry([key, iterable[key]]);
            }
        }
    }

    return result;
};