/**
 * Returns the present value with the smallest mapped key.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.min) {
    Array.prototype.min = function (salient) {
        "use strict";

        var object;
        var length;
        var mapper;
        var minValue;
        var minKey;
        var value;
        var key;
        var i = 0;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.min called on null or undefined.");
        }
        mapper = typeof salient === "string" ? function (item) {
            return item[salient];
        } : (salient || function (item) { return item; });
        if (typeof mapper !== "function") {
            throw new TypeError("Array.prototype.min: mapper must be a function or string.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        while (i < length && !(i in object)) i++;
        if (i >= length) return undefined;
        minValue = object[i++];
        minKey = mapper(minValue);
        for (; i < length; i++) {
            if (i in object) {
                value = object[i];
                key = mapper(value);
                if (key < minKey) {
                    minValue = value;
                    minKey = key;
                }
            }
        }
        return minValue;
    };
}
