/**
 * Returns the present value with the largest mapped key.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.max) {
    Array.prototype.max = function (salient) {
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
        mapper = typeof salient === "string" ? function (item) {
            return item[salient];
        } : (salient || function (item) { return item; });
        if (typeof mapper !== "function") {
            throw new TypeError("Array.prototype.max: mapper must be a function or string.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
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
