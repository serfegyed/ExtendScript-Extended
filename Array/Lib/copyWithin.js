/**
 * Copies indexed properties within an Array or array-like object.
 */
if (!Array.prototype.copyWithin) {
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

    Array.prototype.copyWithin = function (target, start, end) {
        "use strict";

        var object;
        var length;
        var to;
        var from;
        var finalIndex;
        var count;
        var direction = 1;

        if (this === null || this === undefined) {
            throw new TypeError(
                "Array.prototype.copyWithin called on null or undefined."
            );
        }

        object = Object(this);
        length = toLength(object.length);
        to = toInteger(target);
        from = toInteger(start);
        finalIndex = end === undefined ? length : toInteger(end);

        to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);
        from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);
        finalIndex = finalIndex < 0 ?
            Math.max(length + finalIndex, 0) : Math.min(finalIndex, length);
        count = Math.min(finalIndex - from, length - to);

        if (from < to && to < from + count) {
            direction = -1;
            from += count - 1;
            to += count - 1;
        }

        while (count > 0) {
            if (from in object) {
                object[to] = object[from];
            } else {
                delete object[to];
            }
            from += direction;
            to += direction;
            count--;
        }
        return object;
    };
}
