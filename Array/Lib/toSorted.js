/**
 * Returns a dense, shallow, sorted copy.
 */
//@include "./arrayInternals.js"
if (!Array.prototype.toSorted) {
    Array.prototype.toSorted = function (compareFunction) {
        "use strict";

        var object;
        var length;
        var items = [];
        var undefinedCount = 0;
        var result;
        var value;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.toSorted called on null or undefined.");
        }
        if (compareFunction !== undefined && typeof compareFunction !== "function") {
            throw new TypeError("Array.prototype.toSorted: comparator must be a function.");
        }
        object = Object(this);
        length = __arrayToLength__(object.length);
        for (i = 0; i < length; i++) {
            value = object[i];
            if (typeof value === "undefined") {
                undefinedCount++;
            } else {
                items[items.length] = {value: value, index: i};
            }
        }
        Array.prototype.sort.call(items, function (a, b) {
            var comparison;
            var aString;
            var bString;

            if (compareFunction === undefined) {
                aString = String(a.value);
                bString = String(b.value);
                comparison = aString < bString ? -1 : (aString > bString ? 1 : 0);
            } else {
                comparison = Number(compareFunction(a.value, b.value));
                if (comparison !== comparison) comparison = 0;
            }
            return comparison === 0 ? a.index - b.index : comparison;
        });

        result = new Array(length);
        for (i = 0; i < items.length; i++) result[i] = items[i].value;
        for (; undefinedCount > 0; undefinedCount--) result[i++] = undefined;
        return result;
    };
}
