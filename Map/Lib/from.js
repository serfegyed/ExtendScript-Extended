/**
 * Creates a new Map by applying a mapping function to the elements of an iterable object.
 *
 * @param {Object|Array|Map} iterable - The iterable object whose elements will be mapped.
 * @param {Function} callback - The function to be applied to each element of the iterable. (default: identity function)
 * @param {Object} thisArg - The value to use as `this` when executing the callback function.
 * @return {Map} A new Map object containing the mapped key-value pairs.
 */
Map.from = function (iterable, callback, thisArg) {
    var result = new Map();
    var i;
    var key;
    var iterator;
    var entry;

    if (iterable === null || iterable === undefined ||
            typeof iterable !== "object") {
        throw new TypeError("Map.from: source must be an object.");
    }

    if (callback === undefined) {
        callback = function (value, sourceKey) {
            return [sourceKey, value];
        };
    } else if (typeof callback !== "function") {
        throw new TypeError("Map.from: mapper must be a function.");
    }

    function processEntry(value, sourceKey) {
        var transformed = callback.call(thisArg, value, sourceKey);
        if (!(transformed instanceof Array) || transformed.length !== 2) {
            throw new TypeError("Map.from: mapper must return a key-value pair.");
        }
        result.set(transformed[0], transformed[1]);
    }

    if (iterable instanceof Array) {
        for (i = 0; i < iterable.length; i++) {
            if (iterable[i] instanceof Array && iterable[i].length === 2) {
                processEntry(iterable[i][1], iterable[i][0]);
            }
        }
    } else if (iterable instanceof Map) {
        iterator = iterable.entries();
        entry = iterator.next();
        while (!entry.done) {
            processEntry(entry.value[1], entry.value[0]);
            entry = iterator.next();
        }
    } else if (typeof iterable.length === "number") {
        for (i = 0; i < iterable.length; i++) {
            processEntry(iterable[i], i);
        }
    } else {
        for (key in iterable) {
            if (Object.prototype.hasOwnProperty.call(iterable, key)) {
                processEntry(iterable[key], key);
            }
        }
    }

    return result;
};
