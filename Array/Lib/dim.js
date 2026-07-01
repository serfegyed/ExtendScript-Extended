/**
 * Returns the maximum nested Array depth of every indexed value.
 */
//@include "./arrayInternals.js"
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

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.dim called on null or undefined.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        dimensions = new Array(length);
        for (i = 0; i < length; i++) {
            dimensions[i] = Array.isArray(object[i]) ? getDepth(object[i]) : 0;
        }
        return dimensions;
    };
}
