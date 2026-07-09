/**
 * Returns a dense, shallow copy with a range removed and items inserted.
 */
if (!Array.prototype.toSpliced) {
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
        length = toLength(object.length);
        relativeStart = toInteger(start);
        actualStart = relativeStart < 0 ? Math.max(length + relativeStart, 0) :
            Math.min(relativeStart, length);
        itemCount = arguments.length > 2 ? arguments.length - 2 : 0;
        if (arguments.length === 0) {
            actualDeleteCount = 0;
        } else if (arguments.length === 1) {
            actualDeleteCount = length - actualStart;
        } else {
            actualDeleteCount = Math.min(
                Math.max(toInteger(deleteCount), 0),
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
