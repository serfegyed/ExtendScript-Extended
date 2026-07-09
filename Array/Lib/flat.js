/**
 * Flattens nested Arrays up to the requested depth.
 */
if (!Array.prototype.flat) {
    function toInteger(value) {
        var number = Number(value);

        if (number !== number || number === 0) return 0;
        if (number === Infinity || number === -Infinity) return number;
        return number < 0 ? Math.ceil(number) : Math.floor(number);
    }

    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

    Array.prototype.flat = function (depth) {
        "use strict";

        var object;
        var flatDepth;
        var result = [];

        function flattenInto(source, sourceLength, currentDepth) {
            var value;
            var i;

            for (i = 0; i < sourceLength; i++) {
                if (i in source) {
                    value = source[i];
                    if (currentDepth > 0 && value instanceof Array) {
                        flattenInto(value, toLength(value.length),
                            currentDepth - 1);
                    } else {
                        result[result.length] = value;
                    }
                }
            }
        }

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.flat called on null or undefined.");
        }
        object = Object(this);
        flatDepth = depth === undefined ? 1 : toInteger(depth);
        if (flatDepth < 0) flatDepth = 0;
        flattenInto(object, toLength(object.length), flatDepth);
        return result;
    };
}
