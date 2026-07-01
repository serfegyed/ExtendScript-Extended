/**
 * Returns a dense, shallow copy with a range removed and items inserted.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.toSpliced) {
    Array.prototype.toSpliced = function (start, deleteCount) {
        "use strict";

        var object;
        var length;
        var relativeStart;
        var actualStart;
        var actualDeleteCount;
        var itemCount;
        var result;
        var i;
        var target;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.toSpliced called on null or undefined.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        relativeStart = __arrayToInteger__(start);
        actualStart = relativeStart < 0 ? Math.max(length + relativeStart, 0) :
            Math.min(relativeStart, length);
        itemCount = arguments.length > 2 ? arguments.length - 2 : 0;
        if (arguments.length === 0) {
            actualDeleteCount = 0;
        } else if (arguments.length === 1) {
            actualDeleteCount = length - actualStart;
        } else {
            actualDeleteCount = Math.min(
                Math.max(__arrayToInteger__(deleteCount), 0),
                length - actualStart
            );
        }

        result = new Array(length - actualDeleteCount + itemCount);
        target = 0;
        for (i = 0; i < actualStart; i++) result[target++] = object[i];
        for (i = 0; i < itemCount; i++) result[target++] = arguments[i + 2];
        for (i = actualStart + actualDeleteCount; i < length; i++) {
            result[target++] = object[i];
        }
        return result;
    };
}
