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
    Array.from = function (arrayLike /*, mapFunction, thisArg*/) {
        if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        var result = [];
        var length = arrayLike.length;
        if (typeof length !== "number") {
            throw new TypeError('Array.from requires an array-like object with a length property');
        }

        var mapFunction = arguments[1];
        var thisArg = arguments[2];
        for (var i = 0; i < length; i++) {
            var element = arrayLike[i];
            if (mapFunction) {
                result.push(mapFunction.call(thisArg, element, i));
            } else {
                result.push(element);
            }
        }
        return result;
    };
};