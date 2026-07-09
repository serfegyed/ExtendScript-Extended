/**
 * Returns the maximum nested Array depth of every indexed value.
 */
//@include "./isArray.js"
if (!Array.prototype.dim) {
    Array.prototype.dim = function () {
        "use strict";

        var object;
        var length;
        var dimensions;
        var i;

        function getDepth(array) {
            var maxDepth = 1;
            var childDepth;
            var j;

            for (j = 0; j < array.length; j++) {
                if (Array.isArray(array[j])) {
                    childDepth = 1 + getDepth(array[j]);
                    if (childDepth > maxDepth) maxDepth = childDepth;
                }
            }
            return maxDepth;
        }

        function toLength(value) {
            var number = Number(value);

            if (number !== number || number <= 0) return 0;
            if (number === Infinity) return 9007199254740991;
            return Math.min(Math.floor(number), 9007199254740991);
        }

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.dim called on null or undefined.");
        }
        object = Object(this);
        length = toLength(object.length);
        dimensions = new Array(length);
        for (i = 0; i < length; i++) {
            dimensions[i] = Array.isArray(object[i]) ? getDepth(object[i]) : 0;
        }
        return dimensions;
    };
}
