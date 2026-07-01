/**
 * Merges a sorted Array into the sorted receiver and mutates the receiver.
 */
//@include "./arrayInternals.js"
//@include "./isArray.js"
if (!Array.prototype.merge) {
    Array.prototype.merge = function (arrayToMerge, compareFunction) {
        "use strict";

        var compare;
        var result;
        var i = 0;
        var j = 0;
        var k = 0;

        if (!Array.isArray(this) || !Array.isArray(arrayToMerge)) {
            throw new TypeError("Array.prototype.merge requires two Arrays.");
        }
        if (compareFunction !== undefined && typeof compareFunction !== "function") {
            throw new TypeError("Array.prototype.merge: comparator must be a function.");
        }
        compare = compareFunction === undefined ?
            __arrayDefaultCompare__ : compareFunction;
        result = new Array(this.length + arrayToMerge.length);
        while (i < this.length && j < arrayToMerge.length) {
            result[k++] = compare(this[i], arrayToMerge[j]) <= 0 ?
                this[i++] : arrayToMerge[j++];
        }
        while (i < this.length) result[k++] = this[i++];
        while (j < arrayToMerge.length) result[k++] = arrayToMerge[j++];

        this.length = result.length;
        for (i = 0; i < result.length; i++) this[i] = result[i];
        return this;
    };
}
