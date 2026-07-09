/**
 * Merges a sorted Array into the sorted receiver and mutates the receiver.
 */
//@include "./isArray.js"
if (!Array.prototype.merge) {
    Array.prototype.merge = function (arrayToMerge, compareFunction) {
        "use strict";

        var compare;
        var result;
        var i = 0;
        var j = 0;
        var k = 0;
        var leftLength;
        var rightLength;

        if (!Array.isArray(this) || !Array.isArray(arrayToMerge)) {
            throw new TypeError("Array.prototype.merge requires two Arrays.");
        }
        if (compareFunction !== undefined && typeof compareFunction !== "function") {
            throw new TypeError("Array.prototype.merge: comparator must be a function.");
        }
        compare = compareFunction === undefined ? function (a, b) {
            if (a === undefined) return b === undefined ? 0 : 1;
            if (b === undefined) return -1;
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        } : compareFunction;
        leftLength = this.length;
        rightLength = arrayToMerge.length;
        result = new Array(leftLength + rightLength);
        while (i < leftLength && j < rightLength) {
            result[k++] = compare(this[i], arrayToMerge[j]) <= 0 ?
                this[i++] : arrayToMerge[j++];
        }
        while (i < leftLength) result[k++] = this[i++];
        while (j < rightLength) result[k++] = arrayToMerge[j++];

        this.length = result.length;
        for (i = 0; i < result.length; i++) this[i] = result[i];
        return this;
    };
}
