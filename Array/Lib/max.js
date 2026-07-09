/**
 * Returns the present value with the largest mapped key.
 */
if (!Array.prototype.max) {
    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

    Array.prototype.max = function (key) {
        "use strict";

        var object;
        var length;
        var mapper;
        var maxValue;
        var maxKey;
        var value;
        var key;
        var i = 0;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.max called on null or undefined.");
        }
        mapper = typeof key === "string" ? function (item) {
            return item[key];
        } : (key || function (item) { return item; });
        if (typeof mapper !== "function") {
            throw new TypeError("Array.prototype.max: mapper must be a function or string.");
        }

        object = Object(this);
        length = toLength(object.length);
        while (i < length && !(i in object)) i++;
        if (i >= length) return undefined;
        maxValue = object[i++];
        maxKey = mapper(maxValue);
        for (; i < length; i++) {
            if (i in object) {
                value = object[i];
                key = mapper(value);
                if (key > maxKey) {
                    maxValue = value;
                    maxKey = key;
                }
            }
        }
        return maxValue;
    };
}
