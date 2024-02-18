/**
 * @desc Implements the Array.from() method, which creates a new, shallow-copied Array instance
 *       from an array-like or iterable object.
 * @param {ArrayLike} arrayLike - An array-like or iterable object to convert to an array.
 * @param {Function}  [mapFn] - A map function to call on every element of the array.
 * @param {*} [thisArg] - Value to use as `this` when executing `mapFn`.
 * @return {Array} A new Array instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 */
if (!Array.from) {
    Array.from = function (arrayLike, mapFunction, thisArg) {
        if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        if (arrayLike.length >>> 0 !== arrayLike.length) {
            throw new TypeError('Array.from requires an array-like object with a length property');
        }

        var result = [];
        for (var i = 0, length = arrayLike.length; i < length; i++) {
            var element = arrayLike[i];
            result.push(mapFunction ? mapFunction.call(thisArg, element, i) : element);
        }
        return result;
    };
}