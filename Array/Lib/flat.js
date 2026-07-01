/**
 * Flattens nested Arrays up to the requested depth.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.flat) {
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
                        flattenInto(value, __arrayToLength__(value.length),
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
        flatDepth = depth === undefined ? 1 : __arrayToInteger__(depth);
        if (flatDepth < 0) flatDepth = 0;
        flattenInto(object, __arrayToLength__(object.length), flatDepth);
        return result;
    };
}
